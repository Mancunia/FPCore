import {Request, Response,NextFunction} from "express"
import ErrorHandler,{ErrorEnum} from "../../utilities/error";
import HELPER from "../../utilities/helper";
import ApplicationService from "../service/ApplicationService"

const errorHandler = new ErrorHandler()


export async function CHECKAPPTOKEN(req: Request, res: Response, next: NextFunction){
    try {
        const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
     }

  // Extract the token from the Authorization header
    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer')  throw await errorHandler.CustomError(ErrorEnum[403],'Invalid Authorization header format' );
    

    let bearerToken = tokenParts[1];
     console.log("Before:",bearerToken);
    bearerToken = await HELPER.DECODE_TOKEN(bearerToken)
    console.log("After:",bearerToken);
    res.locals.appToken = bearerToken

    next()

    } catch (error) {
        let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
    }
}