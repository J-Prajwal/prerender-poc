import cors from 'cors'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 4000
const VALID_TOKEN = 'prerender-poc-token'

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'prerender-poc-be' })
})

app.get('/api/public/news', (_req, res) => {
  res.json({
    source: 'public-api',
    message: 'Public API works without token.',
    generatedAt: new Date().toISOString(),
    items: [
      'Public item 1',
      'Public item 2',
      'Public item 3',
    ],
  })
})

app.get('/api/protected/profile', (req, res) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')

  if (token !== VALID_TOKEN) {
    return res.status(401).json({
      source: 'protected-api',
      error: 'Unauthorized. Use token: prerender-poc-token',
    })
  }

  return res.json({
    source: 'protected-api',
    message: 'Protected API authorized.',
    user: {
      id: 'poc-user-1',
      name: 'Prerender Tester',
      role: 'qa',
    },
    generatedAt: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`BE running on http://localhost:${PORT}`)
})
