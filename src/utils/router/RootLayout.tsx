import { FooterComponent } from "@/components/FooterComponent"
import TopNavBar from "@/components/TopNavBar"
import { Outlet, useLocation } from "react-router-dom"
import { Toaster } from "sonner"
import { PATHS } from "@/utils/router/paths"

export default function RootLayout() {
  const { pathname } = useLocation()
  const hideFooter = pathname === PATHS.chat

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopNavBar />
      <Toaster
        visibleToasts={5}
        position="bottom-right"
        expand={false}
        closeButton={true}
      />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
      {!hideFooter && <FooterComponent />}
    </div>
  )
}
