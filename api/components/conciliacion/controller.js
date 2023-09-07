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

    const getDepTransf = async (fromDate, toDate, type) => {
        let typeStr = ""
        if (type) {
            typeStr = ` AND tipo = ${type}`
        }

        return await store.customQuery(`SELECT * FROM ${TABLA} WHERE fecha_dep >= '${fromDate}' AND fecha_dep <= '${toDate}' AND conciliado = '1' ${typeStr} `)
    }

    const getValores = async (fromDate, toDate) => {
        const desdeStr = moment(fromDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        const hastaStr = moment(toDate, "YYYY-MM-DD").format("YYYY-MM-DD")
        const listaMovRaw = await store.customQuery(`SELECT * FROM ${TABLA} WHERE fecha >= '${desdeStr}' AND fecha <= '${hastaStr}' AND (id_tipo = 4 OR concepto like '% falla tecnica%') AND conciliado = 0;`)
        return await functions.makeExcel2(listaMovRaw, moment(fromDate, "YYYY-MM-DD").format("YYYY-MM-DD"), moment(toDate, "YYYY-MM-DD").format("YYYY-MM-DD"))
    }

    return {
        getTransf,
        update,
        download,
        createExcel,
        getDepTransf,
        getValores
    }
}