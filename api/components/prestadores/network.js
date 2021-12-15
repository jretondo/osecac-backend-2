const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
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

//Routes
router.get("/list/:page", listPages)
router.get("/:nroProv", get)

module.exports = router