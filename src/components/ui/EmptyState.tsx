import { useUIStore } from '../../stores/uiStore'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  const lm = useUIStore((s) => s.lightMode)

  const text = lm ? 'text-[#111827]' : 'text-white'
  const textSub = lm ? 'text-[#6B7280]' : 'text-[#A0A0A0]'
  const iconBg = lm ? 'bg-[#F3F4F6] border border-[#E8E8F0] text-[#9CA3AF]' : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#A0A0A0]'

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
          {icon}
        </div>
      )}
      <h3 className={`text-base font-semibold ${text} mb-2`}>{title}</h3>
      {description && <p className={`text-sm ${textSub} max-w-xs mb-6`}>{description}</p>}
      {action}
    </div>
  )
}
