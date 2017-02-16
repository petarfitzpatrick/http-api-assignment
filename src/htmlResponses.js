const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  respond(request, response, index, 200, 'text/html');
};

const getStyle = (request, response) => {
  respond(request, response, css, 200, 'text/css');
};

const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

const makeResponse = (request, response, sentObj, status, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
	//create a valid XML string
    let responseXML = '<response>';
    responseXML = `${responseXML} <type>${sentObj.type}</type>`;
    responseXML = `${responseXML} <message>${sentObj.message}</message>`;
    responseXML = `${responseXML} <id>${sentObj.id}</id>`;
    responseXML = `${responseXML} </response>`;    

	//return response passing out string and content type
    return respond(request, response, responseXML, status, 'text/xml');
  } else {
    return respond(request, response, JSON.stringify(sentObj), status, 'application/json');
  }
};

const getSuccess = (request, response, acceptedTypes) => {
  //object to send
  const obj = {
    type: 'Success',
    message: 'This is a successful response',
  };

  makeResponse(request, response, obj, 200, acceptedTypes);
};

const getBadRequest = (request, response, acceptedTypes, params) => {
    const obj = {
        message: 'Parameter is true',
    };
    
    if (!params.valid || params.valid !== 'true') {
        obj.type = 'Bad Request'
        obj.message = 'Missing true parameter';
        obj.id = 'badRequest';
        
        makeResponse(request, response, obj, 400, acceptedTypes);
    } else {
    
    makeResponse(request, response, obj, 200, acceptedTypes);
    }
};

const getUnauthorized = (request, response, acceptedTypes, params) => {
    const obj = {
        message: 'You are logged in',
    };
    
    if (!params.loggedIn || params.loggedIn !== 'yes') {
        obj.type = 'Unauthorized'
        obj.message = 'Missing loggedIn parameter';
        obj.id = 'unauthorized';
        
        makeResponse(request, response, obj, 401, acceptedTypes);
    } else {
    
    makeResponse(request, response, obj, 200, acceptedTypes);
    }
};

const getForbidden = (request, response, acceptedTypes) => {
  //object to send
  const obj = {
    type: 'Forbidden',
    message: 'You do not have access to this content.',
  };

  makeResponse(request, response, obj, 403, acceptedTypes);
};

const getInternal = (request, response, acceptedTypes) => {
  //object to send
  const obj = {
    type: 'Internal Server Error',
    message: 'Something went wrong.',
  };

  makeResponse(request, response, obj, 500, acceptedTypes);
};

const getNotImplemented = (request, response, acceptedTypes) => {
  //object to send
  const obj = {
    type: 'Not Implemented',
    message: 'A get request for this page has not been implemented.',
    id: 'notImplemented'
  };

  makeResponse(request, response, obj, 501, acceptedTypes);
};

const getNotFound = (request, response, acceptedTypes) => {
  //object to send
  const obj = {
    type: 'Not Found',
    message: 'The page you are looking for does not exist.',
    id: 'notFound'
  };

  makeResponse(request, response, obj, 404, acceptedTypes);
};

module.exports.getIndex = getIndex;
module.exports.getStyle = getStyle;
module.exports.getSuccess = getSuccess;
module.exports.getBadRequest = getBadRequest;
module.exports.getUnauthorized = getUnauthorized;
module.exports.getForbidden = getForbidden;
module.exports.getInternal = getInternal;
module.exports.getNotImplemented = getNotImplemented;
module.exports.getNotFound = getNotFound;