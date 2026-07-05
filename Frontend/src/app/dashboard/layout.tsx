import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <ChatWidget />
    </div>
  )
}
