import { requestClient } from '#/api/request';

export namespace SystemDeptApi {
  export interface SystemDept {
    [key: string]: any;
    children?: SystemDept[];
    id: string;
    name: string;
    remark?: string;
    status: 0 | 1;
    pid?: string;
    createTime?: string;
  }
}

/**
 * 获取部门列表数据
 */
async function getDeptList() {
  const data = await requestClient.get<any[]>('/departments');
  const list = Array.isArray(data) ? data : [];
  return list.map((item: any) => ({
    id: String(item.id ?? ''),
    pid: item.pid ?? item.parentId ?? null, // Return null if no parent
    name: item.name ?? item.deptName ?? '',
    status: item.status ?? 1,
    remark: item.remark ?? item.description ?? '',
    createTime: item.createTime ?? item.createdAt ?? '',
  }));
}

/**
 * 创建部门
 * @param data 部门数据
 */
async function createDept(
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.post('/departments', data);
}

/**
 * 更新部门
 *
 * @param id 部门 ID
 * @param data 部门数据
 */
async function updateDept(
  id: string,
  data: Omit<SystemDeptApi.SystemDept, 'children' | 'id'>,
) {
  return requestClient.put(`/departments/${id}`, data);
}

/**
 * 删除部门
 * @param id 部门 ID
 */
async function deleteDept(id: string) {
  return requestClient.delete(`/departments/${id}`);
}

export { createDept, deleteDept, getDeptList, updateDept };
