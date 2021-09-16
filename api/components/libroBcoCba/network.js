const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const uploadFile = require('../../../utils/multer')
const path = require('path')

//internal Functions
const process = (req, res, next) => {
    Controller.process(req.files[0].fieldname, req.user.id, req.body)
        .then(() => {
            response.success(req, res, 201, "Excel procesado")
        })
        .catch(next)
}

const remove = (req, res, next) => {
    Controller.remove({ date: req.params.fecha })
        .then(() => {
            response.success(req, res, 200, "Día eliminado")
        })
        .catch(next)
}

const removeOne = (req, res, next) => {
    Controller.remove({ id: req.params.id })
        .then(() => {
            response.success(req, res, 200, "Movimiento eliminado")
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
    response.success(req, res, 200)
}

const get = (req, res, next) => {
    Controller.getMovimientos(req.params.page, req.query.fecha, req.query.filtro)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const update = async (req, res, next) => {
    req.body.id = req.params.id
    Controller.upsert(req.body)
        .then(() => {
            response.success(req, res, 200)
        })
        .catch(next)
}

const insert = async (req, res, next) => {
    Controller.upsert(req.body)
        .then(() => {
            response.success(req, res, 201)
        })
        .catch(next)
}

//Routes
router.post("/process", secure(2), uploadFile(path.join("Archivos", "Libro-Excel-Disca")), process)
router.delete("/:fecha", secure(2), remove)
router.delete("/removeId/:id", secure(2), removeOne)
router.get("/list/:page", secure(2), list)
router.get("/download/", secure(2), download)
router.get("/:page", secure(2), get)
router.put("/:id", secure(2), update)
router.post("/", secure(2), insert)
module.exports = router