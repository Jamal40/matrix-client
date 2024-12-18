import AuthService from '@/services/auth-service'
import { defineStore } from 'pinia'
import { useSnackbarStore } from './useSnackBarStore'
import i18n from '@/i18n'

const { t } = i18n.global

export const useAuthStore = defineStore('auth-store', () => {
  const router = useRouter()
  const route = useRoute()

  const user = ref(null)
  const otp = ref(null)

  const getToken = () => {
    try {
      return localStorage.getItem('accessToken')
        ? JSON.parse(localStorage.getItem('accessToken'))
        : null
    } catch (e) {
      return null
    }
  }

  const token = ref(getToken())
  const loading = ref(false)

  async function register (payload) {
    await executeWithLoading(async () => {
      const res = await AuthService.register(payload)
      const { data } = res.data

      handleAuthResponse(res)

      const { show } = useSnackbarStore()
      show(t('auth.code_verification.code_sent_message'), 'success')

      otp.value = {
        countDown: data,
        mobileNumber: payload.mobile_number,
      }
    })

    const interval = setInterval(() => {
      otp.value.countDown--
      if (otp.value.countDown === 0) {
        clearInterval(interval)
      }
    }, 1000)
  }
  async function login (payload) {
    await executeWithLoading(async () => {
      const res = await AuthService.login(payload)
      const { data } = res.data

      handleAuthResponse(res)

      const { show } = useSnackbarStore()
      show(t('auth.code_verification.code_sent_message'), 'success')

      otp.value = {
        countDown: data,
        mobileNumber: payload.mobile_number,
      }

      const interval = setInterval(() => {
        otp.value.countDown--
        if (otp.value.countDown === 0) {
          clearInterval(interval)
        }
      }, 1000)

      // router.push({ name: 'auth-mobile-otp' })
    })
  }

  async function verify (payload) {
    await executeWithLoading(async () => {
      const res = await AuthService.verifyMobile(payload)

      handleAuthResponse(res)

      updateUserAndToken(res.data.data)

      window.location.href = '/'
    })
  }

  function logout () {
    clearUserData()
    window.location.href = '/auth/'
  }

  async function fetchUser (refresh = false) {
    if (user.value && !refresh) return user.value

    const res = await AuthService.me()
    if (!res) return

    handleAuthResponse(res)

    updateUserAndToken({ user: res.data.data })

    const needsToLinkAccounts = ({
      has_linked_ad_account: hasLinkedAccount,
      has_linked_website: hasLinkedWebsite,
    }) => !hasLinkedAccount || !hasLinkedWebsite

    if (
      needsToLinkAccounts(user.value) &&
      !route.name.includes('link-ad-accounts')
    ) {
      router.push({ name: '/link-ad-accounts' })
    }

    return user.value
  }

  async function executeWithLoading (callback) {
    loading.value = true
    try {
      await callback()
    } catch (error) {
      console.error(error)

      const { show } = useSnackbarStore()
      show(error.message, 'error')
    } finally {
      loading.value = false
    }
  }

  function handleAuthResponse (res) {
    const { error, messages } = res.data
    if (error) {
      throw new Error(messages[0])
    }
  }

  function updateUserAndToken (data) {
    const { token: accessToken, user: currentUser } = data

    if (accessToken) {
      token.value = accessToken
      localStorage.setItem('accessToken', JSON.stringify(accessToken))
    }
    user.value = currentUser
  }

  function clearUserData () {
    token.value = null
    user.value = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userAbilities')
  }

  return {
    user,
    token,
    loading,
    otp,
    login,
    register,
    verify,
    fetchUser,
    logout,
  }
})
