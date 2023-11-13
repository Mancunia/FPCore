import SingletonAxios from "../../utilities/axios"; 
import xmlToJson from "../../utilities/xmlParser";
import { AxiosRequestConfig } from "axios";

// const url = 'http://www.dataaccess.com/webservicesserver/NumberConversion.wso'


class SoapExample{
    private axios: SingletonAxios = SingletonAxios.getInstance();

    async NumberConversion(num:number | string, toNumber:boolean = false): Promise<number|string>{
        let data = `<?xml version="1.0" encoding="utf-8"?>\n
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\n  
        <soap:Body>\n    
        <NumberToWords xmlns="http://www.dataaccess.com/webservicesserver/">\n 
        <ubiNum>${num}</ubiNum>\n    
        </NumberToWords>\n  
        </soap:Body>\n
        </soap:Envelope>`;

        let config:AxiosRequestConfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://www.dataaccess.com/webservicesserver/NumberConversion.wso',
          headers: { 
            'Content-Type': 'text/xml; charset=utf-8'
          },
          data : data
        };
        
        let result = await this.axios.request(config);
        let converted = await xmlToJson(result.data)
    
        return converted['soap:Envelope']['soap:Body']['m:NumberToWordsResponse']['m:NumberToWordsResult']

    }
}

export default SoapExample