import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ActionSettingsState {
  showDownloadButton: boolean
  showVisibilityButton: boolean
  showDeleteButton: boolean
  setShowDownloadButton: (value: boolean) => void
  setShowVisibilityButton: (value: boolean) => void
  setShowDeleteButton: (value: boolean) => void
  setAllSettings: (settings: {
    showDownloadButton?: boolean
    showVisibilityButton?: boolean
    showDeleteButton?: boolean
  }) => void
  resetToDefaults: () => void
}

export const useActionSettingsStore = create<ActionSettingsState>()(
  persist(
    (set) => ({
      // Default values - all buttons visible by default
      showDownloadButton: true,
      showVisibilityButton: true,
      showDeleteButton: true,

      setShowDownloadButton: (value) =>
        set({ showDownloadButton: value }),

      setShowVisibilityButton: (value) =>
        set({ showVisibilityButton: value }),

      setShowDeleteButton: (value) =>
        set({ showDeleteButton: value }),

      setAllSettings: (settings) =>
        set({
          showDownloadButton: settings.showDownloadButton ?? true,
          showVisibilityButton: settings.showVisibilityButton ?? true,
          showDeleteButton: settings.showDeleteButton ?? true,
        }),

      resetToDefaults: () =>
        set({
          showDownloadButton: true,
          showVisibilityButton: true,
          showDeleteButton: true,
        }),
    }),
    {
      name: 'action-settings-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
