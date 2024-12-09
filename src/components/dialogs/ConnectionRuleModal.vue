<script setup>
  import { requiredValidator } from '@/utilities/validators'
  import { useI18n } from 'vue-i18n'
  import { useRequest } from 'vue-request'
  import { useSnackbarStore } from '@/stores/useSnackBarStore'
  import AppChipSelect from '../core/AppChipSelect.vue'
  import connectionRuleIcon from '@/assets/doc.svg'
  import AppSelect from '../core/AppSelect.vue'
  import AppCheckBox from '../core/AppCheckBox.vue'
  import { useRulesModalsStore } from '@/stores/rulesModalsStore'

  import whatsApp from '@/assets/whats.svg'
  import sms from '@/assets/email.svg'
  import thread from '@/assets/thread.svg'
  import ConnectionRuleService from '@/services/connection-rule-service'
  import AppTextInput from '../core/AppTextInput.vue'

  const props = defineProps({
    rule: {
      type: Object,
      required: false,
    },
  })

  const emit = defineEmits(['saved', 'update:isDialogVisible'])

  const form = ref({
    name: null,
    indicator: null,
    comparison_type: null,
    channels: {},
    target_value: null,
    days_ago: null,
  })

  const indicators = ref(['CTR', 'CVC', 'CPM',
                          'CPMR',
                          'Freq',
                          'CPC',
                          'ROAS',
                          'CVR',
                          'CPA',
                          'AOV',
                          'Clicks',
                          'Impression'])

  const { t } = useI18n()
  const { show } = useSnackbarStore()
  const rulesModalsStore = useRulesModalsStore()

  const handleClose = () => {
    emit('update:isDialogVisible', false)
  }

  const submit = () => {
    const { channels } = form.value

    const truthyKeys = Object.entries(channels)
      .filter(([key, value]) => value)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))

    if (!props.rule) {
      create({ ...form.value, channels: truthyKeys })
    } else {
      runUpdate({
        id: props.rule.id,
        name: form.value.name,
        indicator: form.value.indicator,
        comparison_type: form.value.comparison_type,
        target_value: form.value.target_value,
        channels: truthyKeys,
        days_ago: form.value.days_ago,
      })
    }
  }

  const { run: create, loading: startLoading } = useRequest(
    data => ConnectionRuleService.run(data),
    {
      manual: true,
      onSuccess: res => {
        const { error, data, messages, code } = res.data

        if (error) {
          show(messages[0], 'error')
        }

        emit('saved', true)
        rulesModalsStore.modalSaved()
        show(t('the_connection_rule_has_been_created'), 'success')
        emit('update:isDialogVisible', false)
      },
    }
  )

  const { run: runUpdate, loading: loadingRunUpdate } = useRequest(
    data => ConnectionRuleService.update(data),
    {
      manual: true,
      onSuccess: response => {
        const { error, messages } = response.data
        if (error) {
          show(messages[0], 'error')
          return
        }
        emit('saved', true)
        rulesModalsStore.modalSaved()
        show(t('the_connection_rule_has_been_updated'), 'success')
        emit('update:isDialogVisible', false)
      },
    }
  )
  const isFormValid = computed(() => {
    return (
      !!form.value.name &&
      !!form.value.indicator &&
      !!form.value.comparison_type &&
      Object.values(form.value.channels).some(Boolean) &&
      !!form.value.target_value &&
      !!form.value.days_ago && !!form.value.indicator
    )
  })

  watch(
    () => props.rule,
    newRule => {
      if (newRule) {
        const predefinedKeys = ['whatsApp', 'sms', 'email']
        const channelsMap = predefinedKeys.reduce((acc, key) => {
          // Check if the key (case-insensitive) exists in the input array
          const exists = props.rule.channels.some(item => item.toLowerCase() === key.toLowerCase())
          acc[key] = exists // Set to true if it exists, otherwise false
          return acc
        }, {})
        Object.assign(form.value, {
          ...newRule,
          channels: channelsMap,
        })
      }
    },
    { immediate: true }
  )
