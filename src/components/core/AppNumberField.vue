<script setup>
  import { VNumberInput } from 'vuetify/labs/VNumberInput'

  defineOptions({
    name: 'AppNumberField',
    inheritAttrs: false,
  })

  const elementId = computed(() => {
    const attrs = useAttrs()
    const _elementIdToken = attrs.id || attrs.label

    return _elementIdToken
      ? `app-number-field-${_elementIdToken}-${Math.random()
        .toString(36)
        .slice(2, 7)}`
      : undefined
  })

  const label = computed(() => useAttrs().label)
</script>

<template>
  <div class="app-number-field flex-grow-1" :class="$attrs.class">
    <VLabel
      v-if="label"
      class="mb-1 text-body-2 text-dark-1"
      :for="elementId"
      persistent-placeholder
      :text="label"
    />
    <VNumberInput
      v-bind="{
        ...$attrs,
        class: null,
        label: undefined,
        variant: 'solo-filled',
        id: elementId,
        'bg-color': 'secondary',
        flat: true,
      }"
    >
      <template v-for="(_, name) in $slots" #[name]="slotProps">
        <slot :name="name" v-bind="slotProps || {}" />
      </template>
    </VNumberInput>
  </div>
</template>
<style lang="scss">
.app-number-field {
  .v-field {
    border-radius: 0.75rem;
  }
}
</style>
