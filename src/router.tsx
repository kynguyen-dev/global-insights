import {
  createRouter,
  createRoute,
  createRootRoute,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { DashboardLayout } from './components/DashboardLayout'
import { DashboardPage } from './pages/DashboardPage'
import { WeatherPage } from './pages/WeatherPage'
import { NewsPage } from './pages/NewsPage'
import { NewsDetailPage } from './pages/NewsDetailPage'
import { MarketsPage } from './pages/MarketsPage'
import { GoldItemDetailPage } from './pages/GoldItemDetailPage'
import { PetrolDetailPage } from './pages/PetrolDetailPage'
import { PetrolItemDetailPage } from './pages/PetrolItemDetailPage'


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

// Create news route
const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsPage,
})

// Create news detail route
const newsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news/$newsId',
  component: NewsDetailPage,
})

// Create markets route
const marketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/markets',
  component: MarketsPage,
})

// Redirect /markets/gold → /markets (Gold Board)
const goldDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/markets/gold',
  beforeLoad: () => {
    throw redirect({ to: '/markets' });
  },
  component: () => null,
})

// Create gold item detail route
const goldItemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/markets/gold/$goldId',
  component: GoldItemDetailPage,
})

// Create petrol route (standalone page)
const petrolRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/petrol',
  component: PetrolDetailPage,
})

// Create petrol item detail route
const petrolItemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/petrol/$petrolId',
  component: PetrolItemDetailPage,
})

// Keep legacy /markets/petrol route for backwards compatibility
const petrolDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/markets/petrol',
  component: PetrolDetailPage,
})



// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  weatherRoute,
  newsRoute,
  newsDetailRoute,
  marketsRoute,
  goldDetailRoute,
  goldItemDetailRoute,
  petrolRoute,
  petrolItemDetailRoute,
  petrolDetailRoute,

])

// Create the router
export const router = createRouter({ routeTree })

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
