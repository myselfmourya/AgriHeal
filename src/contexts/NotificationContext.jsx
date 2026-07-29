import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (msg, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration)
  }

  const success = (msg) => addToast(msg, 'success')
  const error   = (msg) => addToast(msg, 'error')
  const info    = (msg) => addToast(msg, 'info')
  const warn    = (msg) => addToast(msg, 'warn')

  return (
    <NotificationContext.Provider value={{ addToast, success, error, info, warn }}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed', bottom: '5rem', right: '1rem',
        display: 'flex', flexDirection: 'column', gap: '8px',
        zIndex: 9999, maxWidth: '320px',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: t.type === 'success' ? '#dcfce7' :
                        t.type === 'error'   ? '#fee2e2' :
                        t.type === 'warn'    ? '#fef3c7' : '#dbeafe',
            color: t.type === 'success' ? '#15803d' :
                   t.type === 'error'   ? '#b91c1c' :
                   t.type === 'warn'    ? '#b45309' : '#1d4ed8',
            border: `1px solid ${t.type === 'success' ? '#bbf7d0' : t.type === 'error' ? '#fecaca' : t.type === 'warn' ? '#fde68a' : '#bfdbfe'}`,
            borderRadius: '12px', padding: '0.75rem 1rem',
            fontSize: '0.85rem', fontWeight: 600,
            boxShadow: '0 4px 16px rgba(0,0,0,.12)',
            animation: 'slideInRight .25s ease',
          }}>
            {t.msg}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
