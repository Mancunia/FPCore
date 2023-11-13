import axios,{AxiosRequestConfig,AxiosResponse} from 'axios';


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

    return await axios.request(data);
  }
}

export default SingletonAxios