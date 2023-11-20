"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize"); //Sequelize module
const config_1 = require("../../utilities/config"); //Database connection instance
class RequestResponse extends sequelize_1.Model {
}
//Init table
RequestResponse.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    Payload: {
        type: sequelize_1.DataTypes.STRING
    },
    Type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "Request"
    }
}, {
    timestamps: true,
    sequelize: config_1.SequelizeInstance.getDatabaseConnection(),
    paranoid: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt"
});
exports.default = RequestResponse;
//# sourceMappingURL=RequestResponseModel.js.map