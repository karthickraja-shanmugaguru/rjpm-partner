import React from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import {
  LayoutDashboard,
  Wrench,
  Package,
  Users,
  Settings,
} from 'lucide-react'

export const ProviderMobileNav = () => {
  const { t } = useLanguage()

  return (
    <nav className="mobile-nav">
      <NavLink
        to="/dashboard"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <LayoutDashboard size={20} />
        <span>{t('dashboard', 'Home')}</span>
      </NavLink>

      <NavLink
        to="/services"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <Wrench size={20} />
        <span>{t('myServices', 'Services')}</span>
      </NavLink>

      <NavLink
        to="/packages"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <Package size={20} />
        <span>{t('myPackages', 'Packages')}</span>
      </NavLink>

      <NavLink
        to="/labour"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <Users size={20} />
        <span>{t('myLabourStaff', 'Labour Staff')}</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) => (isActive ? 'active' : '')}
      >
        <Settings size={20} />
        <span>{t('settings', 'Settings')}</span>
      </NavLink>
    </nav>
  )
}

export default ProviderMobileNav
