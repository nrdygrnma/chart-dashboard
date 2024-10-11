// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@pinia/nuxt'],
  googleFonts: {
    families: {
      Roboto: true,
      Raleway: {
        wght: [100, 300, 400, 700],
        ital: [100]
      }
    }
  }
})
