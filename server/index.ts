import { createApp } from './app.js'

const port = Number(process.env.PORT ?? 3001)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535')

const host = process.env.HOST ?? '127.0.0.1'
createApp().listen(port, host, () => console.log(`Catalog API listening at http://${host}:${port}`))
