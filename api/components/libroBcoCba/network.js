const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const uploadFile = require('../../../utils/multer')
const path = require('path')

//internal Functions
const upsertTal = async (req, res, next) => {
    Controller.talonarioUpsert(req.body)
        .then(() => {
            response.success(req, res, 201)
        })
        .catch(next)
}

const deleteTal = async (req, res, next) => {
    Controller.removeRange(req.params.id)
        .then(() => {
            response.success(req, res, 201)
        })
        .catch(next)
}

const verificarTal = async (req, res, next) => {
    Controller.verificaTal(req.params.id)
        .then((lista) => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const listadoTal = async (req, res, next) => {
    Controller.listaTalPend()
        .then((lista) => {
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

//Routes
router.post("/talonarios", secure(2), upsertTal)
router.get("/talonarios", secure(2), listadoTal)
router.get("/talonarios/verifica/:id", secure(2), verificarTal)
router.delete("/talonarios/:id", secure(2), deleteTal)

module.exports = router