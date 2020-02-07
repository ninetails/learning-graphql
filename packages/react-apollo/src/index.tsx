import React from 'react'
import { createRoot } from 'react-dom'
import invariant from 'tiny-invariant'
import './index.css'
import App from './components/App'
import * as serviceWorker from './serviceWorker'

const rootEl = document.getElementById('root') ?? null
invariant(rootEl !== null, 'Root element not found')
const root = createRoot(rootEl, { hydrate: rootEl.hasChildNodes() })
const render = root.render.bind(root)

render(<App />)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
