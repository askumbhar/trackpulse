// src/components/common/Notification.tsx
// Usage:
//   import { useNotification } from './Notification'
//   const { notify } = useNotification()
//   notify({ type: 'win',  title: 'You Won!',  message: 'Midnight Dash won Race #104. You received ₹105.' })
//   notify({ type: 'lost', title: 'Lost',      message: 'Silver Bullet finished 5th in Race #104.' })
//   notify({ type: 'info', title: 'Placed',    message: 'Bet placed on Silver Bullet.' })

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import '../../styles/Notification.css'

type NotifType = 'win' | 'lost' | 'info' | 'warning'

interface Notif {
  id: number
  type: NotifType
  title: string
  message: string
}

interface NotifContextType {
  notify: (n: Omit<Notif, 'id'>) => void
}

const NotifContext = createContext<NotifContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifs, setNotifs] = useState<Notif[]>([])

  const dismiss = (id: number) =>
    setNotifs(prev => prev.filter(n => n.id !== id))

  const notify = useCallback((n: Omit<Notif, 'id'>) => {
    const id = Date.now()
    setNotifs(prev => [...prev, { ...n, id }])
    setTimeout(() => dismiss(id), 5000) // auto-dismiss after 5s
  }, [])

  const ICONS: Record<NotifType, string> = {
    win:     'bi-trophy-fill',
    lost:    'bi-x-circle-fill',
    info:    'bi-info-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
  }

  return (
    <NotifContext.Provider value={{ notify }}>
      {children}
      {/* Toast stack — top-right */}
      <div className="notif-stack">
        {notifs.map(n => (
          <div key={n.id} className={`notif-toast notif-${n.type}`}>
            <div className="notif-icon-wrap">
              <i className={`bi ${ICONS[n.type]}`} />
            </div>
            <div className="notif-body">
              <div className="notif-title">{n.title}</div>
              <div className="notif-msg">{n.message}</div>
            </div>
            <button className="notif-close" onClick={() => dismiss(n.id)}>
              <i className="bi bi-x" />
            </button>
          </div>
        ))}
      </div>
    </NotifContext.Provider>
  )
}

export function useNotification(): NotifContextType {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}