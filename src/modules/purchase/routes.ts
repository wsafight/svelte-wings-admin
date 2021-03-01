// Components
import Home from './pages/Home.svelte'
import Name from './pages/Name.svelte'
import Wild from './pages/Wild.svelte'
import NotFound from './pages/NotFound.svelte'

// Export the route definition object
export default {
  // Exact path
  '/': Home,

  // Using named parameters, with last being optional
  '/hello/:first/:last?': Name,

  // Wildcard parameter
  // Included twice to match both `/wild` (and nothing after) and `/wild/*` (with anything after)
  '/wild': Wild,
  '/wild/*': Wild,

  // Catch-all, must be last
  '*': NotFound,
}
