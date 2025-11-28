<script lang="ts" setup>
import type { SystemPositionApi } from '#/api/system/position';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createPosition, updatePosition } from '#/api/system/position';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<SystemPositionApi.SystemPosition>();

const [Form, formApi] = useVbenForm({ schema: useFormSchema(), showDefaultActions: false });

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    (formData.value?.id ? updatePosition(formData.value.id, values) : createPosition(values))
      .then(() => {
        emit('success');
        drawerApi.close();
      })
      .catch(() => drawerApi.unlock());
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemPositionApi.SystemPosition>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        formApi.setValues(formData.value);
      } else {
        formData.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() =>
  formData.value?.id
    ? $t('ui.actionTitle.edit', [$t('system.position.name')])
    : $t('ui.actionTitle.create', [$t('system.position.name')]),
);
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form class="mx-4" />
  </Drawer>
</template>