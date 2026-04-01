import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router'
import { DashboardLayout } from './components/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { WeatherPage } from './pages/WeatherPage'

// Create the root route
const rootRoute = createRootRoute({
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
})

// Create index route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: DashboardPage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

// Create weather route
const weatherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/weather',
  component: WeatherPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, dashboardRoute, weatherRoute])

// Create the router
export const router = createRouter({ routeTree })

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
