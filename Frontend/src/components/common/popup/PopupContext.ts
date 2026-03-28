import { createContext } from 'react'

export interface PopupContextValue {
  showNotice: (message: string, title?: string) => void
  showSuccess: (message: string, title?: string) => void
  showError: (message: string, title?: string) => void
  showWarning: (message: string, title?: string) => void
  showConfirm: (
    message: string,
    onConfirm: () => void,
    title?: string,
    onCancel?: () => void
  ) => void
  showPrompt: (
    message: string,
    onConfirm: (value: string) => void,
    title?: string,
    placeholder?: string,
    onCancel?: () => void
  ) => void
}

// Single source of truth for the PopupContext object.
// Both popup.tsx (bridge) and popup/PopupProvider.tsx import from here
// so HMR changes to either file can never create two separate context instances.
const PopupContext = createContext<PopupContextValue | null>(null)

export default PopupContext
