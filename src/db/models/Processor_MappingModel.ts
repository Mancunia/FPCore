import { DataTypes,Model,Optional } from "sequelize";
import {SequelizeInstance} from "../../utilities/config";
//TODO: import processors and application model here

interface ProcessorMappingInterface {
    id:number;
    DeactivatedAt:Date;
}

export interface ProcessorMappingIn extends Optional<ProcessorMappingInterface,'id'|'DeactivatedAt'> {}
export interface ProcessorMappingOut extends Required<ProcessorMappingInterface>{
    ProcessorID:number;
    ApplicationID:number;
}


class ProcessorMapping extends Model<ProcessorMappingInterface, ProcessorMappingIn> implements ProcessorMappingInterface{
    id:number;
    AppID: number;
    DeactivatedAt: Date;
}

ProcessorMapping.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
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