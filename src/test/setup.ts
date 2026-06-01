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

let localStorageMock: Record<string, string> = {
  i18nextLng: 'en',
}

Storage.prototype.getItem = (key: string) => {
  return localStorageMock[key] ?? null
}

Storage.prototype.setItem = (key: string, value: string) => {
  localStorageMock[key] = value
}

Storage.prototype.removeItem = (key: string) => {
  delete localStorageMock[key]
}

Storage.prototype.clear = () => {
  localStorageMock = { i18nextLng: 'en' }
}
