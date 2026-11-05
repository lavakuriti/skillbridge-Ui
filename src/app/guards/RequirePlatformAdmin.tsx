import { Link, Outlet } from 'react-router-dom'
import { usePlatformUser } from '../../features/platform-admin/hooks/use-platform-user'
import { PLATFORM_SUPER_ADMIN_ROLE } from '../../features/platform-admin/types/access'

export function RequirePlatformAdmin() {
    const { data: user, isLoading, isError } = usePlatformUser()

    if (isLoading) return <main className="route-loading" role="status">Checking platform access...</main>
    if (isError || !user?.roles.includes(PLATFORM_SUPER_ADMIN_ROLE)) {
        return (
            <main className="platform-access-denied">
                <div>
                    <span className="eyebrow">Platform administration</span>
                    <h1>Platform access required</h1>
                    <p>Your current account is not authorized to access platform administration.</p>
                    <Link className="button button-outline" to="/">Return to HR Administration</Link>
                </div>
            </main>
        )
    }

    return <Outlet />
}