let config = {
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
    },
    mysql2: {
        host: process.env.HOST_DB,
        user: process.env.USER_DB,
        password: process.env.PASS_DB,
        database: process.env.DB_NAME_PROV
    },
    private: {
        sucursalBcoCba: process.env.SUCURSAL_BCO_CBA,
        ctaBcoCba: process.env.NRO_CTA_BCO_CBA,
        cbuBcoCba: process.env.CBU_BCO_CBA
    }
}

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
        },
        mysql2: {
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.DB_NAME_PROV
        },
        private: {
            sucursalBcoCba: process.env.SUCURSAL_BCO_CBA,
            ctaBcoCba: process.env.NRO_CTA_BCO_CBA,
            cbuBcoCba: process.env.CBU_BCO_CBA
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
        },
        mysql2: {
            host: process.env.HOST_DB,
            user: process.env.USER_DB,
            password: process.env.PASS_DB,
            database: process.env.DB_NAME_PROV
        },
        private: {
            sucursalBcoCba: process.env.SUCURSAL_BCO_CBA,
            ctaBcoCba: process.env.NRO_CTA_BCO_CBA,
            cbuBcoCba: process.env.CBU_BCO_CBA
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
        },
        mysql2: {
            host: process.env.HOST_DB_TEST_CASA,
            user: process.env.USER_DB_TEST_CASA,
            password: process.env.PASS_DB_TEST_CASA,
            database: process.env.DB_NAME_PROV
        },
        private: {
            sucursalBcoCba: process.env.SUCURSAL_BCO_CBA,
            ctaBcoCba: process.env.NRO_CTA_BCO_CBA,
            cbuBcoCba: process.env.CBU_BCO_CBA
        }
    }
}

module.exports = config