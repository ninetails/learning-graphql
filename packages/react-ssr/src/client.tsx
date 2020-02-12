import React from 'react'
import { createRoot } from 'react-dom'
import invariant from 'tiny-invariant'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import App from './App/index'
import 'cross-fetch/polyfill'

const rootEl = document.getElementById('root')
invariant(rootEl, 'Root element was not found.')
const root = createRoot(rootEl, { hydrate: rootEl?.hasChildNodes() })
const render = root.render.bind(root)

const apolloHydration = window.__APOLLO_STATE__ ?? {}

const client = new ApolloClient({
  ssrMode: true,
  connectToDevTools: true,
  link: createHttpLink({
    uri: window.__SERVER_URL__,
    credentials: 'same-origin'
  }),
  ssrForceFetchDelay: 100,
  cache: new InMemoryCache().restore(apolloHydration as NormalizedCacheObject)
})

render(<App client={client} />)
