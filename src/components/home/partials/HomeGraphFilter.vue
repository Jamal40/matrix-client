<script setup>
  import i18n from '@/i18n'

  const props = defineProps({
    options: Array,
  })

  const emit = defineEmits(['selected'])

  const { t } = i18n.global

  const options = computed(() => {
    if (props.options) {
      return props.options
    } else {
      return [
        {
          id: 'sales',
          name: t('sales'),
        },
        {
          id: 'roas',
          name: t('roas'),
        },
        {
          id: 'spendings',
          name: t('expenses'),
        },
      ]
    }
  })

  const selected = ref(options.value[0].id)

  const setSelected = () => {
    emit('selected', selected.value)
  }

  setSelected()
</script>

<template>
  <VSelect
    v-model="selected"
    density="compact"
    :item-title="item => item.name"
    :item-value="item => item.id"
    :items="options"
    min-width="140px"
    variant="outlined"
    @update:model-value="setSelected"
  />
</template>
