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
  const { newEnquiryCount } = useProvider()
  const { t } = useLanguage()

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

      <div className="sidebar-card">
        <b>{t('completeProfile', 'Complete your profile')}</b>
        <div className="progress">
          <span style={{ width: '85%' }}></span>
        </div>
        <small className="muted">85% complete</small>
        <Link
          to="/profile"
          className="btn btn-secondary"
          style={{ width: '100%', marginTop: 10, textAlign: 'center' }}
        >
          {t('completeNow', 'Complete now')}
        </Link>
      </div>
    </aside>
  )
}
