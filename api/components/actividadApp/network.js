const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")

//internal Functions
const nvaAct = async (req, res, next) => {
    Controller.insert(req)
        .then(() => {
            response.success(req, res)
        })
        .catch(next)
}


//Routes
router.post("/", secure(), nvaAct)

module.exports = router