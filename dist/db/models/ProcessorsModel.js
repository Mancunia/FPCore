"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../../utilities/config");
const ProcessorMappingModel_1 = __importDefault(require("./ProcessorMappingModel"));
const TransactionsModel_1 = __importDefault(require("./TransactionsModel"));
class Processor extends sequelize_1.Model {
}
Processor.init({
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
    Processes: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "BOTH"
    },
    DeactivatedAt: {
        type: sequelize_1.DataTypes.DATE
    }
}, {
    timestamps: true,
    paranoid: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: config_1.SequelizeInstance.getDatabaseConnection()
});
//constraints ----------------------------------------------------------------
Processor.hasMany(ProcessorMappingModel_1.default);
Processor.hasMany(TransactionsModel_1.default);
exports.default = Processor;
//# sourceMappingURL=ProcessorsModel.js.map