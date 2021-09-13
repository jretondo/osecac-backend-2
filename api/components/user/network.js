const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const list = (req, res, next) => {
    Controller.list()
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
            response.success(req, res, 201, "Usuario creado")
        })
        .catch(next)
}

const recPass = async (req, res, next) => {
    Controller.recPass(req.body.user, next)
        .then(() => {
            response.success(req, res, 200)
        })
        .catch(next)
}

//Routes
router.get("/", secure(1), list)
router.get("/get/:id", secure(1), get)
router.post("/", upsert)
router.put("/", secure(1), upsert)
router.put("/recPass", recPass)

module.exports = router