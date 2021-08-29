let config = []

if (process.env.ENTORNO_A === "PROD") {
    config = {
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
} else if (process.env.ENTORNO_A === "TEST") {
    config = {
        api: {
            port: process.env.PORT_TEST
        },
        jwt: {
            secret: process.env.SECRET
        },
        mysql: {
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.DB_NAME_TEST
        }
    }
} else {
    config = {
        api: {
            port: process.env.PORT_TEST
        },
        jwt: {
            secret: process.env.SECRET
        },
        mysql: {
            host: process.env.HOST_DB_TEST_CASA,
            user: process.env.USER_DB_TEST_CASA,
            password: process.env.PASS_DB_TEST_CASA,
            database: process.env.DB_NAME_TEST
        }
    }
}

module.exports = config