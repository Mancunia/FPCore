import { DATE, DataTypes,Model,Optional } from "sequelize";
import {SequelizeInstance} from "../../utilities/config";

interface ProcessorMappingInterface {
    id:number;
    DeactivatedAt:Date;
    ApplicationId:number;
    ProcessorId:number;
}

export interface ProcessorMappingIn extends Optional<ProcessorMappingInterface,'id'|'DeactivatedAt'> {}
export interface ProcessorMappingOut extends Required<ProcessorMappingInterface>{}


class ProcessorMapping extends Model<ProcessorMappingInterface, ProcessorMappingIn> implements ProcessorMappingInterface{
    id:number;
    AppID: number;
    DeactivatedAt: Date;
    ApplicationId: number;
    ProcessorId: number;
}

ProcessorMapping.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    ApplicationId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    ProcessorId:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    DeactivatedAt:{
        type:DataTypes.DATE
    }
},{
    timestamps: true,
    paranoid: true,
    createdAt:"CreatedAt",
    updatedAt:"UpdatedAt",
    sequelize: SequelizeInstance.getDatabaseConnection()
})

//constraints


export default ProcessorMapping