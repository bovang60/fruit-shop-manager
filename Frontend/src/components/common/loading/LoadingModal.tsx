import './LoadingModal.css'

export type LoadingModalProps = {
  isOpen: boolean
  message?: string
  subMessage?: string
  theme?: 'green' | 'blue' | 'orange'
}

export default function LoadingModal({
  isOpen,
  message = 'Đang tải...',
  subMessage = 'Vui lòng chờ',
  theme = 'green'
}: LoadingModalProps) {
  if (!isOpen) return null

  return (
    <div className="loading-modal-overlay">
      <div className={`loading-modal-content ${theme}`}>
        <div className="loading-spinner"></div>
        <div>
          <p className="loading-text">{message}</p>
          {subMessage && <p className="loading-subtext">{subMessage}</p>}
        </div>
      </div>
    </div>
  )
}
