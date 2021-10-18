const TABLA = 'extractos_bco_cba'
const TABLA2 = 'tipos_movimientos'
const customQuerys = require("./customQuery")
const path = require('path')
const moment = require('moment')
const functions = require("./functions")
const { error } = require("console")

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const update = async (idMov, set) => {
        return await store.update(TABLA, {
            id: idMov,
            ...set
        })
    }

    const getTransf = async (desde, hasta, pend, busqueda, importe) => {
        return await store.customQuery(customQuerys.getTransf(TABLA, moment(desde).format("YYYY-MM-DD"), moment(hasta).format("YYYY-MM-DD"), pend, busqueda, importe))
    }

    const download = async (desde, hasta, pend, busqueda, importe, privateData, next) => {
        const desdeStr = moment(desde, "YYYY-MM-DD").format("DD/MM/YYYY")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("DD/MM/YYYY")
        const listaMovRaw = await store.customQuery(customQuerys.getTransf(TABLA, moment(desde).format("YYYY-MM-DD"), moment(hasta).format("YYYY-MM-DD"), pend, busqueda, importe))
        const listaMov = await functions.listaMovExtracto(listaMovRaw, saldoinicial)
        const datosRender = {
            desde: desdeStr,
            hasta: hastaStr,
            listaItems: listaMov,
            sucursal: privateData.sucursalBcoCba,
            nroCta: privateData.ctaBcoCba
        }
        return await functions.renderReport(datosRender, desde, hasta, next)
    }

    return {
        getTransf,
        update,
        download
    }
}