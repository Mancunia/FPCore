import axios,{AxiosRequestConfig,AxiosResponse} from 'axios';
import ErrorHandler,{ErrorEnum} from './error';

const errorHandler = new ErrorHandler()
class SingletonAxios {
  private static instance: SingletonAxios;

  private constructor() {
    SingletonAxios.instance = axios.create();
  }

  public static getInstance(): SingletonAxios {
    if (!SingletonAxios.instance) {
      SingletonAxios.instance = new SingletonAxios();
    }

    return SingletonAxios.instance;
  }

  public async request(data:AxiosRequestConfig):Promise<AxiosResponse> {
    try {
      return await axios.request(data);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is due to a timeout
        if(axios.isCancel(error)) {
          // console.error('Request was canceled:', error.message);
          throw await errorHandler.CustomError(ErrorEnum[408],"Request Timed out")
        } else {
          // console.error('Axios request error:', error.message);
          throw await errorHandler.CustomError(ErrorEnum[400],"Request Error")
        }
      } else {
        console.error('Non-Axios error:', error.message);
      }

     
    }
    
    
  }

  static async AxiosPostRequest(url:string, body):Promise<AxiosResponse> {
    try {
     return await axios.post(url,body)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Check if the error is due to a timeout
        if(axios.isCancel(error)) {
          // console.error('Request was canceled:', error.message);
          throw await errorHandler.CustomError(ErrorEnum[408],"Request Timed out")
        } else {
          // console.error('Axios request error:', error.message);
          throw await errorHandler.CustomError(ErrorEnum[400],"Request Error")
        }
      } else {
        throw await errorHandler.CustomError(ErrorEnum[400],"Request Error")
      }
    }
  }
}

export default SingletonAxios