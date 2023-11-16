import { DataTypes,Model,Optional } from "sequelize";
import {SequelizeInstance} from "../../utilities/config";
import ProcessorMapping from "./ProcessorMappingModel";
import Transaction from "./TransactionsModel";

interface ApplicationInterface {
    id:number,
    Name:string,
    Token:string,
    DeactivatedAt:Date
}

export interface ApplicationIn extends Optional<ApplicationInterface,'id'|'DeactivatedAt'>{}
export interface ApplicationOut extends Required<ApplicationInterface>{}

class Application extends Model<ApplicationInterface,ApplicationIn> implements ApplicationInterface{
    id:number;
    Name:string;
    Token: string;
    DeactivatedAt: Date;
}

Application.init({
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
    Token:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    DeactivatedAt:{
        type:DataTypes.DATE
    }
},{
    timestamps:true,
    sequelize:SequelizeInstance.getDatabaseConnection(),
    paranoid:true,
    createdAt:"CreatedAt",
    updatedAt:"UpdatedAt"
})

//constraints
Application.hasMany(ProcessorMapping)
Application.hasMany(Transaction)


export default Application