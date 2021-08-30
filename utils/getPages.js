const getPages = async (totalReg, cantPerPage, pageAct) => {
    let ultPagina = 1
    let paginas = []
    if (parseInt(totalReg) === 0) {
        return {
            cantTotal: 0,
            totalPag: 0
        }
    } else {
        if (totalReg < cantPerPage) {
            paginas.push(1)
            return {
                cantTotal: paginas,
                totalPag: ultPagina
            }
        } else {
            return new Promise((resolve, reject) => {
                const paginasFloat = parseFloat(totalReg / cantPerPage)
                const paginasInt = parseInt(totalReg / cantPerPage)
                let totalPag
                if (paginasFloat > paginasInt) {
                    totalPag = paginasInt + 1
                } else {
                    if (paginasInt === 0) {
                        totalPag = 1
                    } else {
                        totalPag = paginasInt
                    }
                }

                ultPagina = Math.ceil((totalPag / cantPerPage))

                for (let i = 0; i < totalPag; i++) {
                    const paginaLista = i + 1
                    const limiteInf = parseInt(pageAct) - 3
                    const limiteSup = parseInt(pageAct) + 3
                    if (paginaLista > limiteInf && paginaLista < limiteSup)
                        paginas.push(paginaLista)
                }
                resolve({
                    cantTotal: paginas,
                    totalPag: ultPagina
                })
            })
        }
    }
}

module.exports = getPages