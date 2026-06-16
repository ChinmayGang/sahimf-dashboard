import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUIStore } from '../../stores/uiStore'

export function AppShell() {
  const lightMode = useUIStore((s) => s.lightMode)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: lightMode ? '#F5F4FF' : '#0A0A0A' }}>
      <Sidebar />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ background: lightMode ? '#F5F4FF' : '#0A0A0A' }}
        data-theme={lightMode ? 'light' : 'dark'}
      >
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
