import React from 'react'
import './Popup.css'

type PopupType = 'notice' | 'confirm' | 'error' | 'warning'

export type Props = {
  type: PopupType
  title: string
  message: string
  confirmText: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  onClose: () => void
}

export default function PopupView({
  type,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose
}: Props) {
  const getIcon = () => {
    switch (type) {
      case 'notice':
        return 'ℹ️'
      case 'confirm':
        return '❓'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className={`popup-container popup-${type}`} onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          ✕
        </button>
        
        <div className="popup-header">
          <span className="popup-icon">{getIcon()}</span>
          <h3 className="popup-title">{title}</h3>
        </div>

        <div className="popup-body">
          <p className="popup-message">{message}</p>
        </div>

        <div className="popup-footer">
          {cancelText && (
            <button className="popup-btn popup-btn-cancel" onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button className={`popup-btn popup-btn-confirm popup-btn-${type}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
