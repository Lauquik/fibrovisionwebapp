import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
const COOKIE_KEY = 'revision-app-sb-auth-token'
const COOKIE_CHUNK_SIZE = 3500
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

function buildCookieAttributes() {
  const attributes = [
    'path=/',
    `max-age=${COOKIE_MAX_AGE_SECONDS}`,
    'SameSite=Lax'
  ]

  if (window.location.protocol === 'https:') {
    attributes.push('Secure')
  }

  return attributes.join('; ')
}

function setCookie(name, value) {
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; ${buildCookieAttributes()}`
}

function getCookie(name) {
  const encodedName = `${encodeURIComponent(name)}=`
  const cookies = document.cookie ? document.cookie.split('; ') : []

  for (const cookie of cookies) {
    if (cookie.startsWith(encodedName)) {
      return decodeURIComponent(cookie.slice(encodedName.length))
    }
  }

  return null
}

function removeCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`
}

function removeChunkedCookie(key) {
  const chunkCount = Number.parseInt(getCookie(`${key}.chunks`) ?? '0', 10)

  removeCookie(key)
  removeCookie(`${key}.chunks`)

  for (let index = 0; index < chunkCount; index += 1) {
    removeCookie(`${key}.${index}`)
  }
}

const cookieStorage = {
  getItem(key) {
    const chunkCount = Number.parseInt(getCookie(`${key}.chunks`) ?? '0', 10)

    if (chunkCount > 0) {
      let value = ''

      for (let index = 0; index < chunkCount; index += 1) {
        const chunk = getCookie(`${key}.${index}`)
        if (chunk === null) return null
        value += chunk
      }

      return value
    }

    return getCookie(key)
  },
  setItem(key, value) {
    removeChunkedCookie(key)

    if (value.length <= COOKIE_CHUNK_SIZE) {
      setCookie(key, value)
      return
    }

    const chunks = Math.ceil(value.length / COOKIE_CHUNK_SIZE)

    setCookie(`${key}.chunks`, String(chunks))

    for (let index = 0; index < chunks; index += 1) {
      const start = index * COOKIE_CHUNK_SIZE
      const chunk = value.slice(start, start + COOKIE_CHUNK_SIZE)
      setCookie(`${key}.${index}`, chunk)
    }
  },
  removeItem(key) {
    removeChunkedCookie(key)
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: COOKIE_KEY,
    storage: cookieStorage
  }
})
