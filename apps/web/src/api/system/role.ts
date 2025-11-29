import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    name: string;
    permissions: string[];
    description?: string;
    enabled: boolean;
  }

  export interface RoleDetailResponse {
    id: string;
    name: string;
    description: string;
    permissionScope: number;
    sort: number;
    permissions: string[];
    enabled: boolean;
  }

  export interface RoleCreateRequest {
    name: string;
    description: string;
    permissionScope: number;
    sort: number;
    permissions: string[];
    enabled?: boolean;
  }

  export interface RoleUpdateRequest {
    name: string;
    description: string;
    permissionScope: number;
    sort: number;
    permissions: string[];
    enabled?: boolean;
  }

  export interface RoleResponse {
    id: string;
    name: string;
    description: string;
    permissionScope: number;
    sort: number;
    enabled: boolean;
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

  let rawItems: any[] = [];
  if (Array.isArray(data?.content)) {
    rawItems = data.content;
  } else if (Array.isArray(data)) {
    rawItems = data;
  }

  const items: Array<SystemRoleApi.SystemRole> = rawItems.map((item) => {
    return {
      id: String(item?.id ?? ''),
      name: item?.name ?? item?.roleName ?? '',
      description: item?.description ?? '',
      permissions: Array.isArray(item?.permissions) ? item.permissions : [],
      enabled: Boolean(item?.enabled ?? item?.status === 1),
    } as SystemRoleApi.SystemRole;
  });

  const total: number =
    data?.page?.totalElements ??
    (Array.isArray(data) ? data.length : items.length);

  return { items, total } as {
    items: Array<SystemRoleApi.SystemRole>;
    total: number;
  };
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: SystemRoleApi.RoleCreateRequest) {
  return requestClient.post<SystemRoleApi.RoleDetailResponse>('/roles', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: string,
  data: Partial<SystemRoleApi.RoleUpdateRequest>,
) {
  return requestClient.put<SystemRoleApi.RoleDetailResponse>(
    `/roles/${id}`,
    data,
  );
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.delete(`/roles/${id}`);
}

export { createRole, deleteRole, getRoleList, updateRole };

/**
 * 获取角色详情
 * @param id 角色 ID
 */
async function getRoleDetail(id: string) {
  const item = await requestClient.get<any>(`/roles/${id}`);
  const resp: SystemRoleApi.RoleDetailResponse = {
    id: String(item?.id ?? ''),
    name: item?.name ?? item?.roleName ?? '',
    description: item?.description ?? '',
    permissionScope: Number(item?.permissionScope ?? 0),
    sort: Number(item?.sort ?? 0),
    permissions: Array.isArray(item?.permissions) ? item.permissions : [],
    enabled: Boolean(item?.enabled ?? item?.status === 1),
  };
  return resp;
}

/**
 * 更新角色状态（启用/停用）
 * @param id 角色 ID
 * @param enabled 状态值 true-启用 false-停用
 */
async function updateRoleEnabled(id: string, enabled: boolean) {
  return requestClient.put(`/roles/${id}/enabled`, { enabled });
}

export { getRoleDetail, updateRoleEnabled };
