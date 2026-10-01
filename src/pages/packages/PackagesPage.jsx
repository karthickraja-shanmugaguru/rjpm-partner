import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { Plus, Search, Edit2, Pause, Play, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react'

export const PackagesPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [packages, setPackages] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [typeFilter, setTypeFilter] = useState('All event types')
  const [loading, setLoading] = useState(true)

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const res = await providerService.getPackages()
      setPackages(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPackages()
  }, [])

  const handleToggleStatus = async (pkg) => {
    const nextStatus = pkg.status === 'LIVE' ? 'PAUSED' : 'LIVE'
    try {
      await providerService.updatePackage(pkg.id, { status: nextStatus })
      showToast(`${pkg.name} is now ${nextStatus}`)
      fetchPackages()
    } catch {
      showToast('Failed to change package status.')
    }
  }

  const handleDelete = async (pkgId, name) => {
    if (!window.confirm(`Delete package "${name}"?`)) return
    try {
      await providerService.deletePackage(pkgId)
      showToast(`Package "${name}" deleted.`)
      fetchPackages()
    } catch {
      showToast('Failed to delete package.')
    }
  }

  const filteredPackages = packages.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.eventType?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'All status' || p.status?.toUpperCase() === statusFilter.toUpperCase()
    const matchesType =
      typeFilter === 'All event types' || p.eventType?.toUpperCase() === typeFilter.toUpperCase()
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <section id="packages" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('myPackages', 'My Packages')}</h1>
          <p className="page-subtitle">{t('packagesSubtitle', 'Create ready-made event packages by combining your existing services.')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/packages/new')}>
          <Plus size={16} /> {t('addNewPackage', 'Add new package')}
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder={`${t('search', 'Search')} ${t('myPackages', 'packages')}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All status">{t('allStatus', 'All status')}</option>
          <option value="Live">{t('live', 'Live')}</option>
          <option value="Paused">{t('paused', 'Paused')}</option>
          <option value="Draft">{t('draft', 'Draft')}</option>
        </select>
        <select
          className="filter"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="All event types">{t('allEventTypes', 'All event types')}</option>
          <option>Wedding</option>
          <option>Birthday</option>
          <option>Reception</option>
          <option>Engagement</option>
          <option>Housewarming</option>
          <option>Baby Shower</option>
          <option>Anniversary</option>
          <option>Corporate</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ margin: '0 auto 12px' }} />
          <p>{t('loading', 'Loading your celebration packages...')}</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{t('noPackagesFound', 'No packages found')}</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px' }}>
            {packages.length === 0
              ? t('noPackagesYet', 'You have not created any packages yet. Combine your catering and decor into complete celebration bundles.')
              : 'No packages match your active filters.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/packages/new')}>
            <Plus size={16} /> {t('addNewPackage', 'Create Package')}
          </button>
        </div>
      ) : (
        <div id="packageProviderGrid" className="package-grid-provider">
          {filteredPackages.map((p) => {
            const isLive = p.status === 'LIVE'
            const includedServices = p.services || []

            return (
              <div key={p.id} className="card package-provider-card">
                <div
                  className="package-banner"
                  style={{
                    backgroundImage: p.coverImage ? `url(${p.coverImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  {!p.coverImage && <span>{p.icon || '💍'}</span>}
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, alignItems: 'center' }}>
                    {Array.isArray(p.images) && p.images.length > 0 && (
                      <span
                        style={{
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: '#fff',
                          padding: '3px 8px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        📷 {p.images.length}
                      </span>
                    )}
                    <span className={`status ${p.status?.toLowerCase() || 'live'}`}>
                      {p.status || 'Live'}
                    </span>
                  </div>
                </div>

                <div className="package-provider-body">
                  <div className="package-provider-title">{p.name}</div>
                  <span className="package-event-type">{p.eventType || 'Celebration'}</span>

                  <div className="package-provider-price">
                    ₹{Number(p.price).toLocaleString('en-IN')}+
                  </div>

                  <div style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 0 6px' }}>
                    {p.guestCapacity ? `Capacity: Up to ${String(p.guestCapacity).replace(/\s*guests\s*/gi, '').trim()} guests` : 'Flexible guest capacity'}
                  </div>

                  {includedServices.length > 0 && (
                    <div className="package-includes">
                      {includedServices.slice(0, 3).map((s) => (
                        <span key={s.id} className="package-service-chip">
                          ✓ {s.title}
                        </span>
                      ))}
                      {includedServices.length > 3 && (
                        <span className="package-service-chip">+{includedServices.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <div className="package-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/packages/${p.id}/edit`)}
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      className={`btn ${isLive ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleStatus(p)}
                    >
                      {isLive ? <Pause size={12} /> : <Play size={12} />}
                      {isLive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '8px 10px', flex: '0 0 auto' }}
                      title="Delete"
                      onClick={() => handleDelete(p.id, p.name)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
