import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    { component: 'Input', fieldName: 'username', label: $t('system.user.username'), rules: 'required' },
    { component: 'Input', fieldName: 'realName', label: $t('system.user.realName') },
    { component: 'Input', fieldName: 'email', label: $t('system.user.email') },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.user.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    { component: 'Input', fieldName: 'username', label: $t('system.user.username') },
    { component: 'Input', fieldName: 'realName', label: $t('system.user.realName') },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.enabled'), value: 1 },
          { label: $t('common.disabled'), value: 0 },
        ],
      },
      fieldName: 'status',
      label: $t('system.user.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemUserApi.SystemUser>,
): VxeTableGridOptions<SystemUserApi.SystemUser>['columns'] {
  return [
    { field: 'username', title: $t('system.user.username'), width: 180 },
    { field: 'realName', title: $t('system.user.realName'), width: 180 },
    { field: 'email', title: $t('system.user.email'), width: 220 },
    { cellRender: { name: 'CellTag' }, field: 'status', title: $t('system.user.status'), width: 100 },
    { field: 'createTime', title: $t('system.user.createTime'), width: 180 },
    {
      align: 'right',
      cellRender: {
        attrs: { nameField: 'username', onClick: onActionClick },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.user.operation'),
      width: 200,
    },
  ];
}