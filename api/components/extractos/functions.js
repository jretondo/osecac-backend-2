const XLSX = require("xlsx")
const formatDate = require('../../../utils/FormatDate')

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
    fecha = formatDate(new Date(fecha), "yyyy-mm-dd")

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

module.exports = {
    getDataSheet,
    transformToDate,
    transformToMoney
}