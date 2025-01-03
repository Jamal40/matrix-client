<script setup>
  import { useI18n } from 'vue-i18n'
  // import i18n from "@/i18n"
  import { useBreadcrumbsStore } from '@/stores/useBreadcrumbsStore'
  import DashboardGraphsService from '@/services/dashboard-service'

  import { useRequest } from 'vue-request'
  import SharedChart from '@/components/home/SharedChart.vue'
  const { update } = useBreadcrumbsStore()
  const { t, locale } = useI18n()

  watch(
    locale,
    () => {
      update([
        {
          title: t('dashboard'),
          disabled: true,
          active: true,
          to: '/',
        },
      ])
    },
    { immediate: true }
  )

  const statistics = ref({})

  const { run, loading } = useRequest(() => DashboardGraphsService.get(), {
    manual: true,
    onSuccess: res => {
      const { data } = res.data

      statistics.value = data
    },
  })

  run()

  const currency = computed(() => {
    return t(statistics?.value.currency)
  })

  provide('currency', currency)
</script>

<template>
  <VRow>
    <v-overlay v-model="loading" class="align-center justify-center" persistent>
      <v-progress-circular color="primary" indeterminate size="50" :width="7" />
    </v-overlay>

    <template v-if="!loading">
      <VCol cols="12" lg="9">
        <HomeMainSlider class="h-100" :general-store-info="statistics.general_store_information" />
      </VCol>

      <VCol cols="12" lg="3">
        <HomePerformance class="h-100" :performance="statistics.general_performance" />
      </VCol>

      <VCol cols="12" lg="3" md="6">
        <HomeOrders class="h-100" :orders="statistics.weekly_orders" />
      </VCol>

      <VCol cols="12" lg="3" md="6">
        <HomeSpending class="h-100" :roas="statistics.weekly_spendings" />
      </VCol>

      <VCol cols="12" lg="3" md="6">
        <HomeSales class="h-100" :sales="statistics.weekly_sales" />
      </VCol>

      <VCol cols="12" lg="3" md="6">
        <HomeSpendingReturn class="h-100" :spendings="statistics.weekly_roas" />
      </VCol>

      <VCol cols="12">
        <HomeClients :customers-statistics="statistics.customers_statistics" />
      </VCol>

      <VCol cols="12">
        <HomePlatformsPerformance :performance="statistics.monthly_platofroms_performance" />
      </VCol>

      <VCol cols="12" lg="4">
        <HomeOS class="h-100" :operating-systems="statistics.operating_systems_statistics" />
      </VCol>

      <VCol cols="12" lg="4">
        <HomeSpendingReturnLine class="h-100" :roas="statistics.weekly_roas" />
      </VCol>

      <VCol cols="12" lg="4">
        <HomeAdsStatistics class="h-100" :stats="statistics.platforms_statistics" />
      </VCol>

      <VCol cols="12" lg="6">
        <HomeSalesGrowth class="h-100" :sales="statistics.weekly_sales_growth" />
      </VCol>

      <VCol cols="12" lg="6">
        <HomePlatformsContributions class="h-100" :contributions="statistics.monthly_platforms_contributions" />
      </VCol>

      <VCol cols="12" lg="6">
        <HomeMonthSales class="h-100" :sales="statistics.monthly_sales_details" />
      </VCol>

      <!--
      <VCol
      cols="12"
      lg="4"
      >
      <HomeEvents class="h-100" />
      </VCol>
    -->

      <VCol cols="12" lg="6">
        <HomeSalesByCity :cities="statistics.monthly_citites_statistics" class="h-100" />
      </VCol>

      <VCol cols="12">
        <HomePerformanceIndicator :performance="statistics.platforms_yearly_statistics" />
      </VCol>

      <VCol cols="12" md="6">
        <SharedChart
          :rate="statistics.ctr_statistics"
          sub-title="explore-last-90-days"
          title="click-rate"
          variant="warning"
        />
      </VCol>

      <VCol cols="12" md="6">
        <HomeClickCost :cost="statistics.cpc_statistics" />
      </VCol>
      <VCol cols="12" md="6">
        <HomeReach :reach="statistics.reach_statistics" />
      </VCol>
      <VCol cols="12" md="6">
        <HomeReachRate :frequency="statistics.frequency_statistics" />
      </VCol>
      <VCol cols="12" md="6">
        <HomeViews :impressions="statistics.impressions_statistics" />
      </VCol>
      <VCol cols="12" md="6">
        <HomeOrderRate :frequency="statistics.order_frequency" />
      </VCol>
    </template>
  </VRow>
</template>

<style>
.vue-apexcharts .apexcharts-canvas {
  direction: rtl !important;
}
</style>
