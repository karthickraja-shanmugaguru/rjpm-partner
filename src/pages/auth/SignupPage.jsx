import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Eye, EyeOff } from 'lucide-react'

const BUSINESS_CATEGORIES = [
  'Event Planning',
  'Decoration',
  'Catering',
  'Photography',
  'Videography',
  'Mehendi',
  'Flower Decor',
  'Stage Setup',
  'Pandit/Iyer',
  'Sound & Lighting',
  'Makeup & Hair',
  'Cake',
  'Return Gifts',
  'Security',
  'Transport',
  'Labour / Event Helpers',
  'Invitations',
  'Anchor / MC',
  'Nadaswaram & Melam',
  'DJ & Music',
  'Costumes & Jewellery',
]

export const SignupPage = () => {
  const { signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Pre-fill phone if passed from customer "Claim listing" button (e.g. ?phone=9003829989)
  const queryPhone = new URLSearchParams(window.location.search).get('phone') || ''
  const cleanInitialPhone = queryPhone.replace(/\D/g, '').slice(-10)

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    primaryCategory: 'Event Planning',
    phone: cleanInitialPhone,
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [accountExists, setAccountExists] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'phone') {
      const clean = value.replace(/\D/g, '').slice(0, 10)
      setFormData((prev) => ({ ...prev, phone: clean }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setAccountExists(false)

    if (!formData.businessName.trim()) {
      setError('Please enter your business or shop name.')
      return
    }

    if (!formData.phone || formData.phone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!formData.password || formData.password.length < 4) {
      setError('Password must be at least 4 characters long.')
      return
    }

    setLoading(true)
    try {
      const res = await signup({
        phone: formData.phone,
        password: formData.password,
        name: formData.ownerName.trim() || formData.businessName.trim(),
        ownerName: formData.ownerName.trim(),
        businessName: formData.businessName.trim(),
        primaryCategory: formData.primaryCategory,
      })

      if (res?.data?.autoClaimed) {
        const stats = res?.data?.claimedStats
        const total = stats?.totalListings || 1
        showToast(`🎉 Existing profile found! ${total} listings claimed & live on your dashboard!`, 'success')
      } else {
        showToast('Business registered successfully!', 'success')
      }

      navigate('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Registration failed. Please try again.'
      const exists =
        err?.response?.status === 409 ||
        err?.response?.data?.code === 'ACCOUNT_EXISTS' ||
        msg.toLowerCase().includes('already exists')
      setError(msg)
      setAccountExists(Boolean(exists))
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
              padding: '12px 14px',
              borderRadius: 10,
              fontSize: 13,
              marginBottom: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div>{error}</div>
            {accountExists && (
              <button
                type="button"
                onClick={() => navigate('/login', { state: { phone: formData.phone } })}
                style={{
                  alignSelf: 'flex-start',
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Sign In With {formData.phone} →
              </button>
            )}
          </div>
        )}

        <div id="signupView">
          <h1>Create your provider account</h1>
          <p>Start with only the essential details. You can complete the profile later.</p>

          <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block' }}>Business / Shop name</label>
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Royal Decorators, SP Caterers"
              required
            />

            <label style={{ fontSize: 13, fontWeight: 700, marginTop: 12, display: 'block' }}>Primary service category</label>
            <select
              name="primaryCategory"
              value={formData.primaryCategory}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '11px',
                border: '1px solid var(--border)',
                background: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                marginTop: '8px',
                cursor: 'pointer',
              }}
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label style={{ fontSize: 13, fontWeight: 700, marginTop: 12, display: 'block' }}>Owner name</label>
            <input
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Your name"
              required
            />

            <label style={{ fontSize: 13, fontWeight: 700, marginTop: 12, display: 'block' }}>Mobile number</label>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
            />

            <label style={{ fontSize: 13, fontWeight: 700, marginTop: 12, display: 'block' }}>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (min. 4 characters)"
                style={{ paddingRight: '42px', marginTop: 8 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-15%)',
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
                {loading ? 'Creating account...' : 'Create Account & Sign In'}
              </button>
            </div>
          </form>

          <div className="auth-link" onClick={() => navigate('/login')}>
            Already registered? Sign in
          </div>

          <div style={{ marginTop: 16, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
            Need help onboarding? Contact Support:{' '}
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

export default SignupPage
