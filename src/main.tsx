import { StrictMode, Component } from 'react'
import type { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      const e = this.state.error as Error
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#1a0a0a', color: '#f87171', minHeight: '100vh' }}>
          <h2 style={{ color: '#fca5a5', marginBottom: 8 }}>Runtime Error</h2>
          <p style={{ color: '#fca5a5', marginBottom: 16 }}><strong>{e.name}:</strong> {e.message}</p>
          <pre style={{ background: '#0a0000', padding: 16, borderRadius: 8, overflow: 'auto', fontSize: 12, color: '#fcd34d', whiteSpace: 'pre-wrap' }}>{e.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
