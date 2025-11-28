import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    [key: string]: any;
    id: string;
    username: string;
    realName?: string;
    email?: string;
    phone?: string;
    roles?: string[];
    deptId?: string;
    status: 0 | 1;
    createTime?: string;
  }
}

async function getUserList(params: Recordable<any>) {
  const { page, pageSize, ...rest } = params || {};
  const query = {
    ...(typeof page === 'number' ? { page } : {}),
    ...(typeof pageSize === 'number' ? { size: pageSize } : {}),
    ...rest,
  };
  const data = await requestClient.get<any>('/users', { params: query });

  let items: Array<SystemUserApi.SystemUser> = [];
  if (!items.length) {
    items = (data?.content ?? data?.items ?? data ?? []) as Array<SystemUserApi.SystemUser>;
  }

  const total: number =
    data?.page?.totalElements ?? data?.total ?? (Array.isArray(data) ? data.length : items.length);

  return { items, total } as { items: Array<SystemUserApi.SystemUser>; total: number };
}

async function createUser(data: Omit<SystemUserApi.SystemUser, 'id'>) {
  return requestClient.post('/users', data);
}

async function updateUser(id: string, data: Omit<SystemUserApi.SystemUser, 'id'>) {
  return requestClient.put(`/users/${id}`, data);
}

async function deleteUser(id: string) {
  return requestClient.delete(`/users/${id}`);
}

export { createUser, deleteUser, getUserList, updateUser };