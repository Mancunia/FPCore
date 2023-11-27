import { DataTypes,Model,Optional } from "sequelize";
import { SequelizeInstance } from "../../utilities/config";
import ProcessorMapping from "./ProcessorMappingModel";
import RequestResponse from "./RequestResponseModel";


interface ProcessorInterface {
    id:number;
    Name:string;
    Processes:"MOBILE" | "BANK" | "BOTH";
    DeactivatedAt:Date;
}

export interface ProcessorIn extends Optional<ProcessorInterface,'id'|'DeactivatedAt'>{}
export interface ProcessorOut extends Required<ProcessorInterface>{}

class Processor extends Model<ProcessorInterface,ProcessorIn> implements ProcessorInterface{
    id:number;
    Name: string;
    Processes: "MOBILE" | "BANK" | "BOTH";
    DeactivatedAt: Date;
}

Processor.init({
    id:{
        type:DataTypes.INTEGER.UNSIGNED,
        primaryKey:true,
        autoIncrement:true
    },
    Name:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    Processes:{
        type:DataTypes.STRING,
        defaultValue:"BOTH"
    },
    DeactivatedAt:{
        type:DataTypes.DATE
    }
},{
    timestamps: true,
    paranoid: true,
    createdAt:"CreatedAt",
    updatedAt:"UpdatedAt",
    sequelize:SequelizeInstance.getDatabaseConnection()
})

//constraints ----------------------------------------------------------------
Processor.hasMany(ProcessorMapping)
Processor.hasMany(RequestResponse)


export default Processor