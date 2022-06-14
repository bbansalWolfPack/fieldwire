const getErrorResponse = (errorMessage) => {
  return {
    error: errorMessage,
  };
};

const getSuccessResponse = (data) => {
  return {
    data,
  };
};

module.exports = {
  getErrorResponse,
  getSuccessResponse,
};
