
//---------------------------------------------------------------- Request DTOs ----------------------------------------------------------------
export interface NameEnquiryRequestData {
    amount: string;
    date: string;
    tracking_trace:string;
    function_code: number;
    origin_bank?: string;
    desitination_bank: string;
    session_id: string;
    channel_code: string;
    name_to_debit?: string;
    account_to_debit?: string;
    account_to_credit?: string;
    narration: string;
}

export interface FundTransferRequestData extends NameEnquiryRequestData {
    name_to_debit?: string;
    name_to_credit?: string;
    account_to_credit: string;
    QRCode?: string;
}

export interface BalanceEnquiryRequestData extends NameEnquiryRequestData{
    account_to_debit: string;
}


//---------------------------------------------------------------- Response DTOs ------------------------------------------------------------------

export interface GIPBasicResponseData{
    amount: number;
    date: string;
    tracking_number: number;
    function_code: number;
    origin_bank: number;
    destination_bank: number;
    session_id: number;
    channel_code: number;
    name_to_credit?: string;
    account_to_credit?: string;
    name_to_dedit?: string;
    account_to_dedit?: string;
    narration: string;
    act_code:string;
    aprv_code: string;
}
export interface GIPNameEnquiryResponseData extends GIPBasicResponseData{
    name_to_credit: string;
    account_to_credit: string;
}

export interface GIPFundTransferResponseData extends GIPBasicResponseData{
    account_to_credit: string;
    name_to_dedit: string;
}

export interface GIPTransactionStatusQueryResponseData extends GIPBasicResponseData{
    account_to_debit: string;
    
}