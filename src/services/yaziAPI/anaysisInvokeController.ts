// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** getAnalysisInvoke GET /api/analysis/invoke/interfaceInfo */
export async function getAnalysisInvokeUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListAnalysisInvokeVO_>('/api/analysis/invoke/interfaceInfo', {
    method: 'GET',
    ...(options || {}),
  });
}
