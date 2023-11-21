

export interface ProcessorsRepository{
    NameEnquiry:any;
    BalanceEnquiry:any;
    FundTransfer:any;
    CheckTransactionStatus?:any;
    ReverseTransaction:any;
}

export interface ProcessorsService{
    ProcessorName: "GIP";
    LogFile:string;
    MakeNameEnquiry:(payload:NameEnquiry)=>Promise<any>;
    GetBalanceEnquiry:any;
    MakeFundTransfer:any;
    CheckTransactionStatus?:any;
    ReverseTransaction:any;
    CheckProcessorStatus:() => Promise<boolean>;
}



//---------------------------------------------------------------- DTOS ----------------
export interface NameEnquiry{
    recipientName:string; 
    recipientAccount:string; 
    accountType: "MOBILE"|"BANK"
    bankMobileCode:number
}

export interface FundTransfer extends NameEnquiry{
    amount:number;
    senderName:string;
    bankMobileCode:number
    narration:string
}