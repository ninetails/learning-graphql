import React from 'react'
import { createRoot } from 'react-dom'
import invariant from 'tiny-invariant'
import App from './App/index'
import './index.css'

import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})
console.log(client)
const rootEl = document.getElementById('root')
invariant(rootEl, 'Root element was not found.')
const root = createRoot(rootEl, { hydrate: rootEl?.hasChildNodes() })
const render = root.render.bind(root)

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
