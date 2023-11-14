import "dotenv/config"


    export const GIP_URL = process.env.GIP_URL as string
    export const GIP_USER = process.env.GIP_USER as string
    export const GIP_PASSWORD =  process.env.GIP_PASSWORD as string

    //Server configuration
    export const SERVER_HOST = process.env.SERVER_DB_HOST as string
    export const SERVER_DB_NAME = process.env.SERVER_DB_NAME as string
    export const SERVER_USER = process.env.SERVER_DB_USER as string
    export const SERVER_PASSWORD = process.env.SERVER_DB_PASSWORD as string
    export const SERVER_LOG_FILE = process.env.LOG_FILE as string
    export const SERVER_DIALECT = process.env.SERVER_DIALECT as string
    export const SERVER_ENV = process.env.SERVER_ENV as string
    export const SERVER_PORT = Number(process.env.SERVER_PORT as string)

