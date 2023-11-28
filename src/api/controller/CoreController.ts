import CoreService from "../service/CoreService";
import { Request,Response } from "express";
import ErrorHandler from "../../utilities/error";

const service = new CoreService()
const errorHandler = new ErrorHandler()
class CoreController{

    async MakeNameEnquiry(req: Request, res: Response){
        try {
           
            let payload= req.body//extract body from request

            let response = await service.MakeNameEnquiry(res.locals.appToken,payload)

            res.status(200).json(response)

        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async MakeFundTransfer(req: Request, res: Response){
        try {
            let payload = req.body
            let transaction = await service.MakeFundTransfer(res.locals.appToken,payload)

            res.status(200).json(transaction)
            
        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }

    async GetTransaction(req: Request, res: Response) {
        try {
            let refID = req.params.reference
            let transaction = await service.GetTransactionDetails(refID)

            res.status(200).json(transaction)
        } catch (error) {
            let errors:[number,string,string?] = await errorHandler.HandleError(error?.errorCode,error?.message)
            res.status(errors[0]).json({error: errors[1],message:errors[2]})
        }
    }
}


export default CoreController