"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_TIMEOUT = exports.SERVER_SECRET = exports.SERVER_PORT = exports.SERVER_ENV = exports.SERVER_DIALECT = exports.SERVER_LOG_FILE = exports.SERVER_PASSWORD = exports.SERVER_USER = exports.SERVER_DB_NAME = exports.SERVER_HOST = exports.GIP_PASSWORD = exports.GIP_USER = exports.GIP_URL = void 0;
require("dotenv/config");
//GHIPSS Credentials
exports.GIP_URL = process.env.GIP_URL;
exports.GIP_USER = process.env.GIP_USER;
exports.GIP_PASSWORD = process.env.GIP_PASSWORD;
//DB credentials
exports.SERVER_HOST = process.env.SERVER_DB_HOST;
exports.SERVER_DB_NAME = process.env.SERVER_DB_NAME;
exports.SERVER_USER = process.env.SERVER_DB_USER;
exports.SERVER_PASSWORD = process.env.SERVER_DB_PASSWORD;
exports.SERVER_LOG_FILE = process.env.SERVER_LOG_FILE;
exports.SERVER_DIALECT = process.env.SERVER_DIALECT;
//Server configuration
exports.SERVER_ENV = process.env.SERVER_ENV;
exports.SERVER_PORT = Number(process.env.SERVER_PORT);
exports.SERVER_SECRET = process.env.SERVER_SECRET;
exports.SERVER_TIMEOUT = Number(process.env.SERVER_TIMEOUT) || 5000;
//# sourceMappingURL=env.js.map