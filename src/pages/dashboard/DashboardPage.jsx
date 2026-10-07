import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useAuth } from '../../context/AuthContext'
import { useProvider } from '../../context/ProviderContext'
import {
  Wrench,
  Star,
  Plus,
  Package,
  CheckCircle2,
  ChevronRight,
  Users,
} from 'lucide-react'

export const DashboardPage = () => {
  const { user } = useAuth()
  const { provider } = useProvider()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    activeListings: 0,
    avgRating: 0,
    reviewsCount: 0,
  })
  const [packagesCount, setPackagesCount] = useState(0)
  const [servicesList, setServicesList] = useState([])
  const [packagesList, setPackagesList] = useState([])
  const [labourListings, setLabourListings] = useState([])
  const [activeTab, setActiveTab] = useState('services')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [dashRes, servicesRes, labourRes, pkgRes] = await Promise.all([
          providerService.getDashboard().catch(() => null),
          providerService.getServices().catch(() => null),
          providerService.getLabourListings().catch(() => null),
          providerService.getPackages().catch(() => null),
        ])

        if (dashRes && dashRes.data) {
          const dStats = dashRes.data.stats || dashRes.data
          setStats({
            activeListings: dStats.activeListings || 0,
            avgRating: dStats.averageRating || dStats.avgRating || 0,
            reviewsCount: dStats.reviewCount || dStats.reviewsCount || 0,
          })
        }
        if (servicesRes && servicesRes.data) {
          const sList = Array.isArray(servicesRes.data) ? servicesRes.data : []
          setServicesList(sList)
          if (sList.length > 0) setActiveTab('services')
        }
        if (labourRes && labourRes.data) {
          setLabourListings(Array.isArray(labourRes.data) ? labourRes.data : [])
        }
        if (pkgRes && pkgRes.data) {
          const pList = Array.isArray(pkgRes.data) ? pkgRes.data : []
          setPackagesList(pList)
          setPackagesCount(pList.length)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const ownerName = provider?.ownerName || user?.name || 'Partner'
  const labourCount = labourListings.length

  const hasBiz = Boolean(provider?.businessName)
  const hasPhone = Boolean(provider?.phone)
  const hasServices = stats.activeListings > 0
  const hasDesc = Boolean(provider?.about)
  const completedCount = [hasBiz, hasPhone, hasServices, hasDesc].filter(Boolean).length
  const profilePercent = completedCount * 25

  return (
    <section id="dashboard" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Good morning, {ownerName} 👋</h1>
          <p className="page-subtitle">Here&apos;s what is happening with your business today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/services/new')}>
          <Plus size={16} /> Add new service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats">
        <div className="card stat" onClick={() => navigate('/services')} style={{ cursor: 'pointer' }}>
          <div className="stat-top">
            <span className="stat-label">Active services</span>
            <div className="stat-icon">
              <Wrench size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.activeListings}</div>
          <div className="delta" style={{ color: stats.activeListings > 0 ? '#16a34a' : '#64748b' }}>
            {stats.activeListings > 0 ? `${stats.activeListings} live on marketplace` : 'No services added yet'}
          </div>
        </div>

        <div className="card stat" onClick={() => navigate('/packages')} style={{ cursor: 'pointer' }}>
          <div className="stat-top">
            <span className="stat-label">My Packages</span>
            <div className="stat-icon">
              <Package size={20} />
            </div>
          </div>
          <div className="stat-value">{packagesCount}</div>
          <div className="delta" style={{ color: packagesCount > 0 ? '#16a34a' : '#64748b' }}>
            {packagesCount > 0 ? `${packagesCount} packages live` : 'Bundle your services'}
          </div>
        </div>

        <div className="card stat" onClick={() => navigate('/labour')} style={{ cursor: 'pointer' }}>
          <div className="stat-top">
            <span className="stat-label">My Labour Staff</span>
            <div className="stat-icon">
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{labourCount}</div>
          <div className="delta" style={{ color: labourCount > 0 ? '#16a34a' : '#64748b' }}>
            {labourCount > 0 ? `${labourCount} staff listings live` : 'List event crew'}
          </div>
        </div>

        <div className="card stat" onClick={() => navigate('/reviews')} style={{ cursor: 'pointer' }}>
          <div className="stat-top">
            <span className="stat-label">Average rating</span>
            <div className="stat-icon">
              <Star size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.avgRating > 0 ? stats.avgRating : '5.0'}</div>
          <div className="delta">{stats.reviewsCount > 0 ? `${stats.reviewsCount} reviews` : 'Customer rating'}</div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Business Listings Hub Card */}
        <div className="card">
          <div className="card-head" style={{ flexWrap: 'wrap', gap: 10, paddingBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === 'services' ? 'var(--primary)' : '#f1f5f9',
                  color: activeTab === 'services' ? '#fff' : 'var(--text-secondary)',
                  transition: '0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Wrench size={14} /> Services ({servicesList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('packages')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === 'packages' ? 'var(--primary)' : '#f1f5f9',
                  color: activeTab === 'packages' ? '#fff' : 'var(--text-secondary)',
                  transition: '0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Package size={14} /> Packages ({packagesList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('labour')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === 'labour' ? 'var(--primary)' : '#f1f5f9',
                  color: activeTab === 'labour' ? '#fff' : 'var(--text-secondary)',
                  transition: '0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Users size={14} /> Labour Staff ({labourListings.length})
              </button>
            </div>

            <Link
              to={activeTab === 'services' ? '/services' : activeTab === 'packages' ? '/packages' : '/labour'}
              style={{
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginLeft: 'auto',
              }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div>
            {/* SERVICES TAB */}
            {activeTab === 'services' && (
              servicesList.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
                  <p style={{ margin: '0 0 14px' }}>
                    No services added yet. Add catering, decoration, photography, etc. to get customer leads.
                  </p>
                  <button className="btn btn-primary" onClick={() => navigate('/services/new')}>
                    <Plus size={15} /> Add Service
                  </button>
                </div>
              ) : (
                servicesList.slice(0, 5).map((item) => {
                  const cover = item.coverImage || item.cover_image || (Array.isArray(item.images) && item.images[0])
                  const priceDisplay = item.startingPrice || item.price
                    ? `₹${Number(item.startingPrice || item.price).toLocaleString('en-IN')}`
                    : 'Custom price'
                  const isLive = item.status === 'LIVE' || !item.status

                  return (
                    <div
                      key={item.id}
                      className="enquiry-row"
                      onClick={() => navigate('/services')}
                      style={{ cursor: 'pointer' }}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={item.title}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            objectFit: 'cover',
                            flex: '0 0 42px',
                          }}
                        />
                      ) : (
                        <div
                          className="person"
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: 16,
                          }}
                        >
                          🛠️
                        </div>
                      )}
                      <div className="enq-main">
                        <div className="enq-name" style={{ fontWeight: 700 }}>
                          {item.title || item.name}
                        </div>
                        <div className="enq-meta">
                          {item.category || 'General Service'} &middot; {priceDisplay}
                        </div>
                      </div>
                      <span className={`status ${isLive ? 'accepted' : 'declined'}`}>
                        {isLive ? 'Live' : 'Paused'}
                      </span>
                    </div>
                  )
                })
              )
            )}

            {/* PACKAGES TAB */}
            {activeTab === 'packages' && (
              packagesList.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
                  <p style={{ margin: '0 0 14px' }}>
                    No packages created yet. Bundle services into celebration packages to increase booking values.
                  </p>
                  <button className="btn btn-primary" onClick={() => navigate('/packages/new')}>
                    <Plus size={15} /> Add Package
                  </button>
                </div>
              ) : (
                packagesList.slice(0, 5).map((pkg) => {
                  const cover = pkg.coverImage || pkg.cover_image || (Array.isArray(pkg.images) && pkg.images[0])
                  const price = pkg.price ? `₹${Number(pkg.price).toLocaleString('en-IN')}` : 'Custom package'
                  const isLive = pkg.status === 'LIVE' || !pkg.status

                  return (
                    <div
                      key={pkg.id}
                      className="enquiry-row"
                      onClick={() => navigate('/packages')}
                      style={{ cursor: 'pointer' }}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={pkg.name}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            objectFit: 'cover',
                            flex: '0 0 42px',
                          }}
                        />
                      ) : (
                        <div
                          className="person"
                          style={{
                            background: '#fdf4ff',
                            color: '#9333ea',
                            fontSize: 16,
                          }}
                        >
                          📦
                        </div>
                      )}
                      <div className="enq-main">
                        <div className="enq-name" style={{ fontWeight: 700 }}>
                          {pkg.name}
                        </div>
                        <div className="enq-meta">
                          {pkg.eventType || 'All Events'} &middot; {price}
                        </div>
                      </div>
                      <span className={`status ${isLive ? 'accepted' : 'declined'}`}>
                        {isLive ? 'Live' : 'Paused'}
                      </span>
                    </div>
                  )
                })
              )
            )}

            {/* LABOUR STAFF TAB */}
            {activeTab === 'labour' && (
              labourListings.length === 0 ? (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
                  <p style={{ margin: '0 0 14px' }}>
                    No labour staff listed yet. List catering servers, cleaners, panthal riggers, or helpers to get hired.
                  </p>
                  <button className="btn btn-primary" onClick={() => navigate('/labour/new')}>
                    <Plus size={15} /> Add Labour Service
                  </button>
                </div>
              ) : (
                labourListings.map((item) => {
                  const cover = item.coverImage || item.cover_image || (Array.isArray(item.images) && item.images[0])
                  const displayPrice = item.price_display || (item.price_amount ? `₹${item.price_amount} / staff` : '₹550 / staff')
                  const isLive = item.status === 'LIVE'

                  return (
                    <div
                      key={item.id}
                      className="enquiry-row"
                      onClick={() => navigate('/labour')}
                      style={{ cursor: 'pointer' }}
                    >
                      {cover ? (
                        <img
                          src={cover}
                          alt={item.name}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 10,
                            objectFit: 'cover',
                            flex: '0 0 42px',
                          }}
                        />
                      ) : (
                        <div
                          className="person"
                          style={{
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: 14,
                          }}
                        >
                          👷
                        </div>
                      )}
                      <div className="enq-main">
                        <div className="enq-name" style={{ fontWeight: 700 }}>
                          {item.name}
                        </div>
                        <div className="enq-meta">
                          {item.type || 'Event Staff'} &middot; {displayPrice}
                        </div>
                      </div>
                      <span className={`status ${isLive ? 'accepted' : 'declined'}`}>
                        {isLive ? 'Live' : 'Paused'}
                      </span>
                    </div>
                  )
                })
              )
            )}
          </div>
        </div>

        {/* Right Side Widgets: Profile Completion & Quick Actions */}
        <div>
          <div className="card profile-progress">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="muted" style={{ fontSize: 12 }}>
                  Profile completion
                </div>
                <div className="percent">{profilePercent}%</div>
              </div>
              <div style={{ fontSize: 30 }}>🎯</div>
            </div>
            <div className="progress-wide">
              <span style={{ width: `${profilePercent}%` }}></span>
            </div>
            <div className="check-list">
              <div className={`check ${hasBiz ? 'done' : ''}`}>
                <CheckCircle2 size={14} color={hasBiz ? '#16834a' : '#94a3b8'} /> Business details
              </div>
              <div className={`check ${hasPhone ? 'done' : ''}`}>
                <CheckCircle2 size={14} color={hasPhone ? '#16834a' : '#94a3b8'} /> Contact &amp; phone
              </div>
              <div className={`check ${hasServices ? 'done' : ''}`}>
                <CheckCircle2 size={14} color={hasServices ? '#16834a' : '#94a3b8'} /> Active listings
              </div>
              <div className={`check ${hasDesc ? 'done' : ''}`}>
                <CheckCircle2 size={14} color={hasDesc ? '#16834a' : '#94a3b8'} /> About description
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 18 }}>
            <div className="card-head">
              <h3>Quick actions</h3>
            </div>
            <div className="card-body">
              <div className="shortcut-grid">
                <button className="shortcut" onClick={() => navigate('/services/new')}>
                  <div className="shortcut-icon">
                    <Plus size={24} />
                  </div>
                  <strong>Add service</strong>
                  <span>Publish a new listing</span>
                </button>

                <button className="shortcut" onClick={() => navigate('/packages/new')}>
                  <div className="shortcut-icon">
                    <Package size={24} />
                  </div>
                  <strong>Add package</strong>
                  <span>Bundle your services</span>
                </button>

                <button className="shortcut" onClick={() => navigate('/labour/new')}>
                  <div className="shortcut-icon">
                    <Users size={24} />
                  </div>
                  <strong>Add staff</strong>
                  <span>List labour services</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
