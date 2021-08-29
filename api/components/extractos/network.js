const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const uploadFile = require('../../../utils/multer')
const path = require('path')
const config = require("../../../config")

//internal Functions
const process = (req, res, next) => {
    Controller.process(req.files[0].fieldname, req.user.id)
        .then(() => {
            response.success(req, res, 201, "Extracto procesado")
        })
        .catch(next)
}

const remove = (req, res, next) => {
    Controller.remove(req.params.fecha)
        .then(() => {
            response.success(req, res, 200, "Extracto eliminado")
        })
        .catch(next)
}

const list = (req, res, next) => {
    Controller.list(req.params.page, req.query.desde, req.query.hasta)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const download = (req, res, next) => {
    Controller.download(req.query.desde, req.query.hasta, config.private, next)
        .then((filePath) => {
            response.file(req, res, filePath, 'application/pdf', "Extracto-" + req.query.desde + "-al-" + req.query.hasta + ".pdf")
        })
        .catch(next)
}

//Routes
router.post("/process", secure(3), uploadFile(path.join("Archivos", "Extractos-Excel")), process)
router.delete("/remove/:fecha", secure(3), remove)
router.get("/list/:page", secure(3), list)
router.get("/download/", download)
module.exports = router