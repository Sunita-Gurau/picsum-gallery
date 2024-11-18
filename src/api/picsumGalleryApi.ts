import { PICSUM_IMAGE_LIST, IMAGE_DETAIL } from '../api/apiConstant'
import { createApiConfig } from '../api/apiHelper'
import type { AxiosRequestConfig } from 'axios'

export const getPicsumImageList = (params: { page: number; limit: number }): AxiosRequestConfig =>
  createApiConfig(PICSUM_IMAGE_LIST, 'get', params, undefined)

export const getImageDetail = (params: { id: number }): AxiosRequestConfig => {
  const url = IMAGE_DETAIL(params.id)
  return createApiConfig(url, 'get', undefined, undefined)
}
