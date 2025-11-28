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
  const nodes = list.map((item: any) => ({
    id: String(item.id ?? ''),
    pid: String(item.pid ?? item.parentId ?? ''),
    name: item.name ?? item.deptName ?? '',
    status: item.status ?? 1,
    remark: item.remark ?? item.description ?? '',
    createTime: item.createTime ?? item.createdAt ?? '',
    children: [],
  }));
  const byId = new Map<string, SystemDeptApi.SystemDept>();
  for (const n of nodes) byId.set(n.id, n);
  const roots: SystemDeptApi.SystemDept[] = [];
  for (const n of nodes) {
    const pid = n.pid as string;
    if (pid && byId.has(pid)) {
      (byId.get(pid)!.children ||= []).push(n);
    } else {
      roots.push(n);
    }
  }
  return roots;
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
