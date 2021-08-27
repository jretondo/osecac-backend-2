const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const login = (req, res, next) => {
    Controller.login(req.body.username, req.body.password)
        .then(data => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

//Routes
router.post("/login", login)

module.exports = router