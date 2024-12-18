import i18n from '@/i18n'
import StoresService from '@/services/stores-service'
import { defineStore } from 'pinia'

const { t } = i18n.global

export const useStoresStore = defineStore('stores-store', {
  state: () => ({
    stores: [
      {
        code: 'salla',
        title: t('salla'),
        status: 'Inactive',
      },
      {
        code: 'zid',
        title: t('zid'),
        status: 'Inactive',
      },
      {
        code: 'Khuzama',
        title: t('Khuzama'),
        status: 'Inactive',
      },
    ],
    chosenStoreFromAddStoreForm: null,
  }),
  actions: {
    async checkAuth (type) {
      const { data } = await StoresService.checkAuthentication(type)

      this.stores.find(item => item.code === type).status = data.code
    },
    async checkAuthAll () {
      await Promise.all(this.stores.map(item => this.checkAuth(item.code)))
    },
    getStatus (type) {
      return this.stores.find(item => item.code === type)?.status
    },
  },
})
