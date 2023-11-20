"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = require("../../utilities/config");
class ProcessorMapping extends sequelize_1.Model {
}
ProcessorMapping.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
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
//constraints
exports.default = ProcessorMapping;
//# sourceMappingURL=ProcessorMappingModel.js.map