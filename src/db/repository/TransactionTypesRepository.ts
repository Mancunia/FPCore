import TransactionType,{TransactionTypeIn,TransactionTypeOut} from "../models/TransactionTypes";
import ErrorHandler,{ErrorEnum} from "../../utilities/error";

interface TransactionTypesRepo_Interface {
    createTransactionType:(TransactionTypeDetails: TransactionTypeIn)=>Promise<TransactionTypeOut>
    updateTransactionType:(type:number,TransactionTypeDetails: TransactionTypeIn)=>Promise<TransactionTypeOut>
    selectOneTransactionType:(type:number)=>Promise<TransactionTypeOut>

}

class TransactionTypesRepository implements TransactionTypesRepo_Interface {

    private error: ErrorHandler
    constructor(){
        this.error = new ErrorHandler()
    }

    //----------------------------------------------------------------Create Transaction Types ----------------------------------------------------------------
    async createTransactionType(TransactionTypeDetails:TransactionTypeIn):Promise<TransactionTypeOut> {
        try {
            let newTransactionType = await TransactionType.create(TransactionTypeDetails)
            return newTransactionType
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`Transaction type ${TransactionTypeDetails.Name}  name exist already`)
                }
                throw await this.error.CustomError(ErrorEnum[400],"Error creating Transaction type")
            }
        
    }

    //---------------------------------------------------------------- Get A Transaction Types ----------------------------------------------------------------
    async selectOneTransactionType(type: number): Promise<TransactionTypeOut>{
        try {
            let transactionType = await TransactionType.findOne({where:{id:type}})
            if(!transactionType) throw await this.error.CustomError(ErrorEnum[404],"Transaction Type Not found")

            return transactionType
            
        } catch (error) {
                throw error
            
        }
    }

    //---------------------------------------------------------------- update a Transaction Type ----------------------------------------------------------------
    async updateTransactionType(type:number,TransactionTypeDetails:TransactionTypeIn):Promise<TransactionTypeOut>{
        try {
            let transactionType = await this.selectOneTransactionType(type);

            await (transactionType as TransactionType).update(TransactionTypeDetails)

            return transactionType
            
        } catch (error) {
            if(error.name === "SequelizeUniqueConstraintError") {
                throw await this.error.CustomError(ErrorEnum[401],`Transaction type ${TransactionTypeDetails.Name}  name exist already`)
                }
                throw await this.error.CustomError(ErrorEnum[400],"Error creating format")
            
        }
    }
}


export default TransactionTypesRepository