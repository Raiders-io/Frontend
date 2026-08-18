import { defineConfig } from 'i18next-cli'

export default defineConfig({
  locales: [
    "en",
    "fr"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  },
  locize: {
    projectId: '3f48acab-3b26-4486-bac3-78a0758b8abd',
    // For security, apiKey is best set via an environment variable
    apiKey: process.env.LOCIZE_API_KEY,
    version: 'latest',
  },
})
