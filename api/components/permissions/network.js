const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const upsert = (req, res, next) => {
    Controller.upsert(req.body)
        .then(() => {
            response.success(req, res, 201, "Permisos creados")
        })
        .catch(next)
}

const get = (req, res, next) => {
    Controller.get(req.user.id)
        .then((permisos) => {
            response.success(req, res, 201, permisos)
        })
        .catch(next)
}

//Routes
router.post("/", secure(1), upsert)
router.put("/", secure(1), upsert)
router.get("/", secure(1), get)

module.exports = router