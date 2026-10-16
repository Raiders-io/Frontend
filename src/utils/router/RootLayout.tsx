import TopNavBar from "@/components/TopNavBar"
import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"

export default function RootLayout() {
  return (
    <div>
      <TopNavBar />
      <Toaster visibleToasts={5} position="bottom-right" expand={false} closeButton={true} />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}
