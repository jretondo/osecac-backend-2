const TABLA = 'extractos_bco_cba'
const customQuerys = require("./customQuery")
const path = require('path')
const moment = require('moment')
const functions = require("./functions")
const { error } = require("console")
const XLSX = require("xlsx")

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

    const getTransf = async (desde, hasta, pend, busqueda, importe, sinCos) => {
        return await store.customQuery(customQuerys.getTransf(TABLA, moment(desde).format("YYYY-MM-DD"), moment(hasta).format("YYYY-MM-DD"), pend, busqueda, importe, sinCos))
    }

    const download = async (desde, hasta, pend, busqueda, importe, privateData, excel, next) => {
        console.log(`pend`, pend)
        let pendiente
        if (pend) {
            pendiente = 1
        } else {
            pendiente = 0
        }
        const desdeStr = moment(desde, "YYYY-MM-DD").format("DD/MM/YYYY")
        const hastaStr = moment(hasta, "YYYY-MM-DD").format("DD/MM/YYYY")
        const listaMovRaw = await store.customQuery(customQuerys.getTransf(TABLA, moment(desde).format("YYYY-MM-DD"), moment(hasta).format("YYYY-MM-DD"), pend, busqueda, importe))
        const listaMov = await functions.listaMovExtracto(listaMovRaw, 0)
        if (excel) {
            return await functions.makeExcel(listaMov, moment(desde, "YYYY-MM-DD").format("YYYY-MM-DD"), moment(hasta, "YYYY-MM-DD").format("YYYY-MM-DD"))
        } else {
            const datosRender = {
                desde: desdeStr,
                hasta: hastaStr,
                total: listaMov.total,
                fechaIni: desdeStr,
                listaItems: listaMov.listaItems,
                sucursal: privateData.sucursalBcoCba,
                nroCta: privateData.ctaBcoCba,
                pendiente
            }
            return await functions.renderReport(datosRender, desde, hasta, next)
        }
    }

    const createExcel = async () => {
        const json = [
            {
                id: 1,
                color: 'red',
                number: 75
            },
            {
                id: 2,
                color: 'blue',
                number: 62
            },
            {
                id: 3,
                color: 'yellow',
                number: 93
            },
        ];

        let workBook = XLSX.utils.book_new();
        const workSheet = XLSX.utils.json_to_sheet(json);
        XLSX.utils.book_append_sheet(workBook, workSheet, `response`);
        let exportFileName = `response.xls`;
        XLSX.writeFile(workBook, exportFileName);
        return ""
    }

    return {
        getTransf,
        update,
        download,
        createExcel
    }
}