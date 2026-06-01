import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})

Storage.prototype.getItem = (key: string) => {
  if (key === 'i18nextLng') return 'en'
  return null
}

Storage.prototype.setItem = () => {}
Storage.prototype.removeItem = () => {}
Storage.prototype.clear = () => {}
