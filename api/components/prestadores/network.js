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

//Routes
router.get("/:nroProv", get)

module.exports = router