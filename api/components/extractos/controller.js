const TABLA = 'extractos_bco_cba'
const TABLA2 = 'tipos_movimientos'
const functions = require("./functions")
const customQuerys = require("./customQuery")
const path = require('path')
const getPages = require('../../../utils/getPages')

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

    return {
        process,
        remove,
        list
    }
}