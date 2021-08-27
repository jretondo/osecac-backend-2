module.exports = {
    api: {
        port: process.env.PORT
    },
    jwt: {
        secret: process.env.SECRET
    },
    mysql: {
        host: process.env.HOST_DB,
        user: process.env.USER_DB,
        password: process.env.PASS_DB,
        database: process.env.DB_NAME
    }
}