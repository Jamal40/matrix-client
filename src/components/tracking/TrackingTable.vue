<script setup>
  import { usePagination, useRequest } from 'vue-request'
  import CampaignsService from '@/services/campaigns-service'
  import { useSnackbarStore } from '@/stores/useSnackBarStore'
  import { useI18n } from 'vue-i18n'
  import { ref } from 'vue'
  import { paginationMeta } from '@/composable/utils'
  import snapchat from '@/assets/images/logos/reports/snap.svg'
  import tiktok from '@/assets/images/logos/reports/tiktok.svg'
  import facebook from '@/assets/images/logos/reports/meta.svg'
  import instagram from '@/assets/images/logos/reports/instagram.svg'
  import googleads from '@/assets/images/logos/reports/google.svg'
  import youtube from '@/assets/images/logos/reports/youtube.svg'
  import twitter from '@/assets/images/logos/reports/x.svg'
  import trakingIcon from '@/assets/trackingTableIcon.svg'
  import { VDateInput } from 'vuetify/labs/VDateInput'

  const dateRange = ref(null)

  const getPlatformIcon = platformName => {
    const icons = {
      snapchat,
      tiktok,
      facebook,
      instagram,
      googleads,
      youtube,
      twitter,
    }
    return (
      icons[platformName] ||
      'https://cdn-icons-png.flaticon.com/512/6415/6415824.png'
    )
  }

  const emits = defineEmits(['selectionUpdated'])

  const { show } = useSnackbarStore()
  const { t } = useI18n()
  const router = useRouter()

  const totalCampaigns = ref(0)
  const campaigns = ref([])
  const totalPage = ref()

  const selectedItems = ref([])

  const options = ref({
    page: 1,
    itemsPerPage: 10,
    sortBy: [],
    groupBy: [],
  })

  const headers = [
    {
      title: t('name'),
      key: 'name',
    },
    {
      title: t('platform'),
      key: 'platform',
    },
    {
      title: t('status'),
      key: 'status',
    },
    {
      title: t('spending'),
      key: 'spending',
    },
    {
      title: t('reach'),
      key: 'reach',
    },
    {
      title: t('views'),
      key: 'views',
    },
    {
      title: t('frequency'),
      key: 'frequency',
    },
    {
      title: t('ctr'),
      key: 'ctr',
    },
    {
      title: t('orders_count'),
      key: 'sales',
    },
    {
      title: t('total_sales'),
      key: 'total_sales',
    },
    {
      title: t('customers_count'),
      key: 'customers_count',
    },
    {
      title: '',
      key: 'actions',
      sortable: false,
    },
  ]

  const statuses = ['Paused', 'Created', 'Started', 'Active']

  const { run, loading: loadingFetchingData } = usePagination(
    () =>
      CampaignsService.get({
        PageSize: options.value.itemsPerPage,
        Page: options.value.page,
        StartDate: dateRange.value?.[0],
        EndDate: dateRange.value?.[dateRange.value.length - 1],
        isExternal: true,
      }),
    {
      manual: true,
      onSuccess: res => {
        const { data } = res.data

        campaigns.value = data.items
        options.value.page = data.current_page
        totalPage.value = data.page_size
        totalCampaigns.value = data.total_count
      },
    }
  )

  const { run: runStartCampaign, loading: loadingStart } = useRequest(
    data => CampaignsService.startCampaign(data),
    {
      manual: true,
      onSuccess: res => {
        const { error, messages } = res.data

        run()

        if (error) {
          show(messages[0], 'error')
        } else {
          show(t('updated_message'), 'success')
        }
      },
    }
  )

  const { run: runPauseCampaign, loading: loadingPause } = useRequest(
    data => CampaignsService.pauseCampaign(data),
    {
      manual: true,
      onSuccess: res => {
        const { error, messages } = res.data

        run()

        if (error) {
          show(messages[0], 'error')
        } else {
          show(t('updated_message'), 'success')
        }
      },
    }
  )

  const { run: runDeleteCampaign, loading: loadingDelete } = useRequest(
    params => CampaignsService.deleteCampaign(params),
    {
      manual: true,
      onSuccess: res => {
        const { error, messages } = res.data

        if (error) {
          show(messages[0], 'error')
        } else {
          show(t('deleted_message'), 'success')
          run()
        }
      },
    }
  )

  watch(options, run, { deep: true })
  watch(dateRange, run)

  const resolveUserStatusVariant = stat => {
    const statLowerCase = stat.toLowerCase()

    switch (statLowerCase) {
      case 'paused':
        return 'warning'
      case 'active':
        return 'success'
      case 'archived':
        return 'secondary'
      default:
        return 'primary'
    }
  }

  const isActivateConfirmDialogVisible = ref(false)
  const isPauseConfirmDialogVisible = ref(false)
  const isDeleteConfirmDialogVisible = ref(false)

  const getPlayButtonIcon = status => {
    return status === 'Paused' ? 'tabler-player-play' : 'tabler-player-pause'
  }

  const getStatusAction = status => {
    return status === 'Paused' ? 'activate' : 'pause'
  }

  const toggleDialog = (type, id, platform) => {
    selectedItemId.value = id
    selectedPlatform.value = platform

    switch (type) {
      case 'delete':
        isDeleteConfirmDialogVisible.value = !isDeleteConfirmDialogVisible.value
        break
      case 'activate':
        isActivateConfirmDialogVisible.value =
          !isActivateConfirmDialogVisible.value
        break
      case 'pause':
        isPauseConfirmDialogVisible.value = !isPauseConfirmDialogVisible.value
        break
    }
  }

  const editCampaign = id => {
    router.push({ name: '/campaigns/edit/[id]', params: { id } })
  }

  const selectedItemId = ref(null)
  const selectedPlatform = ref(null)

  const deleteConfirmed = confirmed => {
    if (!confirmed) return

    runDeleteCampaign({
      id: selectedItemId.value,
      platform: selectedPlatform.value,
    })
  }

  const activateConfirmed = confirmed => {
    if (!confirmed) return

    runStartCampaign({ id: selectedItemId, platform: selectedPlatform })
  }

  const pauseConfirmed = confirmed => {
    if (!confirmed) return

    runPauseCampaign({ id: selectedItemId, platform: selectedPlatform })
  }

  const getStatus = status => {
    const loweredStatus = status.toLowerCase()

    return t(`campaign_status_${loweredStatus}`)
  }

  const loading = computed(() => {
    return (
      loadingFetchingData.value ||
      loadingStart.value ||
      loadingPause.value ||
      loadingDelete.value
    )
  })

  watch(selectedItems, newValue => {
    emits(
      'selectionUpdated',
      campaigns.value.filter(c => newValue.includes(c.id))
    )
  })
