import { Dialect,Sequelize } from "sequelize";
import {SERVER_HOST,SERVER_DB_NAME,SERVER_USER,SERVER_PASSWORD,SERVER_DIALECT,SERVER_PORT} from "./env"

// export const ALLOWED:string[] = JSON.parse(process.env.ALLOWED_HOSTS as string)

class DBConfig {
  //DB details
  private dbHost = SERVER_HOST
  private dbDriver = SERVER_DIALECT as Dialect 
  private dbName = SERVER_DB_NAME
  private dbUser = SERVER_USER
  private dbPassword = SERVER_PASSWORD
  port  = SERVER_PORT

  // private static SingleInstanceSequelize:Sequelize

  private sequelizeConnection: Sequelize

  constructor() {
    this.sequelizeConnection = new Sequelize(this.dbName,this.dbUser,this.dbPassword,{
      host:this.dbHost,
      dialect:this.dbDriver || "mysql"
    })
  } 


 public async connectToDBs():Promise<boolean>{
    try {
        this.sequelizeConnection
          .authenticate()
          .then(() => {
            // dbInit();
          })
          .catch((error) => {
            throw error
          });
         
          return true
        
    } catch (error) {
        //TODO: Handle error here with error handling module
        console.error("Error connecting to database", error)
    }
  }

  public getDatabaseConnection():Sequelize{
    // if(!DBConfig.SingleInstanceSequelize){
    //   return new DBConfig()
    // }
    return this.sequelizeConnection
  }

  // public static getInstance(): Sequelize {
  //   if (!DBConfig.SingleInstanceSequelize) {
  //     DBConfig.SingleInstanceSequelize = this.sequelizeConnection;
  //   }

  //   return DBConfig.SingleInstanceSequelize
  // }

}

export const SequelizeInstance = new DBConfig()

export default DBConfig;
