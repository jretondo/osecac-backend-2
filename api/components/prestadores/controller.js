const TABLA = 'prestadores_db'
const getPages = require('../../../utils/getPages')
const dataCbu = require("../../../Archivos/datacbu.json")
const moment = require('moment')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const getNroProv = (nroProv) => {
        return store.getProv(TABLA, nroProv)
    }

    const list = async (page, palabra) => {
        const listado = await store.customQuery(customQuerys.getListLimit(TABLA, page, palabra))
        const cant = await store.customQuery(customQuerys.getCantTotal(TABLA, palabra))
        const cantTotal = parseInt(cant[0].CANT)
        const pages = await getPages(cantTotal, 10, page)
        return {
            listado,
            pages
        }
    }

    const upsert = async (body) => {
        if (body.id) {
            return await store.update(TABLA, body)
        } else {
            return await store.insert(TABLA, body)
        }
    }

    const insertCbu = async () => {
        dataCbu.data.map(async (item, key) => {
            const ahora = moment(new Date()).format("YYYY-MM-DD HH:MM:SS")
            const cuit = item.CUIT
            const cbu = item.CBU
            const tipo = item.TIPO
            const query = ` UPDATE ${TABLA} SET cbu = '${cbu}', tipo_cta = '${tipo}', ult_act_cbu = '${ahora}' WHERE cuit = '${cuit}' `
            await store.customQuery(query)
            console.log(`query`, query)
            console.log(`key`, key)
            if (key === parseInt(dataCbu.data.length) - 1) {
                console.log(`aca`)
                return ""
            }
        })
    }

    return {
        getNroProv,
        list,
        upsert,
        insertCbu
    }
}