import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemMenuApi {
  export const BadgeVariants = ['default', 'destructive', 'primary', 'success', 'warning'] as const;
  export const BadgeTypes = ['dot', 'normal'] as const;
  export const MenuTypes = ['catalog', 'menu', 'embedded', 'link', 'button'] as const;
  export interface SystemMenu {
    [key: string]: any;
    authCode: string;
    children?: SystemMenu[];
    component?: string;
    id: string;
    meta?: {
      activeIcon?: string;
      activePath?: string;
      affixTab?: boolean;
      affixTabOrder?: number;
      badge?: string;
      badgeType?: (typeof BadgeTypes)[number];
      badgeVariants?: (typeof BadgeVariants)[number];
      hideChildrenInMenu?: boolean;
      hideInBreadcrumb?: boolean;
      hideInMenu?: boolean;
      hideInTab?: boolean;
      icon?: string;
      iframeSrc?: string;
      keepAlive?: boolean;
      link?: string;
      maxNumOfOpenTab?: number;
      noBasicLayout?: boolean;
      openInNewWindow?: boolean;
      order?: number;
      query?: Recordable<any>;
      title?: string;
    };
    name: string;
    path: string;
    pid: string;
    redirect?: string;
    type: (typeof MenuTypes)[number];
  }
}

async function getMenuList() {
  return requestClient.get<Array<SystemMenuApi.SystemMenu>>('/permissions');
}

async function isMenuNameExists(
  name: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get<boolean>('/system/menu/name-exists', { params: { id, name } });
}

async function isMenuPathExists(
  path: string,
  id?: SystemMenuApi.SystemMenu['id'],
) {
  return requestClient.get<boolean>('/system/menu/path-exists', { params: { id, path } });
}

async function createMenu(
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.post('/system/menu', data);
}

async function updateMenu(
  id: string,
  data: Omit<SystemMenuApi.SystemMenu, 'children' | 'id'>,
) {
  return requestClient.put(`/system/menu/${id}`, data);
}

async function deleteMenu(id: string) {
  return requestClient.delete(`/system/menu/${id}`);
}

export {
  createMenu,
  deleteMenu,
  getMenuList,
  isMenuNameExists,
  isMenuPathExists,
  updateMenu,
};

