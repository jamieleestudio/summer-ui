<script lang="ts" setup>
import type { SystemUserApi } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createUser, updateUser } from '#/api/system/user';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SystemUserApi.SystemUser>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (formData.value?.id
      ? updateUser(formData.value.id, values)
      : createUser(values)
    )
      .then(() => {
        emit('success');
        drawerApi.close();
      })
      .catch(() => drawerApi.unlock());
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemUserApi.SystemUser>();
      formApi.resetForm();
      if (data && data.id) {
        const values = { ...data };
        // Ensure roleIds and positionIds are populated if the backend returns objects
        if (!values.roleIds && Array.isArray(values.roles)) {
          values.roleIds = values.roles.map((r: any) => r.id);
        }
        if (!values.positionIds && Array.isArray(values.positions)) {
          values.positionIds = values.positions.map((p: any) => p.id);
        }
        if (!values.departmentId && values.department) {
          values.departmentId = (values.department as any).id;
        }
        
        formData.value = values;
        formApi.setValues(formData.value);
        formApi.updateSchema([
          {
            fieldName: 'password',
            componentProps: {
              placeholder: $t('ui.form.rules.optional'),
            },
            rules: null, // Optional on update
          },
        ]);
      } else {
        formData.value = undefined;
        formApi.updateSchema([
          {
            fieldName: 'password',
            componentProps: {
              placeholder: $t('ui.form.rules.required'),
            },
            rules: 'required', // Required on create
          },
        ]);
      }
    }
  },
});

const getDrawerTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.user.name')])
    : $t('ui.actionTitle.create', [$t('system.user.name')]),
);
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form class="mx-4" />
  </Drawer>
</template>
