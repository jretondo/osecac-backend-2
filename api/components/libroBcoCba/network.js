const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const upsertTal = async (req, res, next) => {
    Controller.talonarioUpsert(req.body.data)
        .then(async () => {
            const data = await Controller.listaTalPend()
            req.app.io.emit('FromAPI', { data });
            response.success(req, res, 201)
        })
        .catch(next)
}

const deleteTal = async (req, res, next) => {
    Controller.removeRange(req.params.id)
        .then(async () => {
            const data = await Controller.listaTalPend()
            req.app.io.emit('FromAPI', { data });
            response.success(req, res, 201)
        })
        .catch(next)
}

const verificarTal = async (req, res, next) => {
    Controller.verificaTal(req.params.id)
        .then(async (lista) => {
            const data = await Controller.listaTalPend()
            req.app.io.emit('FromAPI', { data });
            response.success(req, res, 200, lista)
        })
        .catch(next)
}

const dataTal = async (req, res, next) => {
    Controller.listaTalPend()
        .then((data) => {
            req.app.io.emit('FromAPI', { data });
            response.success(req, res, 200, data)
        })
        .catch(next)
}

const siguientes = async (req, res, next) => {
    Controller.siguienteUso(req.query.bol, req.query.chq)
        .then(data => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

const verificaNumero = (req, res, next) => {
    Controller.verificaNro(parseInt(req.query.tipo), req.query.numero)
        .then(data => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

//Routes
router.post("/talonarios", secure(2), upsertTal)
    .get("/talonarios/siguientes", secure(2), siguientes)
    .get("/talonarios/verifica/:id", secure(2), verificarTal)
    .get("/talonarios/verificaNum", secure(2), verificaNumero)
    .get("/talonarios", secure(2), dataTal)
    .delete("/talonarios/:id", secure(2), deleteTal)

module.exports = router