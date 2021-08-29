const TABLA = 'extractos_bco_cba'
const TABLA2 = 'tipos_movimientos'
const functions = require("./functions")
const customQuerys = require("./customQuery")
const path = require('path')
const getPages = require('../../../utils/getPages')
const formatDate = require('../../../utils/FormatDate')
const formatMoney = require('../../../utils/NumberFormat')

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
        const cantTotal = await store.customQuery(customQuerys.cantExtractos(desde, hasta))
        console.log(`cantTotal`, cantTotal[0].CANT)
        const listado = await store.customQuery(customQuerys.listExtractos(desde, hasta, page))
        const pages = getPages(cantTotal[0].CANT, 10, page)
        return {
            listado,
            pages
        }
    }

    const download = async (desde, hasta, privateData, next) => {
        console.log(`privateData`, privateData)
        const desdeStr = formatDate(new Date(desde), "dd/mm/yyyy")
        const hastaStr = formatDate(new Date(hasta), "dd/mm/yyyy")
        let datosIniciales = await store.customQuery(customQuerys.saldoInicial(desde))
        const saldoinicial = datosIniciales[0].saldoIni
        const saldoIniStr = formatMoney(saldoinicial)
        const fechaIni = formatDate(datosIniciales[0].fechaAnt, "dd/mm/yyyy")
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

    return {
        process,
        remove,
        list,
        download
    }
}