const TABLA = 'proveedores'
const getPages = require('../../../utils/getPages')
const customQuerys = require("./customQuery")
const functions = require("./functions")
const fs = require('fs')
const path = require('path')

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }
    const list = async (page, palabra, tipo) => {
        const listado = await store.customQuery(customQuerys.getListLimit(TABLA, page, palabra, tipo))
        const cant = await store.customQuery(customQuerys.getCantTotal(TABLA, palabra, tipo))
        const cantTotal = parseInt(cant[0].CANT)
        const pages = await getPages(cantTotal, 10, page)
        return {
            listado,
            pages
        }
    }

    const list2 = async (palabra, tipo, cbu) => {
        return await store.customQuery(customQuerys.getList(TABLA, palabra, tipo, cbu))
    }

    const get = (id) => {
        return store.get(TABLA, id)
    }

    const upsert = async (body) => {
        const prov = {
            raz_soc: body.raz_soc,
            localidad: body.localidad,
            encargado: body.encargado,
            telefono: body.telefono,
            email: body.email,
            cbu: body.cbu,
            banco: body.banco,
            cuit: body.cuit,
            tipo_prov: body.tipo_prov,
            nombre_chq: body.nombre_chq,
            nombre_bco: body.nombre_bco
        }
        if (body.id) {
            prov.id = body.id
            return await store.update(TABLA, prov)
        } else {
            return await store.insert(TABLA, prov)
        }
    }

    const newTxt = async (body, cbuOrigen) => {
        return new Promise((resolve, reject) => {
            let textIn = ""
            let total = 0
            body.map(async (item, key) => {
                const fila = await functions.newLine(item, cbuOrigen)
                total = total + parseFloat(item.importe)
                textIn = textIn + fila + "\r\n"

                if (key === (body.length - 1)) {
                    const ultFila = await functions.finalLine(key + 2, (Math.round(total * 100) / 100))
                    textIn = textIn + ultFila + "\r\n"
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const file = path.join("Archivos", "Process-text-files", "Archivo pagos prov " + uniqueSuffix + ".txt")
                    fs.writeFile(file, textIn, function (err) {
                        if (err) {
                            reject(err)
                            console.log(`err`, err)
                        }
                        resolve({
                            filePath: file,
                            fileName: uniqueSuffix
                        })
                    });
                }
            })
        })
    }

    const remove = async (id) => {
        return await store.remove(TABLA, { id: id })
    }

    return {
        list,
        get,
        upsert,
        newTxt,
        remove,
        list2
    }
}