import TransactionRepository from "../../db/repository/TransactionsRepository";
import { TransactionIn, TransactionOut } from "../../db/models/TransactionsModel";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

class TransactionService{
    private Repo: TransactionRepository;
    private error: ErrorHandler;
    

    constructor(){
        this.Repo = new TransactionRepository()
        this.error= new ErrorHandler()

    }

    async CreateTransaction(payload:TransactionIn): Promise<TransactionOut> {

        try {
            if(!payload.SessionID||!payload.ApplicationId) throw await this.error.CustomError(ErrorEnum[403],"Some essential information is missing")

            let transaction = await this.Repo.createTransaction(payload)
            return transaction
            
        } catch (error) {
            throw error
        }
    }

    async GetTransaction(id:string): Promise<TransactionOut> {
        try {
            if(!id) throw await this.error.CustomError(ErrorEnum[403],"Transaction Id not provided")
            let transaction = await this.Repo.getTransaction(id)

            return transaction
        } catch (error) {
            throw error
        }
    }
}

export default TransactionService