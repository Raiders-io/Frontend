import { defineConfig } from 'i18next-cli'

export default defineConfig({
  locales: [
    "en",
    "fr",
    "de",
    "es"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  },
  locize: {
    projectId: '44486ecb-6e44-42fe-bc50-461068ed96a8',
    // For security, apiKey is best set via an environment variable
    apiKey: process.env.LOCIZE_API_KEY,
    version: 'latest',
  },
})
