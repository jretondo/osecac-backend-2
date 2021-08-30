const auth = require('../../../auth')
const bcrypt = require('bcrypt')
const TABLA = 'auth'
const TABLA2 = 'users'

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }

    const upsert = async (data, isNew) => {
        const authData = {
            id: data.id
        }

        if (data.username) {
            authData.username = data.username
        }

        if (data.password) {
            authData.password = await bcrypt.hash(data.password, 5)
        }

        if (isNew) {
            authData.prov = "1"
            store.insert(TABLA, authData)
        } else {
            authData.prov = "0"
            store.update(TABLA, authData)
        }
    }

    const login = async (username, password) => {
        const data = await store.query(TABLA, { username: username })
        const idUser = data[0].id
        const prov = data[0].prov
        const userData = await store.get(TABLA2, idUser)
        return bcrypt.compare(password, data[0].password)
            .then(same => {
                if (same) {
                    return {
                        token: auth.sign(JSON.stringify(data[0])),
                        userData: userData[0],
                        provisory: prov
                    }
                } else {
                    throw new Error('información invalida')
                }
            })
    }

    return {
        upsert,
        login
    }
}