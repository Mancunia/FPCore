"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../../utilities/config");
const RequestResponseModel_1 = __importDefault(require("./RequestResponseModel"));
class Transaction extends sequelize_1.Model {
}
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    Amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    SessionID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    ProcessedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    paranoid: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: config_1.SequelizeInstance.getDatabaseConnection()
});
//constraints
Transaction.hasMany(RequestResponseModel_1.default);
exports.default = Transaction;
//# sourceMappingURL=TransactionsModel.js.map