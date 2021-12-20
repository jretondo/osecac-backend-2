const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
const secure = require('../proveedores/secure')
const Controller = require("./index")

//internal Functions
const get = (req, res, next) => {
    Controller.getNroProv(parseInt(req.params.nroProv))
        .then(user => {
            response.error(req, res, 200, user)
        })
        .catch(next)
}

const listPages = (req, res, next) => {
    Controller.list(req.params.page, req.query.palabra)
        .then(lista => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const upsert = (req, res, next) => {
    Controller.upsert(req.body)
        .then(() => {
            response.success(req, res, 201, "Prestador creado")
        })
        .catch(next)
}

const updateCbu = (req, res, next) => {
    Controller.insertCbu()
        .then(() => {
            response.success(req, res, 200, "CBU actualizados")
        })
        .catch(next)
}

//Routes
router.get("/list/:page", secure(6), listPages)
router.get("/updateCbu", updateCbu)
router.get("/:nroProv", secure(6), get)
router.post("/", secure(6), upsert)

module.exports = router