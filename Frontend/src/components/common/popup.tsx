// Bridge file — re-exports from the canonical module.
// Uses the same shared PopupContext so HMR can never create two context instances.
export { PopupProvider, usePopup } from './popup/PopupProvider'
