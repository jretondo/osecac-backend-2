const XLSX = require("xlsx")
const formatDate = require('../../../utils/FormatDate')
const formatMoney = require('../../../utils/NumberFormat')
const ejs = require("ejs")
const pdf = require("html-pdf")
const path = require('path')
const moment = require('moment')

const getDataSheet = (fileUrl) => {
    const workBook = XLSX.readFile(fileUrl)
    const sheets = workBook.SheetNames;
    const hoja1 = sheets[0]
    return XLSX.utils.sheet_to_json(workBook.Sheets[hoja1])
}

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

const listaMovExtracto = async (rawList, saldoInicial) => {
    return new Promise((resolve, reject) => {
        listaItems = []
        let saldoGral = saldoInicial
        rawList.map(item => {
            const fecha = formatDate(item.fecha, "dd/mm/yyyy")
            const comprobante = item.nro_cbte
            const descripcion = item.concepto
            const descripcion2 = item.descripcion
            const tipo = item.id_tipo
            const monto = formatMoney(item.monto)
            saldoGral = parseFloat(saldoGral) + parseFloat(item.monto)
            const saldo = formatMoney(saldoGral)

            listaItems.push({
                fecha,
                comprobante,
                descripcion,
                descripcion2,
                tipo,
                monto,
                saldo
            })
        })
        resolve(listaItems)
    })
}

const renderReport = async (datos, desde, hasta, next) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(path.join("reports", "ejs", "Extracto", "index.ejs"), datos, (err, data) => {
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

            pdf.create(data, options).toFile(path.join("Archivos", "Extractos-PDF", "Extracto " + desde + " al " + hasta + ".pdf"), async function (err, data) {
                if (err) {
                    next()
                } else {
                    resolve(path.join("Archivos", "Extractos-PDF", "Extracto " + desde + " al " + hasta + ".pdf"))
                }
            })
        })
    })
}

module.exports = {
    getDataSheet,
    transformToDate,
    transformToMoney,
    listaMovExtracto,
    renderReport
}