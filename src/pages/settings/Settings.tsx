import {
  FileText,
  LogOut,
  Palette,
  RotateCcw,
  ShieldCheck,
  TriangleAlert,
  UserRound,
  type LucideIcon,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { EditProfileDialog } from "@/pages/user/EditProfileDialog"
import {
  SettingRow,
  SettingsSection,
} from "@/components/settings/SettingsSection"
import { ThemeSelector } from "@/components/settings/ThemeSelector"
import { DeleteAccountDialog } from "@/components/settings/DeleteAccountDialog"
import { authService } from "@/services/auth_service"
import { useMe } from "@/services/user/user_queries"
import { changePageFileList, changePageLogin } from "@/utils/router/changePage"
import { PATHS } from "@/utils/router/paths"
import { useActionSettingsStore } from "@/utils/stores/action_settings_store"
import { useAuthStore } from "@/utils/stores/auth_store"
import { ChangeEmailDialog } from "@/components/settings/ChangeEmailDialog"
import { ChangePasswordDialog } from "@/components/settings/ChangePasswordDialog"

/* -------------------------------------------------------------------------- */
/*  Navigation (anchors to the sections below)                                */
/* -------------------------------------------------------------------------- */

const SECTIONS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "account", label: "Account", icon: UserRound },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "files", label: "Files", icon: FileText },
  { id: "privacy", label: "Privacy & legal", icon: ShieldCheck },
  { id: "danger", label: "Danger zone", icon: TriangleAlert },
]

const linkClass =
  "text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"

/* -------------------------------------------------------------------------- */
/*  Sections                                                                  */
/* -------------------------------------------------------------------------- */

function AccountSection() {
  const email = useAuthStore((s) => s.user?.email)
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()
  const { data: me, isPending } = useMe()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Error during logout:", error)
    }
    logout()
    queryClient.clear()
    changePageLogin()
  }

  return (
    <SettingsSection
      id="account"
      icon={UserRound}
      title="Account"
      description="Your sign-in details and public profile."
    >
      <SettingRow title="Email" description="Used to sign in.">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">{email ?? "—"}</span>
          <ChangeEmailDialog />
        </div>
      </SettingRow>

      <SettingRow
        title="Profile"
        description="Username, name, photo, banner and bio are edited from your profile."
      >
        <div className="flex items-center gap-3">
          {isPending ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <span className="text-sm text-muted-foreground">
              {me ? `@${me.username}` : "—"}
            </span>
          )}
          {me && <EditProfileDialog me={me} />}
        </div>
      </SettingRow>

      <SettingRow
        title="Password"
        description="Change the password you use to sign in."
      >
        <ChangePasswordDialog />
      </SettingRow>

      <SettingRow title="Session" description="Sign out on this device.">
        <Button variant="destructive" size="sm" onClick={handleLogout}>
          <LogOut />
          Log out
        </Button>
      </SettingRow>
    </SettingsSection>
  )
}

function AppearanceSection() {
  return (
    <SettingsSection
      id="appearance"
      icon={Palette}
      title="Appearance"
      description="Choose how Raiders.io looks on this device."
    >
      <div className="pb-4">
        <ThemeSelector />
      </div>

      {/* TODO: wire to an i18n solution (e.g. react-i18next) and persist the choice. */}
      <SettingRow
        title="Language"
        description="Language of the interface."
        htmlFor="setting-language"
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Coming soon</Badge>
          <Select value="en" disabled>
            <SelectTrigger id="setting-language" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="fr">Français</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SettingRow>
    </SettingsSection>
  )
}

function FilesSection() {
  const {
    showDownloadButton,
    showVisibilityButton,
    showDeleteButton,
    setShowDownloadButton,
    setShowVisibilityButton,
    setShowDeleteButton,
    resetToDefaults,
  } = useActionSettingsStore()

  const options = [
    {
      id: "setting-download",
      title: "Download button",
      description: "Download a file straight from the list.",
      checked: showDownloadButton,
      onChange: setShowDownloadButton,
    },
    {
      id: "setting-visibility",
      title: "Visibility button",
      description: "Switch a file between public and private.",
      checked: showVisibilityButton,
      onChange: setShowVisibilityButton,
    },
    {
      id: "setting-delete",
      title: "Delete button",
      description: "Delete a file straight from the list.",
      checked: showDeleteButton,
      onChange: setShowDeleteButton,
    },
  ]

  return (
    <SettingsSection
      id="files"
      icon={FileText}
      title="Files"
      description="Choose which action buttons appear in your file list."
    >
      {options.map((option) => (
        <SettingRow
          key={option.id}
          htmlFor={option.id}
          title={option.title}
          description={option.description}
        >
          <Checkbox
            id={option.id}
            checked={option.checked}
            onCheckedChange={(value) => option.onChange(value === true)}
          />
        </SettingRow>
      ))}

      <SettingRow title="Manage files">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={resetToDefaults}>
            <RotateCcw />
            Reset to defaults actions
          </Button>
          <Button variant="outline" size="sm" onClick={changePageFileList}>
            Open my files
          </Button>
        </div>
      </SettingRow>
    </SettingsSection>
  )
}

function PrivacySection() {
  const links = [
    { to: PATHS.privacy, label: "Privacy policy" },
    { to: PATHS.terms, label: "Terms of service" },
    { to: PATHS.cookies, label: "Cookies policy" },
    { to: PATHS.gdpr, label: "Your data & GDPR rights" },
  ]

  return (
    <SettingsSection
      id="privacy"
      icon={ShieldCheck}
      title="Privacy & legal"
      description="How your data is handled and what rights you have."
    >
      <ul className="space-y-3">
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </SettingsSection>
  )
}

function DangerSection() {
  return (
    <SettingsSection
      id="danger"
      icon={TriangleAlert}
      tone="danger"
      title="Danger zone"
      description="Irreversible actions."
    >
      <SettingRow
        title="Delete account"
        description="Permanently removes your account and its data."
      >
        <DeleteAccountDialog />
      </SettingRow>
    </SettingsSection>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function Settings() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:py-14">
      <header className="mb-8 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account, appearance and preferences.
        </p>
      </header>

      <div className="grid items-start gap-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="sticky top-6 hidden lg:block"
        >
          <ul className="flex flex-col gap-1">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-6">
          <AccountSection />
          <AppearanceSection />
          <FilesSection />
          <PrivacySection />
          <DangerSection />
        </div>
      </div>
    </div>
  )
}