</script>
<template>
  <v-card class="connect-platform px-6 rounded-xl" min-width="40vw" rounded="lg">
    <v-card-title class="d-flex justify-space-between align-center px-0">
      <div class="text-h5 text-medium-emphasis text-tajawal">
        <div class="d-flex align-center ga-2">
          <v-img aspect-ratio="1/1" :src="connectionRuleIcon" width="30" />
          <p>
            <span class="dark-1 font-weight-bold">
              {{ t("connection_rule") }}
            </span>
          </p>
        </div>
      </div>
      <v-btn class="close-btn" icon="mdi-close" variant="text" @click="handleClose" />
    </v-card-title>

    <v-divider class="mb-4" />

    <div class="camp-rule-text pa-4">
      <p>
        {{ t("connection_rule_text") }}
      </p>
    </div>

    <v-container class="mt-4">
      <v-row>
        <v-col cols="12" sm="12">
          <AppTextInput v-model="form.name" :label="t('name')" :placeholder="t('name')" />
        </v-col>
        <v-col cols="12" sm="6">
          <AppChipSelect
            v-model="form.comparison_type"
            :items="[
              { id: 'BiggerThan', title: t('increased') },
              { id: 'LessThan', title: t('decreased') },
            ]"
            :label="t('in_case')"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <AppSelect
            v-model="form.indicator"
            :items="indicators"
            :label="t('select_the_indicator')"
            :placeholder="t('choose_indicator')"
          />
        </v-col>

        <v-col cols="12" sm="6">
          <AppTextInput v-model="form.target_value" :label="t('specify_the_value')" :placeholder="t('enter_value')" />
        </v-col>
        <v-col cols="12" sm="6">
          <AppTextInput
            v-model="form.days_ago"
            :append-text="t('day')"
            :label="t('during_another')"
            :placeholder="t('num_of_days')"
          />
        </v-col>

        <span>{{ t("send_a_notification_via") }}:</span>

        <div class="d-flex align-center justify-space-between w-100">
          <AppCheckBox v-model="form.channels.whatsApp" :label="t('whatsapp')" />
          <img class="whatsapp" :src="whatsApp">
        </div>

        <div class="d-flex align-center justify-space-between w-100">
          <AppCheckBox v-model="form.channels.sms" :label="t('sms')" />
          <img class="chatbot-img" :src="sms">
        </div>

        <div class="d-flex align-center justify-space-between w-100">
          <AppCheckBox v-model="form.channels.email" :label="t('email')" />
          <img class="chatbot-img" :src="thread">
        </div>
      </v-row>
    </v-container>

    <v-divider class="mt-2" />

    <v-card-actions class="my-2 d-flex justify-end">
      <v-btn class="text-none" rounded="xl" :text="t('cancel')" @click="handleClose" />

      <v-btn
        append-icon="mdi-check"
        class="text-none save-btn"
        color="success"
        :disabled="!isFormValid"
        :loading="startLoading || loadingRunUpdate"
        rounded="xl"
        :text="t('save')"
        variant="flat"
        :width="120"
        @click="submit"
      />
    </v-card-actions>
  </v-card>
</template>

<style lang="scss">
.v-col-sm-6 {
  padding: 0 8px;
}

.connect-platform {
  .dark-1 {
    color: rgb(var(--v-dark-1));
  }

  .close-btn {
    svg {
      color: rgb(var(--v-dark-1));
    }
  }

  .save-btn {
    justify-content: space-around;
  }

  .save-btn:disabled {
    opacity: 0.35 !important;
  }

  .camp-rule-text {
    background-color: rgb(var(--v-theme-background));
    border-radius: 12px;

    p {
      color: rgb(var(--v-dark-1));
    }
  }
}
</style>
