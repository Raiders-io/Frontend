import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/utils/stores/auth_store"
import { PATHS } from "@/utils/router/paths"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { token } = useAuthStore()

  if (!token) return <Navigate to={PATHS.login} replace />

  return children
}
