import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemUserApi {
  export interface SystemUser {
    id: string;
    account: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatar?: string;
    description?: string;
    enable: boolean;
    departmentId?: string;
    departmentName?: string;
    positionIds?: string[];
    positionNames?: string[];
    roleIds?: string[];
    roleNames?: string[];
    createTime?: string;
    // Helper for UI consistency if needed, but trying to stick to API
    // realName: string; // Computed: firstName + lastName
  }

  export interface UserCreateRequest {
    account: string;
    firstName: string;
    lastName: string;
    password?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatar?: string;
    description?: string;
    enable?: boolean;
    departmentId?: string;
    positionIds?: string[];
    roleIds?: string[];
  }

  export interface UserUpdateRequest {
    account?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    email?: string;
    phone?: string;
    gender?: number;
    avatar?: string;
    description?: string;
    enable?: boolean;
    departmentId?: string;
    positionIds?: string[];
    roleIds?: string[];
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

  let rawItems: any[] = [];
  if (Array.isArray(data?.content)) {
    rawItems = data.content;
  } else if (Array.isArray(data?.items)) {
    rawItems = data.items;
  } else if (Array.isArray(data)) {
    rawItems = data;
  }

  const items: Array<SystemUserApi.SystemUser> = rawItems.map((item) => {
    return {
      ...item,
      // Ensure booleans are booleans
      enable: Boolean(item?.enable),
    } as SystemUserApi.SystemUser;
  });

  const total: number =
    data?.page?.totalElements ??
    data?.total ??
    (Array.isArray(data) ? data.length : items.length);

  return { items, total } as {
    items: Array<SystemUserApi.SystemUser>;
    total: number;
  };
}

async function createUser(data: SystemUserApi.UserCreateRequest) {
  return requestClient.post('/users', data);
}

async function updateUser(id: string, data: SystemUserApi.UserUpdateRequest) {
  return requestClient.put(`/users/${id}`, data);
}

async function deleteUser(id: string) {
  return requestClient.delete(`/users/${id}`);
}
async function updateUserEnabled(id: string, enable: boolean) {
  return requestClient.put(`/users/${id}/enabled`, { enable });
}

export { createUser, deleteUser, getUserList, updateUser, updateUserEnabled };