</script>
<template>
  <VCard>
    <div class="d-flex align-center justify-space-between ga-4 pa-4 mb-4">
      <VCardTitle class="font-weight-medium text-surface-variant pa-0 d-flex ga-1 align-center">
        <img alt="tracking icon" :src="trakingIcon">
        <span>{{ $t("links_table") }}
        </span>
      </VCardTitle>
      <div class="filter-container">
        <VDateInput
          v-model="dateRange"
          cancel-text="cancel"
          class="date-range-input"
          clearable
          density="comfortable"
          flat
          hide-details
          :label="t('select_range_date')"
          multiple="range"
          ok-text="ok"
          persistent-clear
          :prepend-icon="null"
          prepend-inner-icon="tabler-calendar"
          variant="solo-filled"
          @click:clear="dateRange = null"
        />
      </div>
    </div>
    <VDivider />

    <VDataTableServer
      v-model="selectedItems"
      v-model:items-per-page="options.itemsPerPage"
      v-model:page="options.page"
      class="text-no-wrap"
      :headers="headers"
      :items="campaigns"
      :items-length="totalCampaigns"
      :loading="loading"
      :no-data-text="'no_data_text'"
      select-strategy="all"
      show-select
      @update:options="options = $event"
    >
      <!-- Platform -->
      <template #item.platform="{ item }">
        <v-avatar class="mx-4">
          <v-img :src="getPlatformIcon(`${item.platform}`.toLowerCase())" />
        </v-avatar>
      </template>

      <!-- Status -->
      <template #item.status="{ item }">
        <VChip
          class="text-capitalize"
          :color="resolveUserStatusVariant(item.status)"
          label
          size="small"
        >
          {{ getStatus(item.status) }}
        </VChip>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <VTooltip :text="t('delete')">
          <template #activator="{ props: toolTipProps }">
            <VBtn
              v-bind="toolTipProps"
              @click="toggleDialog('delete', item.id, item.platform)"
            >
              <VIcon color="error" icon="tabler-trash" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip :text="t('edit')">
          <template #activator="{ props: toolTipProps }">
            <VBtn
              v-bind="toolTipProps"
              :disabled="item.is_external===true"
              @click="editCampaign(item.id, item.platform)"
            >
              <VIcon icon="tabler-edit" />
            </VBtn>
          </template>
        </VTooltip>
        <VTooltip
          v-if="statuses.includes(item.status)"
          :text="
            item.status === 'Paused' ? t('start_campaign') : t('pause_campaign')
          "
        >
          <template #activator="{ props: toolTipProps }">
            <VBtn
              v-if="statuses.includes(item.status)"
              v-bind="toolTipProps"
              @click="
                toggleDialog(getStatusAction(item.status), item.id, item.platform)
              "
            >
              <VIcon :icon="getPlayButtonIcon(item.status)" />
            </VBtn>
          </template>
        </VTooltip>
      </template>

      <!-- pagination -->
      <template #bottom>
        <VDivider />
        <div
          class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3"
        >
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta(options, totalCampaigns) }}
          </p>

          <VPagination
            v-model="options.page"
            :length="Math.ceil(totalCampaigns / options.itemsPerPage)"
            total-visible="3"
          />
        </div>
      </template>
    </VDataTableServer>
  </VCard>
  <!-- 👉 Delete Confirm Dialog -->
  <ConfirmDialog
    v-model:is-dialog-visible="isDeleteConfirmDialogVisible"
    :confirmation-question="t('dialog_question')"
    @confirm="deleteConfirmed"
  />

  <!-- 👉 Activate Confirm Dialog -->
  <ConfirmDialog
    v-model:is-dialog-visible="isActivateConfirmDialogVisible"
    :confirmation-question="t('dialog_question')"
    @confirm="activateConfirmed"
  />

  <!-- 👉 Deactivate Confirm Dialog -->
  <ConfirmDialog
    v-model:is-dialog-visible="isPauseConfirmDialogVisible"
    :confirmation-question="t('dialog_question')"
    @confirm="pauseConfirmed"
  />
</template>

<style lang="scss" scoped>
.filter-container {
width: 270px;
height: 40px;
}

:deep(.v-field.v-field--appended){
background-color: #F8F7FA;
border-radius: 12px;
}
</style>
