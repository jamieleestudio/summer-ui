import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemPositionApi } from '#/api/system/position';

import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    { component: 'Input', fieldName: 'name', label: $t('system.position.name'), rules: 'required' },
    { component: 'Input', fieldName: 'code', label: $t('system.position.code') },
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
      label: $t('system.position.status'),
    },
    { component: 'Textarea', fieldName: 'remark', label: $t('system.position.remark') },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    { component: 'Input', fieldName: 'name', label: $t('system.position.name') },
    { component: 'Input', fieldName: 'code', label: $t('system.position.code') },
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
      label: $t('system.position.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemPositionApi.SystemPosition>,
): VxeTableGridOptions<SystemPositionApi.SystemPosition>['columns'] {
  return [
    { field: 'name', title: $t('system.position.name'), width: 180 },
    { field: 'code', title: $t('system.position.code'), width: 160 },
    { cellRender: { name: 'CellTag' }, field: 'status', title: $t('system.position.status'), width: 100 },
    { field: 'remark', title: $t('system.position.remark'), width: 220 },
    { field: 'createTime', title: $t('system.position.createTime'), width: 180 },
    {
      align: 'right',
      cellRender: {
        attrs: { nameField: 'name', onClick: onActionClick },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.position.operation'),
      width: 200,
    },
  ];
}