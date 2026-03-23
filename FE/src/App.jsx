import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

function StaticPage() {
  return (
    <section className="card">
      <h2>Static Page (No API)</h2>
      <p>
        This route is fully static and can be used to validate a pure prerendered
        page.
      </p>
    </section>
  )
}

function PublicApiPage() {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/news`)
        if (!response.ok) throw new Error('Public API failed')
        const data = await response.json()
        setState({ loading: false, data, error: '' })
      } catch (error) {
        setState({ loading: false, data: null, error: error.message })
      }
    }
    run()
  }, [])

  return (
    <section className="card">
      <h2>Public API Page</h2>
      <p>
        Calls <code>{`${API_BASE_URL}/api/public/news`}</code> without auth
        token.
      </p>
      {state.loading && <p>Loading public data...</p>}
      {state.error && <p className="error">{state.error}</p>}
      {state.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
    </section>
  )
}

function ProtectedApiPage() {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  useEffect(() => {
    const run = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/protected/profile`, {
          headers: {
            Authorization: 'Bearer prerender-poc-token',
          },
        })
        if (!response.ok) throw new Error('Protected API failed')
        const data = await response.json()
        setState({ loading: false, data, error: '' })
      } catch (error) {
        setState({ loading: false, data: null, error: error.message })
      }
    }
    run()
  }, [])

  return (
    <section className="card">
      <h2>Protected API Page</h2>
      <p>
        Calls <code>{`${API_BASE_URL}/api/protected/profile`}</code> with
        bearer token to test prerender behavior on authenticated pages.
      </p>
      {state.loading && <p>Loading protected data...</p>}
      {state.error && <p className="error">{state.error}</p>}
      {state.data && <pre>{JSON.stringify(state.data, null, 2)}</pre>}
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <main className="layout">
        <h1>Prerender PoC App</h1>
        <nav className="nav">
          <Link to="/">Static</Link>
          <Link to="/public-api">Public API</Link>
          <Link to="/protected-api">Protected API</Link>
        </nav>
        <Routes>
          <Route path="/" element={<StaticPage />} />
          <Route path="/public-api" element={<PublicApiPage />} />
          <Route path="/protected-api" element={<ProtectedApiPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
