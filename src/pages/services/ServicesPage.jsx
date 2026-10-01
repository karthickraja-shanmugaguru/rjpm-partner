import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { Plus, Search, Edit2, Pause, Play, Trash2, RefreshCw } from 'lucide-react'

export const ServicesPage = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [loading, setLoading] = useState(true)

  const fetchServices = async () => {
    setLoading(true)
    try {
      const res = await providerService.getServices()
      setServices(res.data || [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleToggleStatus = async (service) => {
    const nextStatus = service.status === 'LIVE' ? 'PAUSED' : 'LIVE'
    try {
      await providerService.updateService(service.id, { status: nextStatus })
      showToast(`${service.title} is now ${nextStatus}`)
      fetchServices()
    } catch (err) {
      showToast('Failed to change service status.')
    }
  }

  const handleDelete = async (serviceId, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return
    try {
      await providerService.deleteService(serviceId)
      showToast(`Service "${title}" was removed.`)
      fetchServices()
    } catch (err) {
      showToast('Failed to delete service.')
    }
  }

  const filteredServices = services.filter((s) => {
    const title = (s.title || s.name || '').toLowerCase()
    const category = (s.category || s.category_name || '').toLowerCase()
    const matchesSearch =
      title.includes(search.toLowerCase()) ||
      category.includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'All status' || (s.status && s.status.toUpperCase() === statusFilter.toUpperCase())
    return matchesSearch && matchesStatus
  })

  return (
    <section id="services" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">{t('myServicesTitle', 'My Services')}</h1>
          <p className="page-subtitle">{t('myServicesSubtitle', 'Manage the services customers can discover and enquire about.')}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/services/new')}>
          <Plus size={16} /> {t('addNewService', 'Add new service')}
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search"
          placeholder={t('searchMyServices', 'Search my services...')}
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
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ margin: '0 auto 12px' }} />
          <p>{t('loadingServices', 'Loading your active service listings...')}</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 16 }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{t('noServicesFound', 'No services found')}</h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 20px' }}>
            {services.length === 0
              ? t('noServicesYet', 'You have not added any services yet. Start adding the services you provide (e.g. Catering, Floral Decor, Photography).')
              : 'No services match your active search filters.'}
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/services/new')}>
            <Plus size={16} /> {t('createService', 'Create Service')}
          </button>
        </div>
      ) : (
        <div id="serviceGrid" className="service-grid">
          {filteredServices.map((s) => {
            const isLive = s.status === 'LIVE'
            const displayPrice = s.priceDisplay || (typeof s.price === 'number' && !isNaN(s.price) ? `₹${s.price.toLocaleString('en-IN')}` : (s.price || '₹0'))
            return (
              <div key={s.id} className="card service-card">
                <div
                  className="service-photo"
                  style={{
                    backgroundImage: s.coverImage ? `url(${s.coverImage})` : undefined,
                  }}
                >
                  {!s.coverImage && <span>✨</span>}
                  <span className={`status ${s.status?.toLowerCase() || 'live'}`}>
                    {s.status === 'LIVE' ? t('live', 'Live') : s.status === 'PAUSED' ? t('paused', 'Paused') : (s.status || 'Live')}
                  </span>
                </div>

                <div className="service-body">
                  <div className="service-title">{s.title || s.name}</div>
                  <div className="service-category">{s.category || s.category_name}</div>
                  <div className="service-price">
                    {displayPrice.startsWith('₹') ? displayPrice : `₹${displayPrice}`}{' '}
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--muted)' }}>
                      {s.pricingType === 'PER_PLATE' ? '/ plate' : s.pricingType === 'PER_DAY' ? '/ day' : 'onwards'}
                    </span>
                  </div>
                  <div className="muted" style={{ fontSize: 12, lineHeight: 1.5, minHeight: 36 }}>
                    {s.description || s.desc || 'Verified event service with turnkey execution.'}
                  </div>

                  <div className="service-actions" style={{ marginTop: 14 }}>
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/services/${s.id}/edit`)}
                    >
                      <Edit2 size={13} /> {t('edit', 'Edit')}
                    </button>
                    <button
                      className={`btn ${isLive ? 'btn-secondary' : 'btn-primary'}`}
                      onClick={() => handleToggleStatus(s)}
                    >
                      {isLive ? <Pause size={13} /> : <Play size={13} />}
                      {isLive ? t('pause', 'Pause') : t('activate', 'Activate')}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '8px 10px', flex: '0 0 auto' }}
                      title={t('delete', 'Delete')}
                      onClick={() => handleDelete(s.id, s.title)}
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
