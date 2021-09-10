const fs = require("fs")

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

exports.file = (req, res, filePath, contentType, filenameDownload) => {
    var file = fs.createReadStream(filePath)
    var stat = fs.statSync(filePath)
    res.setHeader('Content-Length', stat.size)
    res.setHeader('Content-Type', contentType)
    res.setHeader('Content-Disposition', 'attachment; filename=' + filenameDownload)
    file.pipe(res)
}