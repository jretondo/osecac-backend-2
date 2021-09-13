const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
const Controller = require("./index")
const secure = require('./secure')

//internal Functions
const login = (req, res, next) => {
    Controller.login(req.body.username, req.body.password)
        .then(data => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

const changePass = (req, res, next) => {
    Controller.upsert({
        id: req.user.id,
        password: req.body.password,
        prov: '0'
    }, false)
        .then(data => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

//Routes
router.post("/login", login)
router.put("/changePass", secure(false), changePass)

module.exports = router