import axios, { AxiosInstance } from 'axios';

/* 
A Singleton API client that connects the frontend
to the backend server.
*/
class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/',
    //   baseURL: process.env.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  public get<T>(url: string, config = {}) {
    return this.axiosInstance.get<T>(url, config);
  }

  public post<T>(url: string, data = {}, config = {}) {
    return this.axiosInstance.post<T>(url, data, config);
  }

  public put<T>(url: string, data = {}, config = {}) {
    return this.axiosInstance.put<T>(url, data, config);
  }

  public delete<T>(url: string, config = {}) {
    return this.axiosInstance.delete<T>(url, config);
  }
}

export const api = ApiClient.getInstance();
