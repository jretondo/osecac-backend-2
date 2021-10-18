const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const getTransf = (req, res, next) => {
    Controller.getTransf(req.query.desde, req.query.hasta, req.query.pend, req.query.busqueda, req.query.importe)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const updateCustom = async (req, res, next) => {
    Controller.update(req.params.id, req.body.set)
        .then(() => {
            response.success(req, res)
        })
        .catch(next)
}

const download = (req, res, next) => {
    Controller.download(req.query.desde, req.query.hasta, req.query.pend, req.query.busqueda, req.query.importe, config.private, next)
        .then((filePath) => {
            response.file(req, res, filePath, 'application/pdf', "Extracto-" + req.query.desde + "-al-" + req.query.hasta + ".pdf")
        })
        .catch(next)
}

//Routes
router.get("/transf", secure(7), getTransf)
router.get("/download/", secure(3), download)
router.patch("/:id", secure(3), updateCustom)

module.exports = router