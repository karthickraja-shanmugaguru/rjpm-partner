import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'

export const SettingsPage = () => {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState({
    enquiries: true,
    whatsapp: true,
    sms: false,
  })

  const toggleNotification = (key) => {
    setNotifications((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      showToast('Notification preferences updated.')
      return next
    })
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out of provider portal.')
    navigate('/login')
  }

  return (
    <section id="settings" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('settingsTitle', 'Settings')}</h1>
          <p className="page-subtitle">{t('settingsSubtitle', 'Manage account, notifications and future payout settings.')}</p>
        </div>
      </div>

      <div className="card" style={{ padding: 26, maxWidth: 850 }}>
        <h3>{t('notifications', 'Notifications')}</h3>

        <div className="setting-row">
          <div>
            <div className="setting-title">{t('newEnquiryAlerts', 'New enquiry alerts')}</div>
            <div className="setting-desc">{t('newEnquiryAlertsDesc', 'Get notified whenever a customer sends an enquiry.')}</div>
          </div>
          <div
            className={`switch ${notifications.enquiries ? 'on' : ''}`}
            onClick={() => toggleNotification('enquiries')}
          >
            <span></span>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-title">{t('whatsappAlerts', 'WhatsApp notifications')}</div>
            <div className="setting-desc">{t('whatsappAlertsDesc', 'Receive important booking and enquiry alerts on WhatsApp.')}</div>
          </div>
          <div
            className={`switch ${notifications.whatsapp ? 'on' : ''}`}
            onClick={() => toggleNotification('whatsapp')}
          >
            <span></span>
          </div>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-title">{t('smsAlerts', 'SMS notifications')}</div>
            <div className="setting-desc">{t('smsAlertsDesc', 'Backup SMS alerts for high-priority lead notifications.')}</div>
          </div>
          <div
            className={`switch ${notifications.sms ? 'on' : ''}`}
            onClick={() => toggleNotification('sms')}
          >
            <span></span>
          </div>
        </div>

        <h3 style={{ marginTop: 28 }}>{t('businessAccount', 'Business account')}</h3>

        <div className="setting-row">
          <div>
            <div className="setting-title">{t('payoutDetails', 'Bank / UPI details')}</div>
            <div className="setting-desc">{t('payoutDetailsDesc', 'Direct bank account or UPI VPA for settlement payouts.')}</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => showToast('Bank / UPI payout setup is ready for production activation.')}
          >
            {t('configure', 'Configure')}
          </button>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-title">{t('subscriptionBoost', 'Subscription / Boost')}</div>
            <div className="setting-desc">{t('subscriptionBoostDesc', 'Promoted listings and featured positioning on rjpm.in.')}</div>
          </div>
          <span className="status pending">Feature flagged</span>
        </div>

        <div className="setting-row">
          <div>
            <div className="setting-title">{t('helpSupport', 'Help & Support')}</div>
            <div className="setting-desc">Dedicated partner support: +91 9360226758 / support@rjpm.in</div>
          </div>
          <a
            href="tel:+919360226758"
            className="btn btn-secondary"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            {t('contactSupport', 'Call Support: +91 9360226758')}
          </a>
        </div>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-danger" onClick={handleLogout}>
            {t('logout', 'Log out from Provider Portal')}
          </button>
        </div>
      </div>
    </section>
  )
}
