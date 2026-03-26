import { createContext, useContext, useMemo, type ReactNode } from 'react'

type ConfirmHandler = () => void | Promise<void>

type PopupContextValue = {
  showNotice: (message: string, title?: string) => void
  showError: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
  showConfirm: (
    message: string,
    onConfirm: ConfirmHandler,
    title?: string,
    onCancel?: () => void,
  ) => void
}

const PopupContext = createContext<PopupContextValue | null>(null)

const formatMessage = (title: string | undefined, message: string) =>
  title ? `${title}\n\n${message}` : message

export function PopupProvider({ children }: { children: ReactNode }) {
  const value = useMemo<PopupContextValue>(
    () => ({
      showNotice: (message, title) => {
        window.alert(formatMessage(title, message))
      },
      showError: (message, title) => {
        window.alert(formatMessage(title ?? 'Lỗi', message))
      },
      showWarning: (message, title) => {
        window.alert(formatMessage(title ?? 'Cảnh báo', message))
      },
      showConfirm: (message, onConfirm, title, onCancel) => {
        const accepted = window.confirm(formatMessage(title, message))
        if (accepted) {
          void onConfirm()
          return
        }
        onCancel?.()
      },
    }),
    [],
  )

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>
}

export function usePopup() {
  const context = useContext(PopupContext)

  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider')
  }

  return context
}