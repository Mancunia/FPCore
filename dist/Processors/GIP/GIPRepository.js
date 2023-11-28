"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xmlParser_1 = __importDefault(require("../../utilities/xmlParser"));
const axios_1 = __importDefault(require("../../utilities/axios"));
const env_1 = require("../../utilities/env");
const error_1 = require("../../utilities/error");
// let data = `<?xml version="1.0" encoding="utf-8"?>\n
// <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
// <soap:Body>\n    
// <GIPTransactionOp xmlns="com.ghipss.gip">\n      
// <ReqGIPTransaction>\n        
// <Login>string</Login>\n        
// <Password>string</Password>\n        
// <Amount>string</Amount>\n        
// <datetime>string</datetime>\n        
// <TrackingNum>string</TrackingNum>\n        
// <FunctionCode>string</FunctionCode>\n        
// <OrigineBank>string</OrigineBank>\n        
// <DestBank>string</DestBank>\n        
// <SessionID>string</SessionID>\n        
// <ChannelCode>string</ChannelCode>\n        
// <NameToDebit>string</NameToDebit>\n        
// <AccountToDebit>string</AccountToDebit>\n        
// <NameToCredit>string</NameToCredit>\n        
// <AccountToCredit>string</AccountToCredit>\n        
// <Narration>string</Narration>\n        
// <OneTimePassword>string</OneTimePassword>\n        
// <QRCode>string</QRCode>\n        
// <ActCode>string</ActCode>\n        
// <AprvCode>string</AprvCode>\n       
//  <StatusQuery>string</StatusQuery>\n      
//  </ReqGIPTransaction>\n    
//  </GIPTransactionOp>\n  
//  </soap:Body>\n
//  </soap:Envelope>\n`;
class GIP_Processor {
    constructor() {
        this.axios = axios_1.default.getInstance();
        this.data = null;
    }
    getInstance() {
        if (!GIP_Processor.instance) {
            GIP_Processor.instance = new GIP_Processor();
        }
        return GIP_Processor.instance;
    }
    async NameEnquiry({ amount, date, tracking_trace, function_code, origin_bank, desitination_bank, session_id, channel_code, account_to_credit }) {
        let response;
        let res;
        try {
            console.log("In GIP_NameEnquiry");
            //xml request body
            this.data = `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Body>
                        <com:GIPTransaction>
                            <ReqGIPTransaction>
                                <Amount>${amount}</Amount>
                                <datetime>${date}</datetime>
                                <TrackingNum>${tracking_trace}</TrackingNum>
                                <FunctionCode>${function_code}</FunctionCode>
                                <OrigineBank>${origin_bank}</OrigineBank>
                                <DestBank>${desitination_bank}</DestBank>
                                <SessionID>${session_id}</SessionID>
                                <ChannelCode>${channel_code}</ChannelCode>
                                <AccountToCredit>${account_to_credit}</AccountToCredit>
                                <Password>${env_1.GIP_PASSWORD}</Password>
                                <Login>${env_1.GIP_USER}</Login>
                            </ReqGIPTransaction>
                        </com:GIPTransaction>
                    </soapenv:Body>
                </soap:Envelope>`;
            //axios request body
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env_1.GIP_URL,
                timeout: env_1.SERVER_TIMEOUT,
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8'
                },
                data: this.data
            };
            //axios request 
            res = await this.axios.request(config);
            //converted xml to json
            let data = await (0, xmlParser_1.default)(res.data);
            //Error response
            //TODO:check for error response
            //response body
            response.amount = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Amount']; //amount
            response.date = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['datetime']; //date
            response.tracking_number = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['TrackingNum']; //tracking number
            response.function_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['FunctionCode']; //function code
            response.origin_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['OrigineBank']; //origin bank
            response.destination_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['DestBank']; //destination bank
            response.session_id = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['SessionID']; //session id
            response.channel_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ChannelCode']; //channel code
            response.name_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['NameToCredit']; //name to credit
            response.account_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AccounToCredit']; //account to credit
            response.narration = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Narration']; //narration
            response.act_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ActCode']; //act code
            response.aprv_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AprvCode']; //aprv code
            if (response.act_code != "300")
                throw new Error(response.act_code);
            return response;
        }
        catch (error) {
            //TODO: handle error here
            console.log("in Repo", error);
            let code = error.message;
            switch (code) {
                case "100":
                case "306":
                    throw error_1.ErrorEnum[403];
                    break;
                default:
                    throw error_1.ErrorEnum[400];
                    break;
            }
        }
    }
    async BalanceEnquiry({ amount, account_to_debit, account_to_credit, date, tracking_trace, function_code, origin_bank, desitination_bank, session_id, channel_code, name_to_debit, narration }) {
        let response;
        let res;
        //TODO: Add fundtransfer functionality
        try {
            this.data = `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Body>
                        <com:GIPTransaction>
                            <ReqGIPTransaction>
                                <Amount>${amount}</Amount>
                                <datetime>${date}</datetime>
                                <TrackingNum>${tracking_trace}</TrackingNum>
                                <FunctionCode>${function_code}</FunctionCode>
                                <OrigineBank>${origin_bank}</OrigineBank>
                                <DestBank>${desitination_bank}</DestBank>
                                <SessionID>${session_id}</SessionID>
                                <ChannelCode>${channel_code}</ChannelCode>
                                <AccountToCredit>${account_to_credit}</AccountToCredit>
                                <AccountToDebit>${account_to_debit}</AccountToDebit>
                                <NameToDebit>${name_to_debit}</NameToDebit>
                                <Narration>${narration}</Narration>
                                <Password>${env_1.GIP_PASSWORD}</Password>
                                <Login>${env_1.GIP_USER}</Login>
                            </ReqGIPTransaction>
                        </com:GIPTransaction>
                    </soapenv:Body>
                </soap:Envelope>`;
            //axios request body
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env_1.GIP_URL,
                timeout: env_1.SERVER_TIMEOUT,
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8'
                },
                data: this.data
            };
            //axios request 
            res = await this.axios.request(config);
            //converted xml to json
            let data = await (0, xmlParser_1.default)(res.data);
            //Error response
            //TODO:check for error response
            //response body
            response.amount = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Amount']; //amount
            response.date = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['datetime']; //date
            response.tracking_number = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['TrackingNum']; //tracking number
            response.function_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['FunctionCode']; //function code
            response.origin_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['OrigineBank']; //origin bank
            response.session_id = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['SessionID']; //session id
            response.channel_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ChannelCode']; //channel code
            response.name_to_dedit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['NameToCredit']; //name to credit
            response.account_to_dedit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AccounToCredit']; //account to credit
            response.narration = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Narration']; //narration
            response.act_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ActCode']; //act code
            response.aprv_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AprvCode']; //aprv code
            if (response.act_code != "000")
                throw new Error(response.act_code);
            return response;
        }
        catch (error) {
            //TODO:Handle error response
            throw error;
        }
    }
    async FundTransfer({ amount, account_to_debit, account_to_credit, date, tracking_trace, function_code, origin_bank, desitination_bank, session_id, channel_code, name_to_debit, name_to_credit, narration, QRCode }) {
        let response;
        let res;
        //TODO: Add fundtransfer functionality
        try {
            this.data = `<?xml version="1.0" encoding="utf-8"?>
                <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                    <soapenv:Body>
                        <com:GIPTransaction>
                            <ReqGIPTransaction>
                                <Amount>${amount}</Amount>
                                <datetime>${date}</datetime>
                                <TrackingNum>${tracking_trace}</TrackingNum>
                                <FunctionCode>${function_code}</FunctionCode>
                                <OrigineBank>${origin_bank}</OrigineBank>
                                <DestBank>${desitination_bank}</DestBank>
                                <SessionID>${session_id}</SessionID>
                                <ChannelCode>${channel_code}</ChannelCode>
                                <AccountToCredit>${account_to_credit}</AccountToCredit>
                                <NameToCredit>${name_to_credit}</NameToCredit>
                                <AccountToDebit>${account_to_debit}</AccountToDebit>
                                <NameToDebit>${name_to_debit}</NameToDebit>
                                <Narration>${narration}</Narration>
                                <Password>${env_1.GIP_PASSWORD}</Password>
                                <Login>${env_1.GIP_USER}</Login>
                            </ReqGIPTransaction>
                        </com:GIPTransaction>
                    </soapenv:Body>
                </soap:Envelope>`;
            //axios request body
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: env_1.GIP_URL,
                timeout: env_1.SERVER_TIMEOUT,
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8'
                },
                data: this.data
            };
            //axios request 
            res = await this.axios.request(config);
            //converted xml to json
            let data = await (0, xmlParser_1.default)(res.data);
            //Error response
            //TODO:check for error response
            //response body
            response.amount = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Amount']; //amount
            response.date = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['datetime']; //date
            response.tracking_number = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['TrackingNum']; //tracking number
            response.function_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['FunctionCode']; //function code
            response.origin_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['OrigineBank']; //origin bank
            response.destination_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['DestBank']; //destination bank
            response.session_id = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['SessionID']; //session id
            response.channel_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ChannelCode']; //channel code
            response.name_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['NameToCredit']; //name to credit
            response.account_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AccounToCredit']; //account to credit
            response.narration = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Narration']; //narration
            response.act_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ActCode']; //act code
            response.aprv_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AprvCode']; //aprv code
            if (response.act_code != "300")
                throw new Error(response.act_code);
            return response;
        }
        catch (error) {
            //TODO:Handle error exceptions
            throw error;
        }
    }
    async CheckTransactionStatus() {
        return;
    }
    async ReverseTransaction() {
        //TODO: Add reverse transaction functionality
        return await {};
    }
}
exports.default = GIP_Processor;
//# sourceMappingURL=GIPRepository.js.map