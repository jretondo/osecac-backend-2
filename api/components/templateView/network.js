const express = require('express')
const router = express.Router()
const response = require("../../../network/response")
const ejs = require('ejs')
const path = require('path')

//internal Functions
const recPass = (req, res, next) => {
    res.render(
        ejs.render(path.join("emails", "recPass.ejs")), {
        nvaPass: "nuevafafafaw",
        user: "jretondo"
    })
}

//Routes
router.get("/recPass", recPass)

module.exports = router