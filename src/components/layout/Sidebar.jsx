import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useProvider } from '../../context/ProviderContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  LayoutDashboard,
  Store,
  Wrench,
  Package,
  Users,
  MessageSquare,
  Calendar,
  Star,
  TrendingUp,
  Settings,
} from 'lucide-react'

export const Sidebar = () => {
  const { provider } = useProvider()
  const { t } = useLanguage()

  const hasBiz = Boolean(provider?.businessName)
  const hasPhone = Boolean(provider?.phone)
  const hasServices = (provider?.services?.length > 0) || (provider?.experienceYears !== undefined)
  const hasDesc = Boolean(provider?.about)
  const completedCount = [hasBiz, hasPhone, hasServices, hasDesc].filter(Boolean).length
  const profilePercent = completedCount * 25

  return (
    <aside className="sidebar">
      <div className="nav-label">{t('navBusiness', 'Business')}</div>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <LayoutDashboard size={18} />
        </span>
        {t('dashboard', 'Dashboard')}
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <Store size={18} />
        </span>
        {t('myBusinessProfile', 'My Business Profile')}
      </NavLink>

      <NavLink
        to="/services"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <Wrench size={18} />
        </span>
        {t('myServices', 'My Services')}
      </NavLink>

      <NavLink
        to="/packages"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <Package size={18} />
        </span>
        {t('myPackages', 'My Packages')}
      </NavLink>

      <NavLink
        to="/labour"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <Users size={18} />
        </span>
        {t('myLabourStaff', 'My Labour Staff')}
      </NavLink>

      <div className="nav-label">{t('navInsights', 'Insights')}</div>
      <NavLink
        to="/reviews"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <Star size={18} />
        </span>
        {t('reviews', 'Reviews')}
      </NavLink>

      <NavLink
        to="/performance"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <TrendingUp size={18} />
        </span>
        {t('performance', 'Performance')}
      </NavLink>

      <div className="nav-label">{t('navAccount', 'Account')}</div>
      <NavLink
        to="/settings"
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <span className="nav-icon">
          <Settings size={18} />
        </span>
        {t('settings', 'Settings')}
      </NavLink>

      {profilePercent >= 100 ? (
        <div className="sidebar-card" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#166534', fontWeight: 700, fontSize: 13 }}>
            <span>✓</span> {t('verifiedPartner', 'Verified Partner')}
          </div>
          <div className="progress" style={{ margin: '8px 0 6px', background: '#dcfce7' }}>
            <span style={{ width: '100%', background: '#16a34a' }}></span>
          </div>
          <small style={{ color: '#15803d', fontWeight: 600 }}>100% {t('profileComplete', 'Profile Complete')}</small>
        </div>
      ) : (
        <div className="sidebar-card">
          <b>{t('completeProfile', 'Complete your profile')}</b>
          <div className="progress">
            <span style={{ width: `${profilePercent || 75}%` }}></span>
          </div>
          <small className="muted">{profilePercent || 75}% {t('complete', 'complete')}</small>
          <Link
            to="/profile"
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: 10, textAlign: 'center' }}
          >
            {t('completeNow', 'Complete now')}
          </Link>
        </div>
      )}
    </aside>
  )
}
