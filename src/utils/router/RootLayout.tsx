import TopNavBar from "@/components/TopNavBar"
import { Outlet } from "react-router-dom"

export default function RootLayout() {
  return (
    <div>
      <TopNavBar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  )
}
