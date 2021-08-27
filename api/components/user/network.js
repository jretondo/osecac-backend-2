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

const follow = (req, res, next) => {
    Controller.follow(req.user.id, req.params.id)
        .then(() => {
            response.success(req, res, 201, "Seguido correctamente")
        })
        .catch(next)
}

const following = (req, res, next) => {
    Controller.following(req.user.id)
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

//Routes
router.get("/", list)
router.get("/get/:id", get)
router.get("/following", secure("follow"), following)
router.post("/follow/:id", secure("follow"), follow)
router.post("/", upsert)
router.put("/", secure('update'), upsert)

module.exports = router