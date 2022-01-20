const TABLA = 'chq_bol_rangos'
const TABLA2 = 'chq_bol_disp'
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

    const talonarioUpsert = async (body) => {
        const newTal = {
            desde: body.desde,
            hasta: body.hasta,
            tipo: body.tipo,
            completo: 0
        }
        const check = await checkTal(body)
        if (check) {
            if (body.id) {
                newTal.id = body.id
                const respuesta = await store.update(TABLA, newTal)
                const affected = parseInt(respuesta.affectedRows)
                if (affected > 0) {
                    newTalDisp(newTal, true)
                } else {
                    throw new Error("Error desconocido")
                }
            } else {
                const respuesta = await store.insert(TABLA, newTal)
                const affected = parseInt(respuesta.affectedRows)
                if (affected > 0) {
                    newTalDisp(newTal, false)
                } else {
                    throw new Error("Error desconocido")
                }
            }
        } else {
            throw new Error("Pisa numeracíon de talonario!")
        }
    }

    const checkTal = async (body) => {
        const sql = ` SELECT COUNT(*) AS CANT FROM ${TABLA} WHERE (desde <= ${body.desde} AND hasta >= ${body.desde} AND tipo = ${body.tipo}) OR (desde <= ${body.hasta} AND hasta >= ${body.hasta} AND tipo = ${body.tipo}) `
        const result = await store.customQuery(sql)
        const cant = result[0].CANT
        if (cant > 0) {
            return false
        } else {
            return true
        }
    }

    const newTalDisp = async (newTal, update) => {
        if (update) {
            await removeTalDisp(newTal)
        }
        const desde = parseInt(newTal.desde)
        const hasta = parseInt(newTal.hasta)
        let queryMov = ""
        for (let i = desde; i <= hasta; i++) {
            if (i < hasta) {
                queryMov = queryMov + customQuerys.newValueTalDisp(i, newTal.tipo) + ", "
            } else {
                queryMov = queryMov + customQuerys.newValueTalDisp(i, newTal.tipo)
            }
        }
        const query = customQuerys.insertNewMov(TABLA2, "nro, tipo", queryMov)
        return store.customQuery(query)
    }

    const removeTalDisp = async (talDispRange) => {
        const desde = talDispRange.desde
        const hasta = talDispRange.hasta
        const tipo = talDispRange.tipo
        const query = ` DELETE FROM ${TABLA2} WHERE nro >= ? AND nro <= ? AND tipo = ? `
        await store.customQuery(query, [desde, hasta, tipo])
    }

    const removeRange = async (id) => {
        const dataRange = await store.get(TABLA, id)
        if (dataRange.length > 0) {
            const respuesta = await store.remove(TABLA, { id: id })
            const affected = parseInt(respuesta.affectedRows)
            if (affected > 0) {
                removeTalDisp(dataRange[0])
            } else {
                throw new Error("Error desconocido")
            }
        } else {
            throw new Error("Error desconocido")
        }
    }

    const verificaTal = async (id) => {
        const dataRange = await store.get(TABLA, id)
        if (dataRange.length > 0) {
            const query = ` SELECT COUNT(*) as count FROM ${TABLA2} WHERE nro >= ? AND nro <= ? AND tipo = ? `
            const cantPend = await store.customQuery(query, [dataRange[0].desde, dataRange[0].hasta, dataRange[0].tipo])
            if (cantPend[0] > 0) {
                return 0
            } else {
                const data = {
                    id: id,
                    completo: 1
                }
                await store.update(TABLA, data)
                return 1
            }
        } else {
            throw new Error("Error desconocido")
        }
    }

    const listaTalPend = async () => {
        const query = ` SELECT * FROM ${TABLA} WHERE completo = '0' ORDER BY tipo, desde `
        const listaIncompleta = await store.customQuery(query)
        console.log(`listaIncompleta`, listaIncompleta)
        let listadoBol = []
        let listadoChq = []
        return new Promise((resolve, reject) => {
            if (listaIncompleta.length > 0) {
                listaIncompleta.map(async (item, key) => {
                    const completo = await verificaTal(item.id)
                    item.completo = completo
                    if (item.tipo === 1) {
                        listadoChq.push(item)
                    } else {
                        listadoBol.push(item)
                    }
                    if (key === (listaIncompleta.length - 1)) {
                        resolve({
                            listadoChq,
                            listadoBol
                        })
                    }
                })
            } else {
                reject(new Error("Error inesperado"))
            }
        })
    }

    const TalPendientes = async () => {
        const sqlChq = ` SELECT COUNT(*) FROM ${TABLA2} WHERE tipo = '0' `
        const sqlBol = ` SELECT COUNT(*) FROM ${TABLA2} WHERE tipo = '1' `

    }

    return {
        talonarioUpsert,
        removeRange,
        verificaTal,
        listaTalPend
    }
}