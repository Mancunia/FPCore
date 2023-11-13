import "dotenv/config"


    export const GIP_URL = process.env.GIP_URL as string
    export const GIP_USER = process.env.GIP_USER as string
    export const GIP_PASSWORD =  process.env.GIP_PASSWORD as string

    //Server configuration
    export const SERVER_HOST = process.env.SERVER_HOST as string
    export const SERVER_DB_NAME = process.env.SERVER_DB_NAME as string
    export const SERVER_USER = process.env.SERVER_USER as string
    export const SERVER_PASSWORD = process.env.SERVER_PASSWORD as string
    export const SERVER_LOG_FILE = process.env.LOG_FILE as string
    export const SERVER_DILECT = process.env.SERVER_DILECT as string

