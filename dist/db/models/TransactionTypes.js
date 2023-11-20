"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../../utilities/config");
const TransactionsModel_1 = __importDefault(require("./TransactionsModel"));
class TransactionType extends sequelize_1.Model {
}
TransactionType.init({
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
    MinAmount: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    MaxAmount: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: false,
    },
    DeactivatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'TransactionTypes',
    timestamps: true,
    paranoid: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    sequelize: config_1.SequelizeInstance.getDatabaseConnection()
});
//constrainst
TransactionType.hasMany(TransactionsModel_1.default);
exports.default = TransactionType;
//# sourceMappingURL=TransactionTypes.js.map