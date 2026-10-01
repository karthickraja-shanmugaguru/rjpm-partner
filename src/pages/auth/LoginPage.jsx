import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Eye, EyeOff } from 'lucide-react'

export const LoginPage = () => {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [phone, setPhone] = useState(location.state?.phone || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhone(val)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanPhone = phone.trim()
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!password) {
      setError('Please enter your password.')
      return
    }

    setLoading(true)
    try {
      await login(cleanPhone, password)
      showToast('Welcome back to your Provider Portal!')
      navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="auth" className="auth">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo">R</div>
          <span>rjpm.in</span>
          <span className="provider-pill">PARTNER</span>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fee2e2',
              color: '#dc2626',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <div id="loginView">
          <h1>Grow your event business</h1>
          <p>Sign in with your registered mobile number and password to manage services, enquiries and bookings.</p>

          <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block' }}>Mobile number</label>
            <input
              id="loginPhone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={handlePhoneChange}
              placeholder="10-digit mobile number"
              required
              autoFocus
            />

            <label style={{ fontSize: 13, fontWeight: 700, marginTop: 14, display: 'block' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="loginPassword"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{ paddingRight: '42px', marginTop: 4 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-20%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-actions" style={{ marginTop: 20 }}>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="auth-link" onClick={() => navigate('/signup')}>
            New provider? Create a business account
          </div>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            Need help? Contact Support:{' '}
            <a
              href="tel:+919360226758"
              style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}
            >
              +91 9360226758
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
