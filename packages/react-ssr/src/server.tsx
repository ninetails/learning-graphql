import { readFile } from "fs"
import { join } from "path";
import { promisify } from 'util'
import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import Router from 'koa-router'
import serve from 'koa-static'
// @ts-ignore
import { minify } from 'html-minifier-terser'

const readFileProm = promisify(readFile)

const app = new Koa()

app.use(helmet())
app.use(cors())
app.use(serve('public'))
app.use(serve(join('build', 'public')))

const router = new Router()
router.get('*', async ctx => {
  const statsBuffer = await readFileProm(join('build', 'public', 'stats.json'))
  const { main, css } = JSON.parse(statsBuffer.toString('utf-8'))

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title>React SSR</title>
        <link rel="stylesheet" href="https://unpkg.com/tachyons@4.2.1/css/tachyons.min.css"/>
        ${css ? `<link rel="stylesheet" href="${css}" />` : ''}
      </head>
      <body>
        <div id="root"></div>
        <script type="text/javascript" src="${main}"></script>
      </body>
    </html>
  `

  ctx.body = minify(html, { collapseWhitespace: true })
})

app.use(router.routes())
app.listen(3000)
