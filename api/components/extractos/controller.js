const TABLA = 'extractos_bco_cba'
const TABLA2 = 'tipos_movimientos'
const functions = require("./functions")
const customQuerys = require("./customQuery")
const path = require('path')
const getPages = require('../../../utils/getPages')
const formatMoney = require('../../../utils/NumberFormat')
const moment = require('moment')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const process = async (fileName, idUser) => {
        const dataSheet = functions.getDataSheet(path.join("Archivos", "Extractos-Excel", fileName))
        const queryValues = await Promise.all(
            dataSheet.map(async (fila) => {
                const nroCbte = fila.__EMPTY_4
                const verificInt = parseInt(nroCbte)
                const esNulo = isNaN(verificInt)
                if (!esNulo) {
                    const fecha = functions.transformToDate(fila.__EMPTY)
                    const concepto = fila.__EMPTY_1
                    let smallConcepto = concepto.slice(0, 13)
                    smallConcepto = "%" + smallConcepto + "%"
                    let descripcion = fila.__EMPTY_2
                    if (descripcion === undefined) {
                        descripcion = ""
                    }
                    const monto = functions.transformToMoney(fila.__EMPTY_3)
                    let credito
                    if (monto < 0) {
                        credito = 1
                    } else {
                        credito = 0
                    }
                    return customQuerys.singleValueNewMov(TABLA2, fecha, concepto, nroCbte, monto, smallConcepto, credito, idUser, descripcion)
                }
            })
        )
        return store.customQuery(customQuerys.insertNewMov(TABLA, queryValues))
    }

    const remove = (fecha) => {
        return store.remove(TABLA, { fecha: fecha })
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

    const download = async (desde, hasta, privateData, next) => {
        const desdeStr = moment(desde, "YYYY-MM-DD").format("DD/MM/YYYY")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("DD/MM/YYYY")
        let datosIniciales = await store.customQuery(customQuerys.saldoInicial(desde))
        const saldoinicial = datosIniciales[0].saldoIni
        const saldoIniStr = formatMoney(saldoinicial)
        const fechaIni = moment(datosIniciales[0].fechaAnt, "YYYY-MM-DD").format("DD/MM/YYYY")
        let gastos = await store.customQuery(customQuerys.totalGastos(desde, hasta))
        gastos = formatMoney(- gastos[0].gastos)
        let impuestos = await store.customQuery(customQuerys.totalImpuestos(desde, hasta))
        impuestos = formatMoney(- impuestos[0].impuestos)
        const listaMovRaw = await store.customQuery(customQuerys.movimientosBco(desde, hasta))
        const listaMov = await functions.listaMovExtracto(listaMovRaw, saldoinicial)
        const datosRender = {
            desde: desdeStr,
            hasta: hastaStr,
            gastos,
            impuestos,
            saldoInicial: saldoIniStr,
            fechaIni,
            listaItems: listaMov,
            sucursal: privateData.sucursalBcoCba,
            nroCta: privateData.ctaBcoCba
        }
        return await functions.renderReport(datosRender, desde, hasta, next)
    }

    const get = async (fecha) => {
        const fechaFormat = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        return await store.customQuery(customQuerys.detalleDia(TABLA, fechaFormat))
    }

    const getMovimientos = async (page, fecha, filtro) => {
        const fechaFormat = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
        const listado = await store.customQuery(customQuerys.movimientosBco(fechaFormat, fechaFormat, true, filtro, page))
        const cantMov = await store.customQuery(customQuerys.cantMov(fechaFormat, filtro))
        const pages = await getPages(cantMov, 10, page)
        return {
            listado,
            pages
        }
    }

    return {
        process,
        remove,
        list,
        download,
        get,
        getMovimientos
    }
}