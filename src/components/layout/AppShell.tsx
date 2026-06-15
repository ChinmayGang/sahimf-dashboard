import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useUIStore } from '../../stores/uiStore'
import gradientBg from '../../assets/white_purple_gradient-background-1.jpg'

export function AppShell() {
  const lightMode = useUIStore((s) => s.lightMode)

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      {/* Sidebar is always dark — never receives data-theme */}
      <Sidebar />
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={lightMode ? {
          backgroundImage: `url(${gradientBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : { background: '#0A0A0A' }}
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
