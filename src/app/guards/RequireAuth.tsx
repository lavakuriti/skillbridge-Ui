import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../features/auth/hooks/use-current-user'

export function RequireAuth() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return <main className="route-loading" role="status">Checking access...</main>
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet context={user} />
}
