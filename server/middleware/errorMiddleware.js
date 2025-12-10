
const  notFound = (req, res, next) => {

    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error);
}

// Error middleware

const errorHandler = (error, req, res, next) => {

    if(res.headerSent) {
        return next(error);
    }

    // Handle specific error types
    if (error.code === 'ETIMEDOUT' || error.name === 'TimeoutError') {
        return res.status(499).json({
            error: {
                message: 'Request Timeout',
                http_code: 499,
                name: 'TimeoutError'
            }
        });
    }

    if (error.code === 'ECONNREFUSED' || error.message?.includes('Bad Gateway')) {
        return res.status(502).json({
            message: 'Server returned unexpected status code - 502',
            http_code: 502,
            name: 'UnexpectedResponse'
        });
    }

    // Handle mongoose connection errors
    if (error.name === 'MongooseServerSelectionError') {
        return res.status(503).json({
            message: 'Database connection failed',
            http_code: 503,
            name: 'ServiceUnavailable'
        });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            http_code: 400,
            name: 'ValidationError',
            details: error.errors
        });
    }

    // Default error handling
    const statusCode = error.statusCode || error.code || 500;
    const message = error.message || "An unknown error occurred.";

    res.status(statusCode).json({
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
}

module.exports = {notFound, errorHandler}

