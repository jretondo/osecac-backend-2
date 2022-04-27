const formatDate = require('../../../utils/FormatDate')
const formatMoney = require('../../../utils/NumberFormat')
const ejs = require("ejs")
const pdf = require("html-pdf")
const path = require('path')
const moment = require('moment')
const XLSX = require("xlsx")

const transformToDate = (rawDate) => {
    let fecha = ""
    let dia = ""
    let mes = ""
    let anio = ""
    let barras = 0

    for (let i = 0; i < rawDate.length; i++) {
        const element = rawDate[i];
        if (element === "/") {
            barras = barras + 1
        } else {
            if (barras === 0) {
                dia = dia.concat(String(element))
            } else if (barras === 1) {
                mes = mes.concat(String(element))
            } else {
                anio = anio.concat(String(element))
            }
        }
    }

    fecha = anio + "-" + mes + "-" + dia
    fecha = moment(fecha, "YYYY-MM-DD").format("YYYY-MM-DD")
    return fecha
}

const transformToMoney = (rawNumber) => {
    let valor = rawNumber
    valor = valor.replace("$", "")
    valor = valor.split(".").join("")
    valor = valor.split(",").join(".")
    valor = valor.split(" ").join("")

    return valor
}

const listaMovExtracto = async (rawList) => {
    return new Promise((resolve, reject) => {
        listaItems = []
        let total = 0
        rawList.map(item => {
            const fecha = formatDate(item.fecha, "dd/mm/yyyy")
            const comprobante = item.nro_cbte

            let descripcion = item.concepto
            if (item.descripcion !== "") {
                descripcion = "Cr Transf. " + item.descripcion
            }
            const descripcion2 = item.descripcion
            const rendicion = parseInt(item.transf_int)
            const tipo = item.id_tipo
            const monto = formatMoney(item.monto)
            const montoPure = parseFloat(item.monto)
            total = total + parseFloat(item.monto)
            listaItems.push({
                fecha,
                comprobante,
                descripcion,
                descripcion2,
                tipo,
                monto,
                montoPure,
                rendicion
            })
        })
        resolve({ listaItems, total: formatMoney(total) })
    })
}

const renderReport = async (datos, desde, hasta, next) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(path.join("reports", "ejs", "Transferencias", "index.ejs"), datos, (err, data) => {
            const options = {
                "format": "A4",
                "border": {
                    "right": "0.5cm",
                    "left": "0.5cm",
                    "top": "1.5cm"
                },
                paginationOffset: 1,
                "footer": {
                    "height": "28mm",
                    "contents": {
                        default: '<h3 style="text-align: center">Página <span style="color: #444;">{{page}}</span> de <span>{{pages}}</span></h3>'
                    }
                },
            };

            pdf.create(data, options).toFile(path.join("Archivos", "Transferencias-PDF", "Transferencias-" + desde + "-al-" + hasta + ".pdf"), async function (err, data) {
                if (err) {
                    next()
                } else {
                    resolve(path.join("Archivos", "Transferencias-PDF", "Transferencias-" + desde + "-al-" + hasta + ".pdf"))
                }
            })
        })
    })
}

const makeExcel = async (listamov, desde, hasta) => {
    return new Promise((resolve, reject) => {
        let json = []
        listamov.listaItems.map((item, key) => {
            const fecha = moment(item.fecha, "DD/MM/YYYY").format("DD/MM/YYYY")
            let comprobante = item.descripcion
            if (item.descripcion2 !== "") {
                comprobante = item.descripcion
            }
            const importe = item.montoPure

            json.push({
                Fecha: fecha,
                Detalle: comprobante,
                Importe: importe
            })

            if (key === (listamov.listaItems.length - 1)) {
                let workBook = XLSX.utils.book_new();
                const workSheet = XLSX.utils.json_to_sheet(json);
                XLSX.utils.book_append_sheet(workBook, workSheet, `Hoja1`);
                let exportFileName = path.join("Archivos", "Transferencias-Excel", "Transferencias-" + desde + "-al-" + hasta + ".xls");
                XLSX.writeFile(workBook, exportFileName);
                resolve(path.join("Archivos", "Transferencias-Excel", "Transferencias-" + desde + "-al-" + hasta + ".xls"))
            }
        })
    })
}

module.exports = {
    transformToDate,
    transformToMoney,
    listaMovExtracto,
    renderReport,
    makeExcel
}