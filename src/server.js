const http = require('http'); // pull in the HTTP server module
const htmlHandler = require('./htmlResponses.js');
const url = require('url');
const query = require('querystring');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getStyle,
    '/success': htmlHandler.getSuccess,
    '/badRequest': htmlHandler.getBadRequest,
    '/unauthorized': htmlHandler.getUnauthorized,
    '/forbidden': htmlHandler.getForbidden,
    '/internal': htmlHandler.getInternal,
    '/notImplemented': htmlHandler.getNotImplemented,
    notFound: htmlHandler.getNotFound
}

const onRequest = (request, response) => {
  console.log(request.url);
    
  const acceptedTypes = request.headers.accept.split(',');
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
    
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes, params);
  }
    
    
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);