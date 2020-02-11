import { readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import React from 'react'
import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import serve from 'koa-static'
import { renderToString } from 'react-dom/server'
import { CacheProvider } from '@emotion/core'
import createEmotionServer from 'create-emotion-server'
import createCache from '@emotion/cache'
// @ts-ignore
import { minify } from 'html-minifier-terser'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getDataFromTree } from '@apollo/react-ssr'
import fetch from 'node-fetch'
import App from './App'

const readFileProm = promisify(readFile)

const app = new Koa()

app.use(helmet())
app.use(cors())
app.use(serve('public'))
app.use(serve(join('build', 'public')))

interface ExtractedCritical {
  html: string
  css: string
  ids: string[]
}

const router = new Router()
router.get('*', async ctx => {
  const statsBuffer = await readFileProm(join('build', 'public', 'stats.json'))
  const { styles, scripts } = JSON.parse(statsBuffer.toString('utf-8'))

  const cache = createCache()
  const { extractCritical } = createEmotionServer(cache)

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'http://localhost:4000',
      fetch,
      credentials: 'same-origin',
      headers: {
        cookie: ctx.request.header.Cookie
      }
    }),
    cache: new InMemoryCache()
  })

  const tree = (
    <CacheProvider value={cache}>
      <App client={client} context={ctx} />
    </CacheProvider>
  )

  await getDataFromTree(tree)

  const { html, css: inlineCss, ids }: ExtractedCritical = extractCritical(renderToString(tree))

  const css: string = styles.map((file: string) => `<link rel="stylesheet" href="/${file}"/>`).join('')
  const js: string = scripts.filter((file: string) => /(main|vendor)/.test(file)).map((file: string) => `<script src="/${file}"></script>`).join('')

  const globalVars = [
    ['__APOLLO_STATE__', client.extract()],
    ['__EMOTION_IDS__', ids]
  ].map<string>(([key, val]) => `window.${key as string} = ${JSON.stringify(val)}`).join('; ')

  const output = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>React SSR</title>
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.2.1/css/tachyons.min.css"/>
        ${css}
        <style data-emotion-css="${ids.join(' ')}">${inlineCss}</style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>${globalVars}</script>
        ${js}
      </body>
    </html>
  `

  ctx.body = minify(output, { collapseWhitespace: true })
})

app.use(router.routes())
app.listen(3000)
