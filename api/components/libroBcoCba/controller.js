const TABLA = 'libro_bco_cba'
const functions = require("./functions")
const customQuerys = require("./customQuery")
const path = require('path')
const getPages = require('../../../utils/getPages')
const moment = require('moment')
const prestaController = require('../prestadores')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const process = async (fileName, idUser, body) => {
        const fecha = moment(body.fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        let nroOp = parseInt(body.nroOp) + 1
        let nroChq = parseInt(body.nroChq) + 1
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Libro-Excel-Disca", fileName))
        const queryValues = await Promise.all(
            dataSheet.map(async (fila, key) => {
                const exp = Object.values(fila)[1]
                const year = "20" + Object.values(fila)[2]
                const nroProv = Object.values(fila)[3]
                const totalinvoice = Object.values(fila)[4]
                const retGcias = Object.values(fila)[5]
                const retMuni = Object.values(fila)[6]
                const totalPayment = Object.values(fila)[7]

                const verificInt = parseInt(totalPayment)
                const esNulo = isNaN(verificInt)
                if (!esNulo) {
                    const dataPrest = await prestaController.getNroProv(nroProv)
                    const razSoc = dataPrest[0].raz_soc
                    const descr = `DISC. EXP. ${exp}/${year} ${razSoc}`
                    return customQuerys.singleValueNewMov(fecha, descr, (nroChq + key), (nroOp + key), totalPayment, retMuni, retGcias, totalinvoice, idUser, exp, year)
                }
            })
        )
        return store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))
    }

    const remove = (query) => {
        return store.remove(TABLA, query)
    }

    const list = async (page, desde, hasta) => {
        const listaFechas = await store.customQuery(customQuerys.cantExtractos(desde, hasta))
        const cantTotal = parseInt(listaFechas.length)
        const listado = await store.customQuery(customQuerys.listExtractos(desde, hasta, page))
        const pages = await getPages(cantTotal, 10, page)
        return {
            listado,
            pages
        }
    }

    const get = async (fecha) => {
        const fechaFormat = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        return await store.customQuery(customQuerys.detalleDia(TABLA, fechaFormat))
    }

    const getOne = async (id) => {
        return await store.get(TABLA, id)
    }

    const getMovimientos = async (page, fecha, filtro) => {
        const fechaFormat = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        const listado = await store.customQuery(customQuerys.movimientosBco(fechaFormat, fechaFormat, true, filtro, page))
        const cantMov = await store.customQuery(customQuerys.cantMov(fechaFormat, filtro))
        const pages = await getPages(cantMov[0].cant, 10, page)
        return {
            listado,
            pages
        }
    }

    const upsert = async (body, user) => {
        body.id_usu = user.id

        if (body.id) {
            mov.id = body.id
            return await store.update(TABLA, mov)
        } else {
            return await store.insert(TABLA, mov)
        }
    }

    return {
        remove,
        list,
        get,
        getOne,
        getMovimientos,
        upsert,
        process
    }
}