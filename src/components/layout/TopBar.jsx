import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useProvider } from '../../context/ProviderContext'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { Bell, Eye } from 'lucide-react'
import { getCustomerBaseUrl } from '../../utils/urlUtils'

export const TopBar = () => {
  const { user } = useAuth()
  const { provider } = useProvider()
  const { showToast } = useToast()
  const { language, setLanguage, t } = useLanguage()
  const navigate = useNavigate()

  const initials = provider?.businessName
    ? provider.businessName.substring(0, 2).toUpperCase()
    : user?.name
    ? user.name.substring(0, 2).toUpperCase()
    : 'RP'

  return (
    <header className="topbar">
      <Link to="/dashboard" className="brand" aria-label="rjpm.in Partner Portal">
        <div
          className="logo"
          style={{
            background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
            color: '#fff',
            fontWeight: 800,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 10,
          }}
        >
          R
        </div>
        <span style={{ fontWeight: 800, letterSpacing: '-0.3px' }}>rjpm.in</span>
        <span className="provider-pill">{t('providerPill', 'PARTNER')}</span>
      </Link>

      <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Language Switcher for Tamil / English */}
        <div
          className="lang-switcher"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#f1f5f9',
            borderRadius: 20,
            padding: '3px',
            border: '1px solid var(--border-light, #e2e8f0)',
          }}
          title={t('switchLanguage', 'Language: English / தமிழ்')}
        >
          <button
            type="button"
            onClick={() => setLanguage('en')}
            style={{
              border: 'none',
              background: language === 'en' ? 'var(--primary, #2563eb)' : 'transparent',
              color: language === 'en' ? '#ffffff' : 'var(--muted, #64748b)',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ta')}
            style={{
              border: 'none',
              background: language === 'ta' ? 'var(--primary, #2563eb)' : 'transparent',
              color: language === 'ta' ? '#ffffff' : 'var(--muted, #64748b)',
              fontSize: 12,
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 16,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            தமிழ்
          </button>
        </div>

        <button
          className="icon-btn"
          title={t('notifications', 'Notifications')}
          onClick={() => showToast(t('notificationsUpToDate', 'All notifications are up to date.'))}
        >
          <Bell size={18} />
        </button>

        <button
          className="icon-btn"
          title={t('previewCustomerView', 'Preview customer view')}
          onClick={() => {
            if (provider?.id) {
              const base = getCustomerBaseUrl()
              window.open(`${base}/providers/${provider.id}`, '_blank')
            } else {
              navigate('/profile')
            }
          }}
        >
          <Eye size={18} />
        </button>

        <Link to="/profile" className="avatar" title={provider?.businessName || t('myBusinessProfile', 'My Profile')}>
          {initials}
        </Link>
      </div>
    </header>
  )
}
