// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/supabase',
    '@nuxt/icon',
  ],
  components:[{
    path: '~/components',
    extensions: ['.vue'],
    prefix: ''
  },
  {
    path: '~/components/ui',
    extensions: ['.vue'],
    prefix: ''
  },
  {
    path: '~/components/shared',
    extensions: ['.vue'],
    prefix: ''
  },],

    supabase: {
      redirectOptions: {
        login: '/auth',
        callback: '/confirm',
        include: undefined,
        exclude: ['/'],
        cookieRedirect: false,
      }
    
    },
    runtimeConfig:{
      openaiKey:''
    }

  
})