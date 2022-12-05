const express = require('express')
const router = express.Router()
const secure = require('./secure')
const response = require("../../../network/response")
const Controller = require("./index")
const uploadFile = require('../../../utils/multer')
const path = require('path')
const config = require("../../../config")

//internal Functions
const process = (req, res, next) => {
    Controller.process3(req.files[0].fieldname, req.user.id)
        .then(() => {
            response.success(req, res, 201, "Extracto procesado")
        })
        .catch(next)
}

const process2 = (req, res, next) => {
    Controller.process4(req.files[0].fieldname, req.user.id)
        .then(() => {
            response.success(req, res, 201, "Extracto procesado")
        })
        .catch(next)
}

const processDef = (req, res, next) => {
    Controller.processDef(req.files[0].fieldname, req.user.id)
        .then(() => {
            response.success(req, res, 201, "Extracto procesado")
        })
        .catch(next)
}

const process1 = (req, res, next) => {
    Controller.process1(req.files[0].fieldname, req.user.id)
        .then(() => {
            response.success(req, res, 201, "Extracto procesado")
        })
        .catch(next)
}

const replaceImp = (req, res, next) => {
    Controller.replaceImp(req.files[0].fieldname, req.user.id)
        .then(() => {
            response.success(req, res, 201, "Extracto procesado")
        })
        .catch(next)
}

const remove = (req, res, next) => {
    Controller.remove({ fecha: req.params.fecha })
        .then(() => {
            response.success(req, res, 200, "Extracto eliminado")
        })
        .catch(next)
}

const removeOne = (req, res, next) => {
    Controller.remove({ id: req.params.id })
        .then(() => {
            response.success(req, res, 200, "Movimiento eliminado")
        })
        .catch(next)
}

const list = (req, res, next) => {
    Controller.list(req.params.page, req.query.desde, req.query.hasta)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const download = (req, res, next) => {
    Controller.download(req.query.desde, req.query.hasta, config.private, next)
        .then((filePath) => {
            response.file(req, res, filePath, 'application/pdf', "Extracto-" + req.query.desde + "-al-" + req.query.hasta + ".pdf")
        })
        .catch(next)
}

const get = (req, res, next) => {
    Controller.getMovimientos(req.params.page, req.query.fecha, req.query.filtro)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const get2 = (req, res, next) => {
    Controller.getMovimientos2(req.params.page, req.query.desde, req.query.hasta, req.query.filtro)
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

const update = async (req, res, next) => {
    Controller.difMov(req.params.id, req.body, req.user)
        .then(() => {
            response.success(req, res, 200)
        })
        .catch(next)
}

const calcGstosImp = async (req, res, next) => {
    Controller.calcGstosImp(req.query.desde, req.query.hasta)
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

const listWithOut = async (req, res, next) => {
    Controller.listWithOut()
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch(next)
}

const updateCustom = async (req, res, next) => {
    Controller.update(req.params.id, req.body.set)
        .then(() => {
            response.success(req, res)
        })
        .catch(next)
}

const listTiposMov = async (req, res, next) => {
    Controller.listTiposMov()
        .then((list) => {
            response.success(req, res, 200, list)
        })
        .catch(next)
}

//Routes
router.post("/process", secure(3), uploadFile(path.join("Archivos", "Extractos-Excel")), process)
router.post("/process1", secure(3), uploadFile(path.join("Archivos", "Extractos-Excel")), process1)
router.post("/process2", secure(3), uploadFile(path.join("Archivos", "Extractos-Excel")), process2)
router.post("/processDef", secure(3), uploadFile(path.join("Archivos", "Extractos-Excel")), processDef)
router.post("/replaceImp", secure(3), uploadFile(path.join("Archivos", "Extractos-Excel")), replaceImp)
router.put("/:id", secure(3), update)
router.patch("/:id", secure(3), updateCustom)
router.delete("/removeId/:id", secure(3), removeOne)
router.delete("/:fecha", secure(3), remove)
router.get("/tiposMov", secure(3), listTiposMov)
router.get("/sin", secure(3), listWithOut)
router.get("/calcGstos", secure(3), calcGstosImp)
router.get("/list/:page", secure(3), list)
router.get("/download/", secure(3), download)
router.get("/busqueda/:page", secure(3), get2)
router.get("/:page", secure(3), get)

module.exports = router