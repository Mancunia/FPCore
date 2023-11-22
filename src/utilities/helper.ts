//imports
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from "jsonwebtoken"
// import Config from '../db/config.js';
import ErrorHandler,{ErrorEnum} from './error';
import {v4 as uuidV4} from "uuid"
import { SERVER_SECRET } from './env';
//imports

const errorHandler = new ErrorHandler()

class HELPER{

    public static SessionMaxAge = 730*24*60*60;//2 years
    public static RefreshMaxAge = 60*24*60;

    public static SESSION = "session";
    public static Chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    public static getDate(): string{
        return new Date().toUTCString()
    }

    public static async logger(message: string,file:string = ""){
        // const file = Config.File
        message ="#"+message+"\n"
        let dir = `${__dirname}${file}`
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
            fs.appendFile(dir, message,async (err)=>{
                if(err){
                    console.log("Error",err);
                    throw await errorHandler.CustomError(ErrorEnum[500],`Error Writing File to file: ${file}`);
                  }
            });

        } catch (error) {
            throw error
            
        }
    }

    //JSON web Token 

public static async ENCODE_Token(id:string): Promise<string>{
    try {
        return await jwt.sign({id},SERVER_SECRET,{
      expiresIn: HELPER.SessionMaxAge
  });
    } catch (error) {
       throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    }
  
}


public static async DECODE_TOKEN(token:string): Promise<string>{
    //check token
    if(token){
        let back:string = "";
  
        try{
          
            await jwt.verify(token,SERVER_SECRET,(err,decodedToken)=>{
            if(err){
                errorHandler.CustomError(ErrorEnum[403],"Invalid Token"); ;
            }
            else{
               
                back=decodedToken.id;
            }
            });
  
            return back;
        }
        catch(error){
            throw error;
        }
  
        }
        
        
   
  }

  public static async GET_DIRECTORY(file:string,dir: string = __dirname): Promise<string> {
    try {
        let directory = await path.join(dir,file);
       
        return directory;
    } catch (error) {
        throw await errorHandler.CustomError(ErrorEnum[500],"Try again later"); 
    }
  }

  
  public static async genRandCode(size:number = 16):Promise<string>{
    try{
      let result = ""
      for ( let i = 0; i < size ; i++ ) {
          result += HELPER.Chars.charAt(Math.floor(Math.random() * HELPER.Chars.length));
      }
      if (result.length < size) throw new Error(ErrorEnum[500])
        return result
  }
    catch(error) {
        throw await errorHandler.CustomError(ErrorEnum[500],"Try again later"); 
    }
  }

  public static async GENERATE_UUID(): Promise<string>{
    try {
        let uuid = await uuidV4()
    
        if(!uuid){
            uuid = await this.genRandCode()
        }

        return uuid
    } catch (error) {
       throw await errorHandler.CustomError(ErrorEnum[500],"Try again later 🙏🏼"); 
    }
  }

  public static FILE_DETAILS(file){
    try {
        let ext = (path.extname(file.name))
        return { extension:ext}
    } catch (error) {
        
    }
  }

   
}

export default HELPER

