import { PICSUM_IMAGE_LIST } from '../api/apiConstant'
import { createApiConfig } from '../api/apiHelper'
import type { AxiosRequestConfig } from 'axios'

export const getPicsumImageList = (): AxiosRequestConfig =>
  createApiConfig(PICSUM_IMAGE_LIST, 'get', undefined, undefined)
