import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    name: string;
    permissions: string[];
    description?: string;
    status: 0 | 1;
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  const { page, pageSize, ...rest } = params || {};
  const query = {
    ...(typeof page === 'number' ? { page } : {}),
    ...(typeof pageSize === 'number' ? { size: pageSize } : {}),
    ...rest,
  };
  const data = await requestClient.get<any>('/roles', { params: query });

  let items: Array<SystemRoleApi.SystemRole> = [];
  if (!items.length) {
    items = (data?.content ?? []) as Array<SystemRoleApi.SystemRole>;
  }

  const total: number =
    data?.page?.totalElements ?? (Array.isArray(data) ? data.length : items.length);

  return { items, total } as { items: Array<SystemRoleApi.SystemRole>; total: number };
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.post('/roles', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: string,
  data: Omit<SystemRoleApi.SystemRole, 'id'>,
) {
  return requestClient.put(`/roles/${id}`, data);
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.delete(`/roles/${id}`);
}

export { createRole, deleteRole, getRoleList, updateRole };
