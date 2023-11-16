import { DataTypes, Model, Optional } from "sequelize";//Sequelize module
import {SequelizeInstance} from "../../utilities/config";//Database connection instance
//TODO: import Transaction model here

interface RequestResponseInterface {
    id:number;
    Payload:string;
    Type: "Request" | "Response";
}

export interface RequestResponseIn extends Optional<RequestResponseInterface, 'id'>{
    TransactionID:string;
}
export interface RequestResponseOut extends Required<RequestResponseInterface>{}

class RequestResponse extends Model<RequestResponseInterface,RequestResponseIn> implements RequestResponseInterface{
    id:number;
    Payload: string;
    Type: "Request" | "Response";

}

//Init table
    RequestResponse.init({
        id: {
            type:DataTypes.INTEGER.UNSIGNED,
            primaryKey:true,
            autoIncrement:true
        },
        Payload:{
            type:DataTypes.STRING
        },
        Type:{
            type:DataTypes.STRING,
            allowNull:false,
            defaultValue:"Request"
        }
    },{
        timestamps:true,
        sequelize: SequelizeInstance.getDatabaseConnection(),
        paranoid:true,
        createdAt:"CreatedAt",
        updatedAt:"UpdatedAt"
    })

    export default RequestResponse
