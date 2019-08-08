/**
 * 404, not found response
 * @param {String} functionName The name of the function to specify the error
 * @return {JSON} All the information needed from the error
 */
function notFoundError(functionName) {
  return {
    value: 404,
    message: 'Not found',
    function: functionName,
  };
};

/**
 * 400, bad request response
 * @param {String} functionName The name of the function to specify the error
 * @return {JSON} All the information needed from the error
 */
function badRequestError(functionName) {
  return {
    value: 400,
    message: 'Bad request',
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
    value: 404,
    message: `Internal server error: ${err}`,
    function: functionName,
  };
};

module.exports = {
  notFoundError,
  badRequestError,
  internalServerError,
};
