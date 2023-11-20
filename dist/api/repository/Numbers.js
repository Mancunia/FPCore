"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("../../utilities/axios"));
const xmlParser_1 = __importDefault(require("../../utilities/xmlParser"));
// const url = 'http://www.dataaccess.com/webservicesserver/NumberConversion.wso'
class SoapExample {
    constructor() {
        this.axios = axios_1.default.getInstance();
    }
    async NumberConversion(num, toNumber = false) {
        let data = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
        <soap:Body>\n    
        <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n 
        <ubiNum>${num}</ubiNum>\n    
        </NumberToWords>\n  
        </soap:Body>\n
        </soap:Envelope>`;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            },
            data: data
        };
        let result = await this.axios.request(config);
        let converted = await (0, xmlParser_1.default)(result.data);
        return converted['soap:Envelope']['soap:Body']['m:NumberToWordsResponse']['m:NumberToWordsResult'];
    }
}
exports.default = SoapExample;
//# sourceMappingURL=Numbers.js.map