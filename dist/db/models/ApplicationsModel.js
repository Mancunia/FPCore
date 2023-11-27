"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../../utilities/config");
const ProcessorMappingModel_1 = __importDefault(require("./ProcessorMappingModel"));
const TransactionsModel_1 = __importDefault(require("./TransactionsModel"));
class Application extends sequelize_1.Model {
}
Application.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    CallBackUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    DeactivatedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    timestamps: true,
    sequelize: config_1.SequelizeInstance.getDatabaseConnection(),
    paranoid: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt"
});
//constraints
Application.hasMany(ProcessorMappingModel_1.default);
Application.hasMany(TransactionsModel_1.default);
exports.default = Application;
//# sourceMappingURL=ApplicationsModel.js.map