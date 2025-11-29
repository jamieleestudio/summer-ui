<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/system/role';

import { computed, ref } from 'vue';

import { useVbenDrawer, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
import { createRole, getRoleDetail, updateRole } from '#/api/system/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.RoleDetailResponse>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const permissions = ref<DataNode[]>([]);
const loadingPermissions = ref(false);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    // 确保数据符合API要求的格式
    const apiData:
      | SystemRoleApi.RoleCreateRequest
      | SystemRoleApi.RoleUpdateRequest = {
      name: values.name,
      description: values.description || '',
      permissionScope: values.permissionScope || 0,
      sort: values.sort || 0,
      permissions: values.permissions || [],
      enabled: values.enabled === true,
    };

    drawerApi.lock();
    (id.value ? updateRole(id.value, apiData) : createRole(apiData))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemRoleApi.SystemRole>();
      formApi.resetForm();
      if (data) {
        // 直接从drawerApi获取的数据类型可能不完整，先使用getRoleDetail获取完整数据
        id.value = typeof data === 'string' ? data : data.id;
        // 编辑模式下，调用角色详情接口获取权限信息
        drawerApi.lock();
        Promise.all([
          getRoleDetail(typeof data === 'string' ? data : data.id),
          permissions.value.length === 0
            ? loadPermissions()
            : Promise.resolve(),
        ])
          .then(([roleDetail]) => {
            formData.value = roleDetail;
            // 将角色详情数据设置到表单中
            const formValues = {
              name: roleDetail.name,
              description: roleDetail.description,
              permissionScope: roleDetail.permissionScope,
              sort: roleDetail.sort,
              permissions: roleDetail.permissions || [],
              enabled: roleDetail.enabled,
            };
            formApi.setValues(formValues);
          })
          .finally(() => {
            drawerApi.unlock();
          });
      } else {
        id.value = undefined;
        if (permissions.value.length === 0) {
          loadPermissions();
        }
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    const list = Array.isArray(res) ? res : [];
    const nodes = list.map((item: Recordable<any>) => ({
      ...item,
      id: String(item.id ?? ''),
      pid: String(item.pid ?? ''),
      children: [],
    }));
    const byId = new Map<string, Recordable<any>>();
    for (const n of nodes) byId.set(n.id, n);
    const roots: Recordable<any>[] = [];
    for (const n of nodes) {
      const pid = n.pid;
      if (pid && byId.has(pid)) {
        byId.get(pid)!.children.push(n);
      } else {
        roots.push(n);
      }
    }
    permissions.value = roots as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.role.name'))
    : $t('common.create', $t('system.role.name'));
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
    if (node.index % 3 >= 1) {
      classes.push('!pl-0');
    }
  }

  return classes.join(' ');
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #permissions="slotProps">
        <Spin :spinning="loadingPermissions" wrapper-class-name="w-full">
          <VbenTree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </VbenTree>
        </Spin>
      </template>
    </Form>
  </Drawer>
</template>
<style lang="css" scoped>
:deep(.ant-tree-title) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
}
</style>
