import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemPositionApi {
  export interface SystemPosition {
    [key: string]: any;
    id: string;
    name: string;
    code?: string;
    status: 0 | 1;
    remark?: string;
    createTime?: string;
  }
}

async function getPositionList(params: Recordable<any>) {
  const { page, pageSize, ...rest } = params || {};
  const query = {
    ...(typeof page === 'number' ? { page } : {}),
    ...(typeof pageSize === 'number' ? { size: pageSize } : {}),
    ...rest,
  };
  const data = await requestClient.get<any>('/positions', { params: query });

  let items: Array<SystemPositionApi.SystemPosition> = [];
  if (!items.length) {
    items = (data?.content ?? data?.items ?? data ?? []) as Array<SystemPositionApi.SystemPosition>;
  }

  const total: number =
    data?.page?.totalElements ?? data?.total ?? (Array.isArray(data) ? data.length : items.length);

  return { items, total } as { items: Array<SystemPositionApi.SystemPosition>; total: number };
}

async function createPosition(data: Omit<SystemPositionApi.SystemPosition, 'id'>) {
  return requestClient.post('/positions', data);
}

async function updatePosition(id: string, data: Omit<SystemPositionApi.SystemPosition, 'id'>) {
  return requestClient.put(`/positions/${id}`, data);
}

async function deletePosition(id: string) {
  return requestClient.delete(`/positions/${id}`);
}

export { createPosition, deletePosition, getPositionList, updatePosition };