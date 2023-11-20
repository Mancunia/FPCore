import Transaction,{TransactionIn,TransactionOut} from "../models/TransactionsModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";
import { Op } from "sequelize";

interface TransactionRepositoryInterface{
    createTransaction:(payload:TransactionIn)=>Promise<TransactionOut>;
    updateTransaction:(id:number,payload:Transaction)=>Promise<TransactionOut>;
    deleteTransaction:(id:number)=>Promise<void>;
    getTransaction:(id:number|string)=>Promise<TransactionOut>;
}

class TransactionRepository implements TransactionRepositoryInterface{
    private error:ErrorHandler

    constructor() {
        this.error = new ErrorHandler()
    }

    //---------------------------------------------------------------- createTransaction----------------------------------------------------------------
    async createTransaction(payload:TransactionIn):Promise<TransactionOut>{
        try {
            let transaction = await Transaction.findOne({where:{SessionID:payload.SessionID}})
            if(transaction) throw await this.error.CustomError(ErrorEnum[401],`Transaction with sessionID:${payload.SessionID} already exists`)//check if transaction with sessionID already exists

            transaction = await Transaction.create(payload)//create a new transaction
            return transaction
            
        } catch (error) {
            throw error
        }
    }

    //----------------------------------------------------------------- get Transaction ------------------------------------------------------------------
    async getTransaction(id:number|string):Promise<TransactionOut>{
        try{
            let transaction = await Transaction.findOne({where:{[Op.or]:[{id:id},{SessionID:id}]}});
            if(!transaction) throw this.error.CustomError(ErrorEnum[404],"Transaction not found");

            return transaction
        }
        catch (error) {
            throw error
        }
    }

    //---------------------------------------------------------------- get Transaction ----------------------------------------------------
    async updateTransaction(id:number|string,payload:TransactionOut):Promise<TransactionOut>{
        try {
            
            let transaction = await this.getTransaction(id)

            await (transaction as Transaction).update(payload)

            return transaction
            
        } catch (error) {
            
        }
    }

    //---------------------------------------------------------------- delete Transaction ----------------------------------------------------
    async deleteTransaction(id:number|string):Promise<void>{
        try {
            let transaction = await this.getTransaction(id)
            await (transaction as Transaction).destroy()
            
            return
            
        } catch (error) {
            throw error
        }
    }
}

export default TransactionRepository