exports.success = (req, res, status = 200, message = '') => {
    res.status(status).send({
        error: false,
        status: status,
        body: message
    })
}

exports.error = (req, res, status = 500, message = 'Error interno') => {
    res.status(status).send({
        error: true,
        status: status,
        body: message
    })
}