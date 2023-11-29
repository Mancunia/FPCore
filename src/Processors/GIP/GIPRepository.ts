import { ProcessorsRepository } from "..";
import { NameEnquiryRequestData,FundTransferRequestData,BalanceEnquiryRequestData} from "./DTO";//request data transfer objects
import { GIPNameEnquiryResponseData,GIPFundTransferResponseData,GIPBasicResponseData } from "./DTO";//response data transfer objects
import toJson from "../../utilities/xmlParser";
import SingletonAxios from "../../utilities/axios";
import {GIP_PASSWORD,GIP_URL,GIP_USER,SERVER_TIMEOUT} from "../../utilities/env";
import { AxiosResponse } from "axios";
import { ErrorEnum } from "../../utilities/error";

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

    
    class GIP_Processor implements ProcessorsRepository{
        
        private axios: SingletonAxios
        private data:string
        
        ProcessorName: "GIP"; // name of the processor

        private static instance: GIP_Processor; // instance of GIP_Processor

        constructor (){
            this.axios = SingletonAxios.getInstance();
            this.data = null
        }

        public getInstance(): GIP_Processor{//singleton instance
            if (!GIP_Processor.instance) {
                GIP_Processor.instance = new GIP_Processor();
              }
          
              return GIP_Processor.instance;
            }

        

        async NameEnquiry({
            amount,
            date,
            tracking_trace,
            function_code,
            origin_bank,
            desitination_bank,
            session_id,
            channel_code,
            account_to_credit}:NameEnquiryRequestData): Promise<GIPNameEnquiryResponseData> {
                
            let response: GIPNameEnquiryResponseData
            let res: AxiosResponse
            try {
                console.log("In GIP_NameEnquiry")
                //xml request body
                this.data =`<?xml version="1.0" encoding="utf-8"?>
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
                                <Password>${GIP_PASSWORD}</Password>
                                <Login>${GIP_USER}</Login>
                            </ReqGIPTransaction>
                        </com:GIPTransaction>
                    </soapenv:Body>
                </soap:Envelope>`

                //axios request body
                let config= {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: GIP_URL,
                    timeout:SERVER_TIMEOUT,
                    headers: { 
                      'Content-Type': 'text/xml; charset=utf-8'
                    },
                    data : this.data
                  };


                //axios request 
                res = await this.axios.request(config)

                //converted xml to json
                let data = await toJson(res.data)

                 //Error response
                //TODO:check for error response


                //response body
                response.amount = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Amount'] as number //amount
                response.date = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['datetime'] as string //date
                response.tracking_number = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['TrackingNum'] as number //tracking number
                response.function_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['FunctionCode'] as number //function code
                response.origin_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['OrigineBank'] as number //origin bank
                response.destination_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['DestBank'] as number //destination bank
                response.session_id = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['SessionID'] as number //session id
                response.channel_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ChannelCode'] as number //channel code
                response.name_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['NameToCredit'] as string //name to credit
                response.account_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AccounToCredit'] as string //account to credit
                response.narration = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Narration'] as string //narration
                response.act_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ActCode'] as string //act code
                response.aprv_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AprvCode'] as string //aprv code

                if(response.act_code != "300") throw new Error(response.act_code)

                return response

            } catch (error) {
                //TODO: handle error here
                console.log("in Repo",error)
                let code = error.message
               switch (code) {
                case "100":
                case "306":    
                throw ErrorEnum[403]
                    break;

                default:
                    throw ErrorEnum[400]
                    break;
               }
                
            }
           
        }

        async BalanceEnquiry({ amount,
            account_to_debit,
            account_to_credit,
            date,
            tracking_trace,
            function_code,
            origin_bank,
            desitination_bank,
            session_id,
            channel_code,
            name_to_debit,
            narration}:BalanceEnquiryRequestData): Promise<object> {
                let response: GIPBasicResponseData
                let res: AxiosResponse

            //TODO: Add fundtransfer functionality
            try {

                this.data =`<?xml version="1.0" encoding="utf-8"?>
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
                                <Password>${GIP_PASSWORD}</Password>
                                <Login>${GIP_USER}</Login>
                            </ReqGIPTransaction>
                        </com:GIPTransaction>
                    </soapenv:Body>
                </soap:Envelope>`


                //axios request body
                let config= {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: GIP_URL,
                    timeout:SERVER_TIMEOUT,
                    headers: { 
                      'Content-Type': 'text/xml; charset=utf-8'
                    },
                    data : this.data
                  };


                //axios request 
                res = await this.axios.request(config)

                //converted xml to json
                let data = await toJson(res.data)

                //Error response
                //TODO:check for error response

                  //response body
                  response.amount = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Amount'] as number //amount
                  response.date = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['datetime'] as string //date
                  response.tracking_number = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['TrackingNum'] as number //tracking number
                  response.function_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['FunctionCode'] as number //function code
                  response.origin_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['OrigineBank'] as number //origin bank
                  response.session_id = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['SessionID'] as number //session id
                  response.channel_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ChannelCode'] as number //channel code
                  response.name_to_dedit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['NameToCredit'] as string //name to credit
                  response.account_to_dedit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AccounToCredit'] as string //account to credit
                  response.narration = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Narration'] as string //narration
                  response.act_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ActCode'] as string //act code
                  response.aprv_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AprvCode'] as string //aprv code
  
                  if(response.act_code != "000") throw new Error(response.act_code)
  
                  return response
                
            } catch (error) {
                  //TODO:Handle error response
                throw error
            }
        }

        async FundTransfer({amount,
            account_to_debit,
            account_to_credit,
            date,
            tracking_trace,
            function_code,
            origin_bank,
            desitination_bank,
            session_id,
            channel_code,
            name_to_debit,
            name_to_credit,
            narration,
            QRCode}:FundTransferRequestData): Promise<GIPFundTransferResponseData> {

                let response: GIPFundTransferResponseData
                let res: AxiosResponse

            //TODO: Add fundtransfer functionality
            try {

                this.data =`<?xml version="1.0" encoding="utf-8"?>
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
                                <Password>${GIP_PASSWORD}</Password>
                                <Login>${GIP_USER}</Login>
                            </ReqGIPTransaction>
                        </com:GIPTransaction>
                    </soapenv:Body>
                </soap:Envelope>`


                //axios request body
                let config= {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: GIP_URL,
                    timeout:SERVER_TIMEOUT,
                    headers: { 
                      'Content-Type': 'text/xml; charset=utf-8'
                    },
                    data : this.data
                  };


                //axios request 
                res = await this.axios.request(config)

                //converted xml to json
                let data = await toJson(res.data)

                //Error response
                //TODO:check for error response

                  //response body
                  response.amount = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Amount'] as number //amount
                  response.date = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['datetime'] as string //date
                  response.tracking_number = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['TrackingNum'] as number //tracking number
                  response.function_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['FunctionCode'] as number //function code
                  response.origin_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['OrigineBank'] as number //origin bank
                  response.destination_bank = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['DestBank'] as number //destination bank
                  response.session_id = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['SessionID'] as number //session id
                  response.channel_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ChannelCode'] as number //channel code
                  response.name_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['NameToCredit'] as string //name to credit
                  response.account_to_credit = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AccounToCredit'] as string //account to credit
                  response.narration = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['Narration'] as string //narration
                  response.act_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['ActCode'] as string //act code
                  response.aprv_code = data['soapenv:Body']['com:GIPTransaction']['ReqGIPTransaction']['AprvCode'] as string //aprv code

                  if(response.act_code != "300")throw new Error(response.act_code)
  
  
                  return response
                
            } catch (error) {
                  //TODO:Handle error exceptions
                throw error
            }
            
        }

        async ReverseTransaction(): Promise<object> {
            //TODO: Add reverse transaction functionality
            return await {}
        }

    }

    export default GIP_Processor