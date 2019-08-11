/**
 * 400, bad request response
 * @param {String} functionName The name of the function to specify the error
 * @param {err} err The output of the error
 * @return {JSON} All the information needed from the error
 */
function badRequestError(functionName, err) {
  return {
    value: 400,
    message: `Bad request: ${err}`,
    function: functionName,
  };
};

/**
 * 401, Unauthorized response
 * @param {String} functionName The name of the function to specify the error
 * @param {err} err The output of the error
 * @return {JSON} All the information needed from the error
 */
function unauthorized(functionName, err) {
  return {
    value: 401,
    message: 'Unauthorized',
    function: functionName,
  };
};

/**
 * 404, not found response
 * @param {String} functionName The name of the function to specify the error
 * @param {String} err The output of the error
 * @return {JSON} All the information needed from the error
 */
function notFoundError(functionName, err) {
  return {
    value: 404,
    message: `Not found: ${err}`,
    function: functionName,
  };
};

/**
 * 500, internal server response
 * @param {String} functionName The name of the function to specify the error
 * @param {err} err The output of the error
 * @return {JSON} All the information needed from the error
 */
function internalServerError(functionName, err) {
  return {
    value: 500,
    message: `Internal server error: ${err}`,
    function: functionName,
  };
};


module.exports = {
  badRequestError,
  unauthorized,
  notFoundError,
  internalServerError,
};
