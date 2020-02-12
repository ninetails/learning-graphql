import { readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import React from 'react'
import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import serve from 'koa-static'
import compress from 'koa-compress'
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
import fetch from 'cross-fetch'
import App from './App'

const serverUrl = 'http://localhost:4000'

const readFileProm = promisify(readFile)

const app = new Koa()

app.use(helmet())
app.use(cors())

app.use(compress({
  filter: (contentType: string) => /(text|javascript)/i.test(contentType),
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))

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
      uri: serverUrl,
      fetch,
      credentials: 'same-origin',
      headers: ctx.request.header
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

  client.writeData({ data: { emotionIds: ids } })

  const css: string = styles.map((file: string) => `<link rel="stylesheet" href="/${file}"/>`).join('')
  const js: string = scripts.filter((file: string) => /(main|vendor)/.test(file)).map((file: string) => `<script defer src="/${file}"></script>`).join('')

  const output = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>React SSR</title>
        ${css}
        <style data-emotion-css="${ids.join(' ')}">${inlineCss}</style>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>window.__SERVER_URL__ = "${serverUrl}"; window.__APOLLO_STATE__ = ${JSON.stringify(client.extract()).replace(/</g, '\\u003c')}</script>
        ${js}
      </body>
    </html>
  `

  ctx.body = minify(output, { collapseWhitespace: true })
})

app.use(router.routes())
app.listen(3000)
