"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeInstance = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
// export const ALLOWED:string[] = JSON.parse(process.env.ALLOWED_HOSTS as string)
class DBConfig {
    constructor() {
        //DB details
        this.dbHost = env_1.SERVER_HOST;
        this.dbDriver = env_1.SERVER_DIALECT;
        this.dbName = env_1.SERVER_DB_NAME;
        this.dbUser = env_1.SERVER_USER;
        this.dbPassword = env_1.SERVER_PASSWORD;
        this.port = env_1.SERVER_PORT;
        this.sequelizeConnection = new sequelize_1.Sequelize(this.dbName, this.dbUser, this.dbPassword, {
            host: this.dbHost,
            dialect: this.dbDriver || "mysql"
        });
    }
    async connectToDBs() {
        try {
            this.sequelizeConnection
                .authenticate()
                .then(() => {
                // dbInit();
            })
                .catch((error) => {
                throw error;
            });
            return true;
        }
        catch (error) {
            //TODO: Handle error here with error handling module
            console.error("Error connecting to database", error);
        }
    }
    getDatabaseConnection() {
        // if(!DBConfig.SingleInstanceSequelize){
        //   return new DBConfig()
        // }
        return this.sequelizeConnection;
    }
}
exports.SequelizeInstance = new DBConfig();
exports.default = DBConfig;
//# sourceMappingURL=config.js.map