import { DataTypes,Model,Optional } from "sequelize";
import { SequelizeInstance } from "../../utilities/config";
import Transaction from "./TransactionsModel";

interface TransactionTypeInterface{
    id:number;
    Name:string;
    MinAmount:number;
    MaxAmount:number;
    DeactivatedAt:Date
}

export interface TransactionTypeIn extends Optional<TransactionTypeInterface, 'id'|'DeactivatedAt'>{}
export interface TransactionTypeOut extends Required<TransactionTypeInterface>{}

class TransactionType extends Model<TransactionTypeInterface,TransactionTypeIn> implements TransactionTypeInterface{
    id: number;
    Name: string;
    MinAmount: number;
    MaxAmount: number;
    DeactivatedAt: Date;
}

TransactionType.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    MinAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.00
    },
    MaxAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    DeactivatedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    tableName: 'TransactionTypes',
    timestamps:true,
    paranoid:true,
    createdAt:"CreatedAt",
    updatedAt:"UpdatedAt",
    sequelize:SequelizeInstance.getDatabaseConnection()
})

//constrainst
TransactionType.hasMany(Transaction)

export default TransactionType