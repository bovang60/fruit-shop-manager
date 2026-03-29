import React, { useContext, useState, useCallback } from 'react'
import PopupView from './PopupView'
import PopupContext from './PopupContext'
import type { PopupContextValue } from './PopupContext'

type PopupType = 'notice' | 'confirm' | 'error' | 'warning' | 'success'

interface PopupConfig {
  type: PopupType
  title: string
  message: string
  onConfirm?: () => void
  onCancel?: () => void
  confirmText?: string
  cancelText?: string
  isPrompt?: boolean
  placeholder?: string
}

export type { PopupContextValue }

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

  const showSuccess = useCallback((message: string, title?: string) => {
    setPopupConfig({
      type: 'success',
      title: title || 'Success',
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
          hidePopup()
          onConfirm()
        },
        onCancel: () => {
          hidePopup()
          onCancel?.()
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

  const showPrompt = useCallback(
    (message: string, onConfirm: (value: string) => void, title?: string, placeholder?: string, onCancel?: () => void) => {
      setPopupConfig({
        type: 'confirm',
        title: title || 'Nhập thông tin',
        message,
        isPrompt: true,
        placeholder: placeholder || 'Nhập tại đây...',
        onConfirm: () => {
          // The actual value will be handled by the PopupView and passed back
          // We'll need to adjust how handleConfirm works or pass a ref
        },
        onCancel: () => {
          onCancel?.()
          hidePopup()
        },
        confirmText: 'Xác nhận',
        cancelText: 'Hủy'
      })

        // Store the callback separately to be called by PopupView
        ; (window as any)._popup_prompt_callback = (val: string) => {
          hidePopup()
          onConfirm(val)
        }
    },
    [hidePopup]
  )


  const handleConfirm = () => {
    if (popupConfig?.isPrompt) {
      // Prompt value is handled via the window callback from PopupView
      return
    }
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
    <PopupContext.Provider value={{ showNotice, showSuccess, showConfirm, showError, showWarning, showPrompt }}>
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
          isPrompt={popupConfig.isPrompt}
          placeholder={popupConfig.placeholder}
        />

      )}
    </PopupContext.Provider>
  )
}
