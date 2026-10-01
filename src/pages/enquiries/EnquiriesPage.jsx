import React, { useState, useEffect } from 'react'
import { providerService } from '../../services/providerService'
import { useProvider } from '../../context/ProviderContext'
import { useToast } from '../../context/ToastContext'
import {
  CheckCircle2,
  XCircle,
  Phone,
  MessageCircle,
  Calendar,
  Users,
  MapPin,
  Clock,
  RefreshCw,
  AlertCircle,
  Inbox,
} from 'lucide-react'

export const EnquiriesPage = () => {
  const { refreshProfile } = useProvider()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('New') // 'New', 'Accepted', 'Declined', 'Completed'
  const [enquiries, setEnquiries] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const res = await providerService.getEnquiries()
      setEnquiries(res.data || [])
      setSelectedIndex(0)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries()
  }, [])

  const filteredEnquiries = enquiries.filter((e) => {
    const s = e.status?.toUpperCase()
    if (activeTab === 'New') return s === 'PENDING'
    if (activeTab === 'Accepted') return s === 'ACCEPTED'
    if (activeTab === 'Declined') return s === 'DECLINED'
    if (activeTab === 'Completed') return s === 'COMPLETED'
    return true
  })

  const selectedEnquiry = filteredEnquiries[selectedIndex] || null

  const handleAccept = async (enquiryId) => {
    setActionLoading(true)
    try {
      await providerService.acceptEnquiry(enquiryId)
      showToast('Enquiry accepted! Booking created and event date reserved on your calendar.')
      await fetchEnquiries()
      refreshProfile()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to accept enquiry.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDecline = async (enquiryId) => {
    if (!window.confirm('Are you sure you want to decline this booking enquiry?')) return
    setActionLoading(true)
    try {
      await providerService.declineEnquiry(enquiryId)
      showToast('Enquiry declined.')
      await fetchEnquiries()
      refreshProfile()
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to decline enquiry.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCall = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`
    } else {
      showToast('No phone number provided.')
    }
  }

  const handleWhatsApp = (phone, name, serviceTitle) => {
    const cleanPhone = (phone || '919876543210').replace(/[^0-9]/g, '')
    const msg = encodeURIComponent(
      `Hello ${name}, thank you for your enquiry on rjpm.in regarding "${serviceTitle}". I would like to share the pricing proposal and availability.`
    )
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
  }

  const newCount = enquiries.filter((e) => e.status === 'PENDING').length

  return (
    <section id="enquiries" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Enquiries &amp; Bookings</h1>
          <p className="page-subtitle">Respond quickly so customers know their event is in good hands.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'New' ? 'active' : ''}`}
          onClick={() => { setActiveTab('New'); setSelectedIndex(0); }}
        >
          New {newCount > 0 && <b>{newCount}</b>}
        </button>
        <button
          className={`tab ${activeTab === 'Accepted' ? 'active' : ''}`}
          onClick={() => { setActiveTab('Accepted'); setSelectedIndex(0); }}
        >
          Accepted
        </button>
        <button
          className={`tab ${activeTab === 'Declined' ? 'active' : ''}`}
          onClick={() => { setActiveTab('Declined'); setSelectedIndex(0); }}
        >
          Declined
        </button>
        <button
          className={`tab ${activeTab === 'Completed' ? 'active' : ''}`}
          onClick={() => { setActiveTab('Completed'); setSelectedIndex(0); }}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          <RefreshCw size={32} className="spin-animation" style={{ margin: '0 auto 12px' }} />
          <p>Loading enquiries inbox...</p>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', borderRadius: 16 }}>
          <Inbox size={44} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>
            No {activeTab.toLowerCase()} enquiries
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
            {activeTab === 'New'
              ? 'You have responded to all recent customer enquiries! Good job.'
              : `No enquiries found in "${activeTab}" status.`}
          </p>
        </div>
      ) : (
        <div className="inbox-layout">
          {/* Left Enquiries List */}
          <div className="card inbox-list">
            {filteredEnquiries.map((enq, index) => {
              const isSelected = index === selectedIndex
              const status = enq.status?.toUpperCase()
              const statusClass =
                status === 'PENDING' ? 'new' : status === 'ACCEPTED' ? 'accepted' : 'declined'
              const serviceTitle =
                enq.service?.title || enq.package?.name || enq.eventType || 'Event Service'

              return (
                <div
                  key={enq.id}
                  className={`inbox-item ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(index)}
                >
                  <div className="inbox-top">
                    <b>{enq.customerName || 'Customer'}</b>
                    <span className={`status ${statusClass}`}>
                      {status === 'PENDING' ? 'New' : status}
                    </span>
                  </div>
                  <div className="inbox-service">{serviceTitle}</div>
                  <div className="inbox-date">
                    {enq.eventDate} &middot; {enq.guestCount ? `${enq.guestCount} guests` : 'Flexible'} &middot;{' '}
                    {enq.venueCity || 'Chennai'}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right Detail Panel */}
          {selectedEnquiry && (
            <div id="enquiryDetail" className="card detail-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <h2 className="detail-title" style={{ margin: 0 }}>
                    {selectedEnquiry.customerName || 'Customer'}
                  </h2>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                    Contact: {selectedEnquiry.customerPhone || '+91 98765 43210'}
                  </div>
                </div>

                <span
                  className={`status ${
                    selectedEnquiry.status === 'PENDING'
                      ? 'new'
                      : selectedEnquiry.status === 'ACCEPTED'
                      ? 'accepted'
                      : 'declined'
                  }`}
                  style={{ fontSize: 13, padding: '6px 12px' }}
                >
                  {selectedEnquiry.status === 'PENDING' ? 'Action Required' : selectedEnquiry.status}
                </span>
              </div>

              {/* Event Specs Box */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 12,
                  padding: 16,
                  background: '#f8fafc',
                  borderRadius: 14,
                  marginTop: 14,
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>Event Date</span>
                  <strong style={{ fontSize: 14, color: 'var(--text)' }}>
                    {selectedEnquiry.eventDate}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>Celebration</span>
                  <strong style={{ fontSize: 14, color: 'var(--text)' }}>
                    {selectedEnquiry.eventType || 'Celebration'}
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>Guest Count</span>
                  <strong style={{ fontSize: 14, color: 'var(--text)' }}>
                    {selectedEnquiry.guestCount || 150} guests
                  </strong>
                </div>

                <div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block' }}>City / Venue</span>
                  <strong style={{ fontSize: 14, color: 'var(--text)' }}>
                    {selectedEnquiry.venueCity || 'Chennai'}
                  </strong>
                </div>
              </div>

              {/* Requirements Note */}
              <div style={{ marginTop: 20 }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: 14 }}>Customer notes &amp; preferences:</h4>
                <p
                  style={{
                    color: 'var(--text-2)',
                    fontSize: 13,
                    lineHeight: 1.6,
                    background: '#fff',
                    border: '1px solid var(--border-light)',
                    padding: 14,
                    borderRadius: 10,
                  }}
                >
                  {selectedEnquiry.notes ||
                    'Customer submitted a standard enquiry request for this date. No special notes entered.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="detail-actions" style={{ marginTop: 24 }}>
                {selectedEnquiry.status === 'PENDING' ? (
                  <>
                    <button
                      className="btn btn-primary"
                      disabled={actionLoading}
                      onClick={() => handleAccept(selectedEnquiry.id)}
                    >
                      <CheckCircle2 size={16} /> {actionLoading ? 'Accepting...' : 'Accept Enquiry'}
                    </button>

                    <button
                      className="btn btn-danger"
                      disabled={actionLoading}
                      onClick={() => handleDecline(selectedEnquiry.id)}
                    >
                      <XCircle size={16} /> Decline
                    </button>
                  </>
                ) : null}

                <button
                  className="btn btn-secondary"
                  onClick={() => handleCall(selectedEnquiry.customerPhone)}
                >
                  <Phone size={15} /> Call Customer
                </button>

                <button
                  className="btn btn-secondary"
                  style={{ color: '#16834a', borderColor: '#bbf7d0', background: '#f0fdf4' }}
                  onClick={() =>
                    handleWhatsApp(
                      selectedEnquiry.customerPhone,
                      selectedEnquiry.customerName,
                      selectedEnquiry.service?.title || selectedEnquiry.package?.name || 'Event Service'
                    )
                  }
                >
                  <MessageCircle size={15} /> WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
