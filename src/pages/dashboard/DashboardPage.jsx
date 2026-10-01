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
  const [labourListings, setLabourListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const [dashRes, labourRes, pkgRes] = await Promise.all([
          providerService.getDashboard().catch(() => null),
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
        if (labourRes && labourRes.data) {
          setLabourListings(labourRes.data)
        }
        if (pkgRes && pkgRes.data) {
          setPackagesCount(Array.isArray(pkgRes.data) ? pkgRes.data.length : 0)
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
        {/* Labour Staff Overview Card */}
        <div className="card">
          <div className="card-head">
            <h3>My Labour Staff</h3>
            <Link
              to="/labour"
              style={{
                border: 0,
                background: 'none',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: 13,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              View all <ChevronRight size={14} />
            </Link>
          </div>

          <div>
            {labourListings.length === 0 ? (
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
