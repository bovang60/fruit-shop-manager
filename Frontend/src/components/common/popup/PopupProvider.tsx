import React, { createContext, useContext, useState, useCallback } from 'react'
import PopupView from './PopupView'

type PopupType = 'notice' | 'confirm' | 'error' | 'warning'

interface PopupConfig {
  type: PopupType
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
}

interface PopupContextValue {
  showNotice: (message: string, title?: string) => void
  showConfirm: (message: string, onConfirm: () => void, title?: string, onCancel?: () => void) => void
  showError: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
}

const PopupContext = createContext<PopupContextValue | null>(null)

export function usePopup() {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error('usePopup must be used within PopupProvider')
  }
  return context
}

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null)

  const hidePopup = useCallback(() => {
    setPopupConfig(null)
  }, [])

  const showNotice = useCallback((message: string, title?: string) => {
    setPopupConfig({
      type: 'notice',
      title: title || 'Thông báo',
      message,
      confirmText: 'OK'
    })
  }, [])

  const showConfirm = useCallback(
    (message: string, onConfirm: () => void, title?: string, onCancel?: () => void) => {
      setPopupConfig({
        type: 'confirm',
        title: title || 'Xác nhận',
        message,
        onConfirm: () => {
          onConfirm()
          hidePopup()
        },
        onCancel: () => {
          onCancel?.()
          hidePopup()
        },
        confirmText: 'Xác nhận',
        cancelText: 'Hủy'
      })
    },
    [hidePopup]
  )

  const showError = useCallback((message: string, title?: string) => {
    setPopupConfig({
      type: 'error',
      title: title || 'Lỗi',
      message,
      confirmText: 'OK'
    })
  }, [])

  const showWarning = useCallback((message: string, title?: string) => {
    setPopupConfig({
      type: 'warning',
      title: title || 'Cảnh báo',
      message,
      confirmText: 'OK'
    })
  }, [])

  const handleConfirm = () => {
    if (popupConfig?.onConfirm) {
      popupConfig.onConfirm()
    } else {
      hidePopup()
    }
  }

  const handleCancel = () => {
    if (popupConfig?.onCancel) {
      popupConfig.onCancel()
    } else {
      hidePopup()
    }
  }

  return (
    <PopupContext.Provider value={{ showNotice, showConfirm, showError, showWarning }}>
      {children}
      {popupConfig && (
        <PopupView
          type={popupConfig.type}
          title={popupConfig.title}
          message={popupConfig.message}
          confirmText={popupConfig.confirmText || 'OK'}
          cancelText={popupConfig.cancelText}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onClose={hidePopup}
        />
      )}
    </PopupContext.Provider>
  )
}
