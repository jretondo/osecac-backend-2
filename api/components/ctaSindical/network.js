const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const config = require("../../../config")

//internal Functions
const list = (req, res, next) => {
    Controller.list(req.params.page, req.query.palabra, req.query.tipo)
        .then(lista => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const list2 = (req, res, next) => {
    Controller.list2(req.query.palabra, req.query.tipo, req.query.cbu)
        .then(lista => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const get = (req, res, next) => {
    Controller.get(parseInt(req.params.id))
        .then(user => {
            response.error(req, res, 200, user)
        })
        .catch(next)
}

const upsert = (req, res, next) => {
    Controller.upsert(req.body)
        .then(() => {
            response.success(req, res, 201, "Agencia creada")
        })
        .catch(next)
}

const newTxt = (req, res, next) => {
    Controller.newTxt(req.body, config.private.cbuBcoCba)
        .then((respuesta) => {
            response.file(req, res, respuesta.filePath, 'text/plain', "Archivo pagos prov " + respuesta.fileName + ".txt")
        })
        .catch(next)
}

const remove = (req, res, next) => {
    Controller.remove(req.params.id, req.query.tipo)
        .then(() => {
            response.success(req, res)
        })
        .catch(next)
}

//Routes
router.get("/get/:id", secure(4), get)
router.post("/newTxt", secure(4), newTxt)
router.get("/:page", secure(4), list)
router.get("/", secure(4), list2)
router.post("/", secure(4), upsert)
router.put("/", secure(4), upsert)
router.delete("/:id", secure(4), remove)

module.exports = router