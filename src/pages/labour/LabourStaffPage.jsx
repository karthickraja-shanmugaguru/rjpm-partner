import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { Plus, Users, Search, Edit2, Trash2, Pause, Play, RefreshCw, ExternalLink, Image as ImageIcon } from 'lucide-react'

export const LabourStaffPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [listings, setListings] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  const fetchListings = async () => {
    setLoading(true)
    try {
      const res = await providerService.getLabourListings()
      setListings(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleToggleStatus = async (item) => {
    try {
      const res = await providerService.toggleLabourListingStatus(item.id)
      const nextStatus = res.data?.status || (item.status === 'LIVE' ? 'PAUSED' : 'LIVE')
      setListings((prev) =>
        prev.map((l) => (l.id === item.id ? { ...l, status: nextStatus } : l))
      )
      showToast(nextStatus === 'LIVE' ? 'Labour listing activated live!' : 'Labour listing paused.')
    } catch (err) {
      showToast('Failed to update listing status')
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from labour listings?`)) return
    try {
      await providerService.deleteLabourListing(id)
      showToast(`"${name}" was removed.`)
      fetchListings()
    } catch (err) {
      showToast('Failed to remove labour listing.')
    }
  }

  const categories = ['All', ...new Set(listings.map((l) => l.type).filter(Boolean))]

  const filtered = listings.filter((l) => {
    const nameMatch = (l.name || '').toLowerCase().includes(search.toLowerCase())
    const typeMatch = (l.type || '').toLowerCase().includes(search.toLowerCase())
    const matchesSearch = !search.trim() || nameMatch || typeMatch
    const matchesCategory = categoryFilter === 'All' || l.type === categoryFilter
    const status = l.status || 'LIVE'
    const matchesStatus =
      statusFilter === 'All status' ||
      (statusFilter === 'Live' && status === 'LIVE') ||
      (statusFilter === 'Paused' && status === 'PAUSED')
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <section id="labourStaff" className="screen active" style={{ display: 'block' }}>
      <div className="page-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h1 className="page-title" style={{ fontSize: 24, fontWeight: 800, margin: 0, color: 'var(--text)' }}>
            {t('myLabourStaff', 'My Labour & Event Staff')}
          </h1>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 14 }}>
            {t('myLabourSubtitle', 'Manage your trained workers, cover photos, past work gallery, and live rates on rjpm.in.')}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/labour/new')} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={16} /> {t('addLabourService', 'Add Labour Service')}
        </button>
      </div>

      {/* Info Banner */}
      <div
        style={{
          padding: '12px 18px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: 12,
          fontSize: 13,
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} color="#2563eb" />
          <span>
            Staff services listed here appear live in the <strong>Event Staff & Labour Support</strong> section of <strong>rjpm.in</strong>.
          </span>
        </div>
        <a
          href="http://localhost:3000/labour"
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#2563eb', fontWeight: 600, textDecoration: 'none', fontSize: 13 }}
        >
          View live directory <ExternalLink size={12} />
        </a>
      </div>

      {/* Toolbar matching ServicesPage */}
      <div className="toolbar" style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          className="search"
          placeholder={t('searchLabourPlaceholder', 'Search labour staff by name or role...')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <select
          className="filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ minWidth: 140 }}
        >
          <option value="All status">{t('allStatus', 'All status')}</option>
          <option value="Live">{t('live', 'Live')}</option>
          <option value="Paused">{t('paused', 'Paused')}</option>
        </select>
        {categories.length > 1 && (
          <select
            className="filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ minWidth: 160 }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Roles' : c}
              </option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ margin: '0 auto 12px' }} />
          <p>{t('loadingLabour', 'Loading your active labour listings...')}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 16 }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Users size={28} color="var(--muted)" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: 'var(--text)' }}>
            {listings.length === 0 ? 'No Labour Services Listed Yet' : 'No matching staff found'}
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
            {listings.length === 0
              ? 'List your catering servers, kitchen assistants, cleaning staff, pandal riggers, or security guards to get hired for events in Rajapalayam.'
              : 'No labour staff match your active search and status filters.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/labour/new')}>
            <Plus size={16} /> {t('addLabourService', 'Add Labour Service')}
          </button>
        </div>
      ) : (
        <div id="labourGrid" className="service-grid">
          {filtered.map((item) => {
            const isLive = item.status === 'LIVE'
            const rawImages = Array.isArray(item.images)
              ? item.images
              : (typeof item.images === 'string' && item.images.trim()
                  ? (() => { try { return JSON.parse(item.images) } catch { return [] } })()
                  : [])
            const cover = item.coverImage || item.cover_image || (rawImages.length > 0 && rawImages[0])
            const imageCount = rawImages.length
            const displayPrice = item.price_display || (item.price_amount ? `₹${Number(item.price_amount).toLocaleString('en-IN')}` : '₹500')

            return (
              <div key={item.id} className="card service-card">
                <div
                  className="service-photo"
                  style={{
                    backgroundImage: cover ? `url(${cover})` : undefined,
                  }}
                >
                  {!cover && <span>👷</span>}
                  <span className={`status ${item.status?.toLowerCase() || 'live'}`}>
                    {item.status === 'LIVE' ? t('live', 'Live') : item.status === 'PAUSED' ? t('paused', 'Paused') : (item.status || 'Live')}
                  </span>
                  {imageCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: '#fff',
                        padding: '3px 8px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        backdropFilter: 'blur(4px)',
                      }}
                      title={`${imageCount} work photos uploaded`}
                    >
                      <ImageIcon size={11} /> {imageCount} photos
                    </span>
                  )}
                </div>

                <div className="service-body">
                  <div className="service-title">{item.name || item.title}</div>
                  <div className="service-category">
                    {item.type || item.category || 'Event Staff'}
                    {item.verified ? ' • Verified Staff' : ''}
                  </div>
                  <div className="service-price">
                    {displayPrice.startsWith('₹') ? displayPrice : `₹${displayPrice}`}{' '}
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>
                      / staff
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, minHeight: 36 }}>
                    {item.details || item.description || 'Verified event staff support in Rajapalayam.'}
                  </div>

                  <div className="service-actions" style={{ marginTop: 14 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/labour/${item.id}/edit`)}
                    >
                      <Edit2 size={13} /> {t('edit', 'Edit')}
                    </button>
                    <button
                      className={`btn ${isLive ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleStatus(item)}
                    >
                      {isLive ? <Pause size={13} /> : <Play size={13} />}
                      {isLive ? t('pause', 'Pause') : t('activate', 'Activate')}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '8px 10px', flex: '0 0 auto' }}
                      title={t('delete', 'Delete')}
                      onClick={() => handleDelete(item.id, item.name)}
                    >
                      <Trash2 size={14} />
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

export default LabourStaffPage
