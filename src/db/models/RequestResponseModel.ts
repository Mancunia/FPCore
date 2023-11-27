import { DataTypes, Model, Optional } from "sequelize";//Sequelize module
import {SequelizeInstance} from "../../utilities/config";//Database connection instance


interface RequestResponseInterface {
    id:number;
    Payload:string;
    Type: "Request" | "Response";
}

export interface RequestResponseIn extends Optional<RequestResponseInterface, 'id'> {
    TransactionId:number;
    ProcessorId:number;
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
