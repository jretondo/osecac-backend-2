const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")

//internal Functions
const responseSuccess = (req, res, next) => {
    response.success(req, res, 200)
}

//Routes
router.get("/adminUsu", secure(1), responseSuccess)
router.get("/libroBanco", secure(2), responseSuccess)
router.get("/extractosbancarios", secure(3), responseSuccess)
router.get("/pagoProveedores", secure(4), responseSuccess)
router.get("/pagoAgencias", secure(5), responseSuccess)
router.get("/pagoPrestadores", secure(6), responseSuccess)
router.get("/conciliacionBancaria", secure(7), responseSuccess)
router.get("/rendicionesCoseguro", secure(8), responseSuccess)
router.get("/fiscalizacion", secure(9), responseSuccess)
router.get("/transferencias", secure(12), responseSuccess)
router.get("/dashboard", secure(false), responseSuccess)
router.get("/changePass", secure(false), responseSuccess)

module.exports = router