import React, { createContext, useContext, useState, useEffect } from 'react'
import { providerService } from '../services/providerService'
import { useAuth } from './AuthContext'

const ProviderContext = createContext(null)

export const ProviderContextProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [provider, setProvider] = useState(null)
  const [newEnquiryCount, setNewEnquiryCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const refreshProfile = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      const res = await providerService.getProfile()
      if (res.success && res.data) {
        setProvider(res.data)
      }
      const enqRes = await providerService.getEnquiries('PENDING')
      if (enqRes.success && enqRes.data) {
        setNewEnquiryCount(enqRes.data.length)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      refreshProfile()
    } else {
      setProvider(null)
    }
  }, [isAuthenticated])

  return (
    <ProviderContext.Provider
      value={{
        provider,
        newEnquiryCount,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </ProviderContext.Provider>
  )
}

export const useProvider = () => {
  const context = useContext(ProviderContext)
  if (!context) throw new Error('useProvider must be used within ProviderContextProvider')
  return context
}
