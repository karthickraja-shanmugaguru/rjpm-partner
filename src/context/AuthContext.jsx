import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('evently_provider_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('evently_provider_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authService.getMe()
          if (res.success && res.data.user) {
            setUser(res.data.user)
            localStorage.setItem('evently_provider_user', JSON.stringify(res.data.user))
          }
        } catch {
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [token])

  const login = async (phone, password) => {
    const res = await authService.login({ phone, password })
    if (res.success && res.data?.token) {
      setToken(res.data.token)
      setUser(res.data.user)
      localStorage.setItem('evently_provider_token', res.data.token)
      localStorage.setItem('evently_provider_user', JSON.stringify(res.data.user))
      return res
    }
    throw new Error(res.message || 'Login failed')
  }

  const signup = async (data) => {
    const res = await authService.signup(data)
    if (res.success && res.data?.token) {
      setToken(res.data.token)
      setUser(res.data.user)
      localStorage.setItem('evently_provider_token', res.data.token)
      localStorage.setItem('evently_provider_user', JSON.stringify(res.data.user))
      return res
    }
    throw new Error(res.message || 'Signup failed')
  }

  // Backward compatibility alias
  const loginWithOtp = async (phone, otp) => {
    const res = await authService.verifyOtp({ phone, otp, role: 'PROVIDER' })
    if (res.success && res.data?.token) {
      setToken(res.data.token)
      setUser(res.data.user)
      localStorage.setItem('evently_provider_token', res.data.token)
      localStorage.setItem('evently_provider_user', JSON.stringify(res.data.user))
      return res
    }
    throw new Error(res.message || 'Verification failed')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('evently_provider_token')
    localStorage.removeItem('evently_provider_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        loginWithOtp,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
