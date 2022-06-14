const getErrorResponse = (statusCode, errorMessage) => {
    return {
        statusCode,
        errorMessage
    }
}

const getSuccessResponse = (statusCode, data) => {
    return {
        statusCode,
        data
    }
}

module.exports = {
    getErrorResponse,
    getSuccessResponse
}