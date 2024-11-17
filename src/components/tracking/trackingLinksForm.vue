<script setup>
  import trackIcon from '@/assets/trackingLink.svg'
  import AppTextInput from '@/components/core/AppTextInput.vue'
  import { requiredValidator } from '@/utilities/validators'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { usePlatformsStore } from '@/stores/usePlatformsStore'
  import { useRequest } from 'vue-request'
  import { useSnackbarStore } from '@/stores/useSnackBarStore'
  import TrackingService from '@/services/tracking-service'
  import { useBreadcrumbsStore } from '@/stores/useBreadcrumbsStore'

  const { update } = useBreadcrumbsStore()
  const { locale, t } = useI18n()
  const isArabic = computed(() => locale.value === 'ar')
  const { show } = useSnackbarStore()

  const form = ref({
    platform: null,
    campaign_id: null,
    ad_group_id: null,
    ad_id: null,
  })

  const link = ref(null)

  const rules = reactive({
    campaign_id: [requiredValidator],
    ad_group_id: [requiredValidator],
  })

  const platformsStore = usePlatformsStore()
  const platforms = ref([])

  const { loading: loadingPlatforms } = useRequest(
    platformsStore.getActivePlatforms,
    {
      onSuccess: res => {
        platforms.value = res
      },
    }
  )

  // create tracking link
  const { run: CreateTrackingLink, loading: loadingCreate } = useRequest(
    (platform, data) => TrackingService.createTrackingAd(platform, data),
    {
      manual: true,
      onSuccess: res => {
        const { error, messages } = res.data
        if (error) {
          show(messages[0], 'error')
        } else {
          link.value = res.data.data.target_url
          show(t('created_message'), 'success')
        }
      },
    }
  )

  const handleClick = () => {
    CreateTrackingLink(form.value.platform, form.value)
    form.value = {
      platform: null,
      campaign_id: null,
      ad_group_id: null,
      ad_id: null,
    }
  }

  const handleCopy = () => {
    const copyText = link.value
    navigator.clipboard.writeText(copyText).then(() => {
    }).catch(err => {
      console.error('Failed to copy text: ', err)
    })
  }

  const loading = computed(() => {
    return (
      loadingCreate.value
    )
  })

  watch(
    locale,
    () => {
      update([
        {
          title: t('tracking.name'),
          active: true,
          to: '/tracking',
        },
      ])
    },
    { immediate: true }
  )

</script>

<template>

  <v-card class="form_container">
    <div class="head_container">
      <img alt="track-link-icon" :src="trackIcon">
      <div>
        <p class="title">{{ t('tracking.create_tracking_link_title') }}</p>
        <p class="sub_title">{{ t('tracking.create_tracking_link_subtitle') }}</p>
      </div>
    </div>
    <hr>
    <v-form>
      <v-row>
        <v-col cols="12" md="3">
          <AppSelect
            v-model="form.platform"
            hide-no-data
            :item-title="(item) => item.title"
            :item-value="(item) => item.code"
            :items="platforms"
            :label="t('tracking.platform')"
            :loading="loadingPlatforms"
            :rules="[requiredValidator]"
          />
        </v-col>

        <v-col cols="12" md="3">
          <AppTextInput v-model="form.campaign_id" :label="$t('tracking.campaignId')" :placeholder="t('tracking.enter_name')" :rules="rules.campaign_id" />
        </v-col>

        <v-col cols="12" md="3">
          <AppTextInput v-model="form.ad_group_id" :label="t('tracking.ad_group_id')" :placeholder="t('tracking.enter_name')" :rules="rules.ad_group_id" />
        </v-col>
        <v-col cols="12" md="3">
          <AppTextInput v-model="form.ad_id" :label="t('tracking.ad_id')" :placeholder="t('tracking.enter_name')" :rules="rules.ad_group_id" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <AppTextInput
            v-model="link"
            bordered
            :disabled="link===null"
            :label="t('tracking.the_link')"
            :placeholder="t('tracking.link_appear')"
            :value="link"
          >
            <template #append-inner>
              <v-btn class="copy_button" prepend-icon="mdi-content-copy" @click="handleCopy">
                {{ t('tracking.copy') }}
              </v-btn>
            </template>
          </AppTextInput>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="auto">
          <v-btn color="warning" :disabled="loading" rounded @click="handleClick">
            {{ t('tracking.create') }}
            <VIcon class="mx-1" :icon="isArabic ? 'tabler-arrow-left':'tabler-arrow-right'" />
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<style lang='scss' scoped>
.form_container{
background-color: #FFFFFF;
padding: 16px;
margin-bottom: 24px;
.head_container{
display: flex;
align-items: center;
gap: 16px;
margin-bottom: 16px;

}
.title{
color: #000000;
font-size: 20px;
font-weight: 700;
line-height: 24px;
margin-bottom: 8px;
}
.sub_title{
color:#1F1625 ;
font-size: 14px;
line-height: 16.8px;
font-weight: 400;
}
hr {
  border: 1px solid #1F16251A;
  margin-bottom: 24px;
}
:deep(.v-label){
color: #1F1625;
font-size: 14px;
line-height: 16.8px;
font-weight: 400;
margin: 0 5px 0 5px;
}
:deep(.bg-background){
background-color: #F8F7FA;
}
:deep(.v-text-field .v-field--no-label input){
color: #706D79;
}
:deep(.v-select__selection-text){
color: #706D79;
}
.copy_button{
color: #FFFFFF;
background-color:rgb(var(--v-theme-primary));
border-radius: .75rem;
}
:deep( .v-input__control .v-field--focused){
outline: none;
border-color: #1F1625;
}
:deep( .v-field.v-field) {
  background-color: red;
  color: red;
  margin-top: 8px;
}
}
</style>
