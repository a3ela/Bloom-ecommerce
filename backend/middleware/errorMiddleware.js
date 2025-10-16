const notFound = (request, response, next) => {
    const error = new Error(`Not Found - ${request.originalUrl}`);
    response.status(404);
    next(error);
}

const errorHandler = (error, request, response, next) => {
    const statusCode = response.statusCode === 200 ? 500 : response.statusCode;
    response.status(statusCode);
    let message = error.message;


    if (error.name === "CastError" && error.kind === "ObjectId") {
        message = "Resource not found";
        response.status(404);
    }

    response.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack
    })
}

module.exports = { notFound, errorHandler };    