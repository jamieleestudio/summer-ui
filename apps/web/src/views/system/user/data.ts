import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemUserApi } from '#/api/system/user';

import { getDeptList } from '#/api/system/dept';
import { getPositionList } from '#/api/system/position';
import { getRoleList } from '#/api/system/role';
import { $t } from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'account',
      label: $t('system.user.username'), // Keep label "Username" or "Account"
      rules: 'required'
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      label: $t('system.user.password'),
    },
    {
      component: 'Input',
      fieldName: 'firstName',
      label: $t('system.user.firstName') || 'First Name', // Fallback if key missing
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'lastName',
      label: $t('system.user.lastName') || 'Last Name', // Fallback if key missing
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('system.user.email'),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        api: getDeptList,
        labelField: 'name',
        treeDataSimpleMode: { id: 'id', pId: 'pid', rootPId: null },
        valueField: 'id',
        class: 'w-full',
      },
      controlClass: 'w-full',
      fieldName: 'departmentId',
      label: $t('system.user.dept'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: getRoleList,
        labelField: 'name',
        mode: 'multiple',
        resultField: 'items',
        valueField: 'id',
        class: 'w-full',
      },
      controlClass: 'w-full',
      fieldName: 'roleIds',
      label: $t('system.user.role'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: getPositionList,
        labelField: 'name',
        mode: 'multiple',
        resultField: 'items',
        valueField: 'id',
        class: 'w-full',
      },
      controlClass: 'w-full',
      fieldName: 'positionIds',
      label: $t('system.position.name'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: $t('common.enabled'), value: true },
          { label: $t('common.disabled'), value: false },
        ],
        optionType: 'button',
      },
      defaultValue: true,
      fieldName: 'enable',
      label: $t('system.user.status'),
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'account',
      label: $t('system.user.username'),
    },
    {
      component: 'Input',
      fieldName: 'firstName',
      label: $t('system.user.realName'), // Use realName label for search by name
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('system.user.phone'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: $t('common.enabled'), value: true },
          { label: $t('common.disabled'), value: false },
        ],
      },
      fieldName: 'enabled',
      label: $t('system.user.status'),
    },
  ];
}

export function useColumns(
  onActionClick: OnActionClickFn<SystemUserApi.SystemUser>,
  onEnableChange?: (
    newEnable: boolean,
    row: SystemUserApi.SystemUser,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<SystemUserApi.SystemUser>['columns'] {
  return [
    { field: 'account', title: $t('system.user.username'), width: 180 },
    {
      field: 'firstName',
      formatter: ({ row }) => `${row.firstName || ''} ${row.lastName || ''}`,
      title: $t('system.user.realName'),
      width: 180,
    },
    { field: 'email', title: $t('system.user.email') },
    { field: 'phone', title: $t('system.user.phone'), width: 180 },
    {
      cellRender: {
        attrs: { beforeChange: onEnableChange },
        name: onEnableChange ? 'CellSwitch' : 'CellTag',
        options: [
          { color: 'success', label: $t('common.enabled'), value: true },
          { color: 'error', label: $t('common.disabled'), value: false },
        ],
        props: {
          checkedValue: true,
          unCheckedValue: false,
        },
      },
      field: 'enabled',
      title: $t('system.user.status'),
      width: 100,
    },
    { field: 'createTime', title: $t('system.user.createTime'), width: 180 },
    {
      align: 'right',
      cellRender: {
        attrs: { nameField: 'account', onClick: onActionClick },
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
