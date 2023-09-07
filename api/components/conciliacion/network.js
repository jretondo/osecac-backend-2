const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const config = require("../../../config")

//internal Functions
const getTransf = (req, res, next) => {
    Controller.getTransf(req.query.desde, req.query.hasta, req.query.pend, req.query.busqueda, req.query.importe, req.query.sinCos)
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
    Controller.download(req.query.desde, req.query.hasta, req.query.pend, req.query.busqueda, req.query.importe, config.private, false, next)
        .then((filePath) => {
            response.file(req, res, filePath, 'application/pdf', "Transferencias-" + req.query.desde + "-al-" + req.query.hasta + ".pdf")
        })
        .catch(next)
}

const createExcel = (req, res, next) => {
    Controller.download(req.query.desde, req.query.hasta, req.query.pend, req.query.busqueda, req.query.importe, config.private, true, next)
        .then((filePath) => {
            response.file(req, res, filePath, 'application/vnd.ms-excel', "Transferencias-Excel", "Transferencias-" + req.query.desde + "-al-" + req.query.hasta + ".xls")
        })
        .catch(next)
}

const getDepTransf = (req, res, next) => {
    Controller.getDepTransf(req.query.fromDate, req.query.toDate, req.query.type)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const getValores = (req, res, next) => {
    Controller.getValores(req.query.fromDate, req.query.toDate)
        .then((filePath) => {
            response.file(req, res, filePath, 'application/vnd.ms-excel', "Valores-Excel", "Valores-" + req.query.desde + "-al-" + req.query.hasta + ".xls")
        })
        .catch(next)
}

//Routes
router.get("/transf", secure(7), getTransf)
router.get("/transfDep", secure(7), getDepTransf)
router.get("/download/", secure(7), download)
router.get("/excel/", secure(7), createExcel)
router.get("/valores/", secure(7), getValores)
router.patch("/:id", secure(7), updateCustom)
module.exports = router