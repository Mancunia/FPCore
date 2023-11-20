"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PORT = exports.SERVER_ENV = exports.SERVER_DIALECT = exports.SERVER_LOG_FILE = exports.SERVER_PASSWORD = exports.SERVER_USER = exports.SERVER_DB_NAME = exports.SERVER_HOST = exports.GIP_PASSWORD = exports.GIP_USER = exports.GIP_URL = void 0;
require("dotenv/config");
exports.GIP_URL = process.env.GIP_URL;
exports.GIP_USER = process.env.GIP_USER;
exports.GIP_PASSWORD = process.env.GIP_PASSWORD;
//Server configuration
exports.SERVER_HOST = process.env.SERVER_DB_HOST;
exports.SERVER_DB_NAME = process.env.SERVER_DB_NAME;
exports.SERVER_USER = process.env.SERVER_DB_USER;
exports.SERVER_PASSWORD = process.env.SERVER_DB_PASSWORD;
exports.SERVER_LOG_FILE = process.env.LOG_FILE;
exports.SERVER_DIALECT = process.env.SERVER_DIALECT;
exports.SERVER_ENV = process.env.SERVER_ENV;
exports.SERVER_PORT = Number(process.env.SERVER_PORT);
//# sourceMappingURL=env.js.map