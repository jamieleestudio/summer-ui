<script lang="ts" setup>
import type {
  VxeTableGridOptions,
} from '#/adapter/vxe-table';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { MenuBadge } from '@vben-core/menu-ui';

 

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMenuList } from '#/api/system/menu';

import { useColumns } from './data';
import Form from './modules/form.vue';

const [FormDrawer] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params) => {
          return await getMenuList();
        },
        querySuccess: ({ $grid }) => {
          const { fullData } = $grid.getTableData();
          const roots = fullData.filter((r: any) => !r.pid || r.pid === 0);
          $grid.setTreeExpand(roots, true);
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: true,
      zoom: true,
    },
    treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: true,
    },
  } as VxeTableGridOptions,
});


function onRefresh() {
  gridApi.query();
}
// 展示模式：移除创建/编辑/删除相关操作
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid>
      <template #toolbar-tools>
        <!--
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.menu.name')]) }}
        </Button>
        -->
      </template>
      <template #title="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              v-if="row.type === 'button'"
              icon="carbon:security"
              class="size-full"
            />
            <IconifyIcon
              v-else-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto">{{ $t(row.meta?.title) }}</span>
          <div class="items-center justify-end"></div>
        </div>
        <MenuBadge
          v-if="row.meta?.badgeType"
          class="menu-badge"
          :badge="row.meta.badge"
          :badge-type="row.meta.badgeType"
          :badge-variants="row.meta.badgeVariants"
        />
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
.menu-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
