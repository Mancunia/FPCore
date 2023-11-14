import { DataTypes,Model,Optional } from "sequelize";
import { SequelizeInstance } from "../../utilities/config";
import Processor from "./ProcessorsModel";
import Application from "./ApplicationsModel";

interface TransactionInterface {
    id:number;
    SessionID:string;
    Amount:number;
    Status:"Processed" | "Processing" | "Failed" | "Pending" | "Canceled" | "Do Not Process"
    ProcessedAt:Date
}

export interface TransactionIn extends Optional<TransactionInterface,'id'|'ProcessedAt'> {}
export interface TransactionOut extends Required<TransactionInterface>{}

class Transaction extends Model<TransactionInterface,TransactionIn> implements TransactionInterface{
    id: number;
    SessionID: string;
    Amount: number;
    Status: "Processed" | "Processing" | "Failed" | "Pending" | "Canceled" | "Do Not Process";
    ProcessedAt: Date;
}

Transaction.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    Amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    SessionID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Status:{
        type: DataTypes.STRING,
        allowNull: false
    },
    ProcessedAt:{
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    timestamps:true,
    paranoid:true,
    createdAt:"CreatedAt",
    updatedAt:"UpdatedAt",
    sequelize:SequelizeInstance.getDatabaseConnection()
})

export default Transaction