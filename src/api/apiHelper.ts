import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export async function makeApiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axios(config)
  return response.data as T
}

export async function makeApiRequestWithHeaderResponse<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await axios(config)
  return response as T
}

// Define a function that creates an API configuration object
export function createApiConfig<T = AxiosResponse>(
  url: string,
  method: AxiosRequestConfig['method'],
  params?: Record<string, string | number | boolean>,
  data?: T,
  responseType?: AxiosRequestConfig['responseType'],
): AxiosRequestConfig {
  const config: AxiosRequestConfig = {
    method,
    url,
  }

  if (params) {
    config.params = params // Add request parameters if they exist
  }

  if (data) {
    config.data = data // Add request payload if it exists
  }

  if (responseType) {
    config.responseType = responseType // Add response type
  }

  return config
}
