import React from 'react'
import { createRoot } from 'react-dom'
import invariant from 'tiny-invariant'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'unfetch'
import { hydrate } from 'emotion'
import App from './App/index'
import './index.css'

// @ts-ignore
hydrate(window.__EMOTION_IDS__ || []) // eslint-disable-line

const rootEl = document.getElementById('root')
invariant(rootEl, 'Root element was not found.')
const root = createRoot(rootEl, { hydrate: rootEl?.hasChildNodes() })
const render = root.render.bind(root)

const client = new ApolloClient({
  ssrMode: true,
  connectToDevTools: true,
  link: createHttpLink({
    uri: 'http://localhost:4000',
    credentials: 'same-origin',
    fetch
  }),
  ssrForceFetchDelay: 100,
  // @ts-ignore
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__ || {}) // eslint-disable-line
})

render(<App client={client} />)
