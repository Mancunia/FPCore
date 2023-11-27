import TransactionTypesRepository from "../../db/repository/TransactionTypesRepository";
import { TransactionTypeIn,TransactionTypeOut } from "../../db/models/TransactionTypes";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

class TransactionTypeService{

    private repo: TransactionTypesRepository;
    private error: ErrorHandler;

    constructor(){
        this.repo = new TransactionTypesRepository()
        this.error = new ErrorHandler()

    }

    async CreateTransactionType(type: TransactionTypeIn):Promise<TransactionTypeOut>{
        try {
            if(!type.Name || type.MinAmount < 0 || !type.MaxAmount) throw await this.error.CustomError(ErrorEnum[403],"TransactionType details missing");

            type.Name = type.Name.toUpperCase()//make uppercase
            let transactionType = await this.repo.createTransactionType(type);
            return transactionType
            
        } catch (error) {
            throw error
        }
    }

    async GetTransactionTypeByName(typeName:string):Promise<TransactionTypeOut>{
        try {
            if(!typeName) throw this.error.CustomError(ErrorEnum[401],"TransactionType name is invalid");
            let transactionType = await this.repo.selectOneTransactionType(typeName)

            return transactionType
        } catch (error) {
            throw error
        }
    }
}


export default TransactionTypeService
