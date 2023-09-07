const newLine = async (dataLine, cbuOrigen) => {
    const cbuDest = dataLine.cbu
    const importe = await relleno(numberToString(dataLine.importe), 12, false, false)
    const concepto = await relleno(dataLine.concepto, 50, true, true)
    const motivo = dataLine.motivo
    const referencia = await relleno(dataLine.referencia, 12, true, true)
    const email = await relleno(dataLine.email, 50, true, true)
    const alias = "                                            "

    const fila = cbuOrigen + cbuDest + alias + importe + concepto + motivo + referencia + email + " "
    return fila
}

const finalLine = async (cantReg, impTotal) => {
    const espacios = "                                                                                                                                                                                                  "
    const importe = await relleno(numberToString(impTotal), 17, false, false)
    const total = await relleno(String(cantReg), 5, false, false)
    const fila = total + importe + espacios
    return fila
}

const relleno = async (original, cantFila, espacio, derecha) => {
    let salida = original
    let char = "0"
    if (espacio) {
        char = " "
    }

    const diferencia = parseInt(cantFila) - parseInt(original.length)

    return new Promise((resolve, reject) => {
        for (let i = 0; i < diferencia; i++) {
            if (derecha) {
                salida = salida + char
            } else {
                salida = char + salida
            }
            if (i === (diferencia - 1)) {
                resolve(salida)
            }
        }
    })
}

const numberToString = (number) => {
    const number2 = Math.round((number * 100))
    return String(number2).replace(".", "")
}


module.exports = {
    newLine,
    finalLine
}