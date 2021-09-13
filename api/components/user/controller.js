const TABLA = 'users'
const err = require('../../../utils/error')
const auth = require('../auth')
const customQuerys = require("./customQuery")
const functions = require("./functions")

module.exports = (injectedStore) => {
    let store = injectedStore
    if (!store) {
        store = require('../../../store/dummy')
    }
    const list = () => {
        return store.list(TABLA)
    }

    const get = (id) => {
        return store.get(TABLA, id)
    }

    const upsert = async (body) => {
        const user = {
            name: body.name,
            username: body.username,
            email: body.email
        }

        if (body.id) {
            if (body.password || body.username) {
                await auth.upsert({
                    id: body.id,
                    username: user.username,
                    password: body.password
                }, false)
            }
            user.id = body.id
            return store.update(TABLA, user)
        } else {
            if (body.password || body.username) {
                const result = await store.insert(TABLA, user)
                await auth.upsert({
                    id: result.insertId,
                    username: user.username,
                    password: body.password
                }, true)
                return result
            } else {
                throw err("Faltan las credenciales!", 500)
            }
        }
    }

    const recPass = async (user, next) => {
        const userData = await store.customQuery(customQuerys.getUserDataWithAny(TABLA, user))
        const idUser = userData[0].id
        const userEmail = userData[0].email
        const userName = userData[0].username
        const nvaPass = await functions.passCreator()
        const newAuth = {
            password: nvaPass,
            id: idUser,
            prov: 1
        }

        const result = await auth.upsert(newAuth, false)
        const affected = result.affectedRows
        if (affected > 0) {
            try {
                return await functions.sendPass(userEmail, userName, nvaPass)
            } catch (error) {
                throw next(err(error, 500))
            }
        } else {
            throw next(err("No se cambió la contraseña", 500))
        }
    }

    return {
        list,
        get,
        upsert,
        recPass
    }
}