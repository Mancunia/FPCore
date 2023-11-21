import CoreService from "../service/CoreService";
import { Request,Response } from "express";

const service = new CoreService()

class CoreController{

    async MakeNameEnquiry(req: Request, res: Response){
        try {
           
            let payload= req.body//extract body from request

            let response = await service.MakeNameEnquiry(res.locals.appToken,payload)

            res.status(200).json(response)

        } catch (error) {
            let [code, message,extra_message] = error

            res.status(code).json({message,extra_message})
        }
    }
}


export default CoreController