import { PICSUM_IMAGE_LIST } from '../api/apiConstant'
import { createApiConfig } from '../api/apiHelper'
import type { AxiosRequestConfig } from 'axios'

export const getPicsumImageList = (params: { page: number; limit: number }): AxiosRequestConfig =>
  createApiConfig(PICSUM_IMAGE_LIST, 'get', params, undefined)
