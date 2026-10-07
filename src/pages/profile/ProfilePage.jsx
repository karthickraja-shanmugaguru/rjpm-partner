import React, { useState, useEffect } from 'react'
import { providerService } from '../../services/providerService'
import { useProvider } from '../../context/ProviderContext'
import { useToast } from '../../context/ToastContext'
import { compressImageFile } from '../../utils/imageUtils'
import {
  Camera,
  Eye,
  CheckCircle2,
  Plus,
  X,
  Globe,
  Link as LinkIcon,
  ShieldCheck,
  Save,
  RefreshCw,
  Upload,
  Trash2,
  Award,
  Clock,
  Calendar,
  MapPin,
  Check,
  Share2,
} from 'lucide-react'

const BUSINESS_CATEGORIES = [
  'Event Planning',
  'Decoration',
  'Catering',
  'Photography',
  'Videography',
  'Mehendi',
  'Flower Decor',
  'Stage Setup',
  'Pandit/Iyer',
  'Sound & Lighting',
  'Makeup & Hair',
  'Cake',
  'Return Gifts',
  'Security',
  'Transport',
  'Labour / Event Helpers',
  'Invitations',
  'Anchor / MC',
  'Nadaswaram & Melam',
  'DJ & Music',
  'Costumes & Jewellery',
]

const PRESET_LOCALITIES = [
  'Tenkasi Road',
  'PACR Road',
  'Gandhi Kalai Mandram',
  'Malaiyadi Street',
  'Srivilliputhur Road',
  'Alagapuri',
  'Dhalavaipuram Road',
  'Mudangiar Road',
  'AMS Theatre Area',
  'All Rajapalayam Areas',
]

const RESPONSE_TIME_OPTIONS = [
  'Usually responds within 15 minutes',
  'Usually responds within 30 minutes',
  'Usually responds within 1 hour',
  'Usually responds within 2 hours',
  'Usually responds within 4 hours',
  'Usually responds within 24 hours',
]

export const ProfilePage = () => {
  const { provider, refreshProfile } = useProvider()
  const { showToast } = useToast()

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    primaryCategory: 'Event Planning',
    about: '',
    phone: '',
    whatsapp: '',
    city: 'Rajapalayam',
    yearsOfExperience: 10,
    completedEvents: 0,
    responseTime: 'Usually responds within 2 hours',
    verified: true,
  })

  const [coverImage, setCoverImage] = useState('')
  const [logoImage, setLogoImage] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    facebook: '',
    youtube: '',
    telegram: '',
    linkedin: '',
    twitter: '',
    website: '',
    other: '',
  })

  const [serviceAreas, setServiceAreas] = useState([])
  const [newAreaInput, setNewAreaInput] = useState('')
  const [showAddArea, setShowAddArea] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await providerService.getProfile()
        const p = res?.data || res
        if (p) {
          setFormData({
            businessName: p.businessName || '',
            ownerName: p.ownerName || '',
            primaryCategory: p.primaryCategory || 'Event Planning',
            about: p.about || '',
            phone: p.phone || '',
            whatsapp: p.whatsapp || p.phone || '',
            city: p.city || 'Rajapalayam',
            yearsOfExperience: p.experienceYears ?? p.yearsOfExperience ?? 10,
            completedEvents: p.completedEvents ?? 0,
            responseTime: p.responseTime || 'Usually responds within 2 hours',
            verified: p.verified !== undefined ? Boolean(p.verified) : true,
          })
          setCoverImage(p.coverImage || p.cover_image || '')
          setLogoImage(p.logoImage || p.logo_image || p.logo || '')
          if (p.socialLinks && typeof p.socialLinks === 'object') {
            setSocialLinks((prev) => ({ ...prev, ...p.socialLinks }))
          }
          if (Array.isArray(p.serviceAreas) && p.serviceAreas.length > 0) {
            setServiceAreas(p.serviceAreas.map((a) => a.areaName || a))
          }
        }
      } catch (err) {
        console.error('Error fetching latest profile:', err)
      }
    }
    fetchLatest()
  }, [])

  useEffect(() => {
    if (provider) {
      setFormData((prev) => ({
        ...prev,
        businessName: provider.businessName || prev.businessName,
        ownerName: provider.ownerName || prev.ownerName,
        primaryCategory: provider.primaryCategory || prev.primaryCategory,
        about: provider.about || prev.about,
        phone: provider.phone || prev.phone,
        whatsapp: provider.whatsapp || provider.phone || prev.whatsapp,
        city: provider.city || prev.city,
        yearsOfExperience: provider.experienceYears ?? provider.yearsOfExperience ?? prev.yearsOfExperience,
        completedEvents: provider.completedEvents ?? prev.completedEvents,
        responseTime: provider.responseTime || prev.responseTime,
        verified: provider.verified !== undefined ? Boolean(provider.verified) : prev.verified,
      }))

      if (provider.coverImage || provider.cover_image) {
        setCoverImage(provider.coverImage || provider.cover_image)
      }
      if (provider.logoImage || provider.logo_image || provider.logo) {
        setLogoImage(provider.logoImage || provider.logo_image || provider.logo)
      }

      if (provider.socialLinks && typeof provider.socialLinks === 'object') {
        setSocialLinks((prev) => ({ ...prev, ...provider.socialLinks }))
      }

      if (provider.serviceAreas && Array.isArray(provider.serviceAreas) && provider.serviceAreas.length > 0) {
        setServiceAreas(provider.serviceAreas.map((a) => a.areaName || a))
      }
    }
  }, [provider])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1400, maxHeight: 800, quality: 0.82 })
      setCoverImage(compressed)
      showToast('Cover photo ready! Click "Save changes" to persist to database.')
    } catch (err) {
      showToast('Failed to load image: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const compressed = await compressImageFile(file, { maxWidth: 500, maxHeight: 500, quality: 0.82 })
      setLogoImage(compressed)
      showToast('Profile photo ready! Click "Save changes" to persist to database.')
    } catch (err) {
      showToast('Failed to load profile photo: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSocialChange = (e) => {
    const { name, value } = e.target
    setSocialLinks((prev) => ({ ...prev, [name]: value }))
  }

  const togglePresetLocality = (loc) => {
    if (serviceAreas.includes(loc)) {
      setServiceAreas(serviceAreas.filter((a) => a !== loc))
    } else {
      setServiceAreas([...serviceAreas, loc])
    }
  }

  const handleSelectAllPresets = () => {
    const combined = Array.from(new Set([...serviceAreas, ...PRESET_LOCALITIES]))
    setServiceAreas(combined)
    showToast('All preset Chennai localities added!')
  }

  const handleClearAllLocalities = () => {
    setServiceAreas([])
  }

  const handleAddArea = () => {
    if (newAreaInput.trim() && !serviceAreas.includes(newAreaInput.trim())) {
      setServiceAreas([...serviceAreas, newAreaInput.trim()])
      setNewAreaInput('')
      setShowAddArea(false)
    }
  }

  const handleRemoveArea = (areaToRemove) => {
    setServiceAreas(serviceAreas.filter((a) => a !== areaToRemove))
  }

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...formData,
        experienceYears: Number(formData.yearsOfExperience) || 0,
        completedEvents: Number(formData.completedEvents) || 0,
        responseTime: formData.responseTime || 'Usually responds within 2 hours',
        verified: Boolean(formData.verified),
        socialLinks,
        serviceAreas,
        coverImage,
        logoImage,
        profileImage: logoImage,
      }
      await providerService.updateProfile(payload)
      showToast('Business profile and badges saved successfully!')
      if (refreshProfile) {
        await refreshProfile()
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save changes.'
      showToast(`Error: ${msg}`)
    } finally {
      setSaving(false)
    }
  }

  const handleShareProfile = async () => {
    const publicUrl = provider?.id
      ? `http://localhost:3000/providers/${provider.id}`
      : 'http://localhost:3000'
    const shareData = {
      title: formData.businessName || 'Event Service Provider on rjpm.in',
      text: `Book ${formData.businessName || 'verified event services'} on rjpm.in!`,
      url: publicUrl,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(publicUrl)
      showToast('Storefront link copied to clipboard!')
    } catch {
      showToast('Link copied!')
    }
  }

  const initials = formData.businessName
    ? formData.businessName.substring(0, 2).toUpperCase()
    : 'PV'

  return (
    <section id="profile" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Business Profile</h1>
          <p className="page-subtitle">Manage the public profile customers see on the rjpm.in marketplace.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleShareProfile}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Share2 size={16} /> Share profile
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving || uploadingImage}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Header Profile Cover & Info */}
      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <div
          className="profile-cover"
          style={{
            height: 220,
            background: coverImage
              ? `url(${coverImage}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 8, zIndex: 2 }}>
            <label
              className="btn btn-secondary"
              style={{
                cursor: 'pointer',
                margin: 0,
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Camera size={14} /> {coverImage ? 'Change cover' : 'Upload cover'}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                style={{ display: 'none' }}
              />
            </label>
            {coverImage && (
              <button
                type="button"
                className="btn btn-danger"
                style={{
                  padding: '6px 10px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => setCoverImage('')}
                title="Remove cover photo"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="profile-info" style={{ padding: '0 24px 24px', display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div
            className="logo-large"
            style={{
              width: 100,
              height: 100,
              borderRadius: 20,
              marginTop: -50,
              background: '#f1f5f9',
              color: '#1e293b',
              fontWeight: 800,
              position: 'relative',
              boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
              border: '4px solid #fff',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            {logoImage ? (
              <img src={logoImage} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
            <label
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                color: '#fff',
                fontSize: 11,
                fontWeight: 600,
                opacity: logoImage ? 0 : 0.85,
                transition: 'opacity 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = logoImage ? '0' : '0.85')}
              title="Upload profile photo / logo"
            >
              <Camera size={18} />
              <span>{logoImage ? 'Change' : 'Upload'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="profile-main" style={{ flex: 1, minWidth: 240, paddingTop: 10 }}>
            <h2 style={{ margin: '0 0 4px' }}>{formData.businessName || 'My Event Business'}</h2>
            <div className="muted">
              {formData.primaryCategory} &middot; {Number(formData.yearsOfExperience) > 0 ? `${formData.yearsOfExperience} years experience` : 'Event specialist'}
            </div>
            <div className="chips" style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="chip" style={{ background: '#dcfce7', color: '#16834a', padding: '4px 10px', borderRadius: 16, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={13} /> Active Provider
              </span>
              <span className="chip" style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 16, fontSize: 12 }}>{formData.city || 'Chennai'}</span>
              <span className="chip" style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: 16, fontSize: 12 }}>{formData.primaryCategory}</span>
            </div>
          </div>

          <div style={{ paddingTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleShareProfile}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Share2 size={15} /> Share profile
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (provider?.id) {
                  window.open(`http://localhost:3000/providers/${provider.id}`, '_blank')
                } else {
                  showToast('Customer preview opened in browser.')
                }
              }}
            >
              <Eye size={16} /> Preview as customer
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid: Business Info & Provider Trust Information */}
      <div className="detail-grid">
        {/* Business Information Form */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>Business information</h3>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Public Storefront Details</span>
          </div>
          <div className="form-grid" style={{ marginTop: 15 }}>
            <div className="field">
              <label>Business / Shop name *</label>
              <input
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field">
              <label>Owner name *</label>
              <input
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field">
              <label>Primary business category *</label>
              <select
                name="primaryCategory"
                value={formData.primaryCategory}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
                required
              >
                {BUSINESS_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Rajapalayam"
                required
              />
            </div>

            <div className="field full">
              <label>About your business</label>
              <textarea
                name="about"
                rows={4}
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Tell customers about your services, team, specialties and past events..."
              />
            </div>

            <div className="field">
              <label>Contact phone number *</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field">
              <label>WhatsApp number</label>
              <input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Provider Information & Trust Badges */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>Provider Information &amp; Badges</h3>
            <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Customer Trust Metric</span>
          </div>
          <p className="muted" style={{ fontSize: 13, margin: '0 0 16px 0' }}>
            Configure the metrics displayed in the <strong>Provider Information</strong> section on your customer storefront.
          </p>

          <div className="form-grid">
            <div className="field">
              <label>Years in Event Industry</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="yearsOfExperience"
                  type="number"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  placeholder="e.g. 10"
                />
              </div>
              <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                Displayed as: <strong>{Number(formData.yearsOfExperience) || 0}+ Years in Event Industry</strong>
              </span>
            </div>

            <div className="field">
              <label>Successful Gatherings / Completed</label>
              <input
                name="completedEvents"
                type="number"
                min="0"
                value={formData.completedEvents}
                onChange={handleInputChange}
                placeholder="e.g. 0 or 25"
              />
              <span style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                Displayed as: <strong>{Number(formData.completedEvents) || 0}+ Successful Gatherings</strong>
              </span>
            </div>

            <div className="field full">
              <label>Typical Response Time</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  name="responseTime"
                  value={RESPONSE_TIME_OPTIONS.includes(formData.responseTime) ? formData.responseTime : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setFormData((prev) => ({ ...prev, responseTime: e.target.value }))
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  {RESPONSE_TIME_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="custom">Custom response time...</option>
                </select>
              </div>
              {(!RESPONSE_TIME_OPTIONS.includes(formData.responseTime) || formData.responseTime === '') && (
                <input
                  name="responseTime"
                  value={formData.responseTime}
                  onChange={handleInputChange}
                  placeholder="e.g. Usually responds within 2 hours"
                  style={{ marginTop: 8 }}
                />
              )}
            </div>

            <div className="field full" style={{ marginTop: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.verified)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, verified: e.target.checked }))}
                  style={{ width: 18, height: 18, accentColor: '#16a34a' }}
                />
                <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>
                  Document &amp; Identity Verified Badge
                </span>
              </label>
              <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 28, display: 'block', marginTop: 2 }}>
                Show green verified seal on your public profile and service cards.
              </span>
            </div>
          </div>

          {/* Live Preview on Provider Card */}
          <div
            style={{
              marginTop: 18,
              padding: '14px 16px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
              Live Customer View Preview
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={16} color="#1a73e8" />
                <span>{Number(formData.yearsOfExperience) || 0}+ Years in Event Industry</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color={formData.verified ? '#16a34a' : '#94a3b8'} />
                <span style={{ color: formData.verified ? '#16a34a' : '#64748b' }}>
                  {formData.verified ? 'Document & Identity Verified' : 'Verification Pending'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color="#f59e0b" />
                <span>{formData.responseTime || 'Usually responds within 2 hours'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color="#1a73e8" />
                <span>{Number(formData.completedEvents) || 0}+ Successful Gatherings</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={saving} style={{ fontSize: 13, padding: '8px 18px' }}>
              <Save size={14} /> {saving ? 'Saving...' : 'Save Badges'}
            </button>
          </div>
        </div>
      </div>

      {/* Service Localities Card */}
      <div className="card" style={{ padding: 22, marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: 0 }}>Service Localities</h3>
            <p className="muted" style={{ fontSize: 13, margin: '4px 0 0 0' }}>
              Select the Rajapalayam localities you serve. Customers filter by these areas on the marketplace.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              onClick={handleSelectAllPresets}
            >
              <Check size={14} /> Select All Rajapalayam Localities
            </button>
            {serviceAreas.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: 12, padding: '6px 12px', color: '#c63d3d' }}
                onClick={handleClearAllLocalities}
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Rajapalayam Presets */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} color="#1a73e8" />
            <span>Rajapalayam Quick-Select Localities (Click to toggle):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PRESET_LOCALITIES.map((loc) => {
              const isSelected = serviceAreas.includes(loc)
              return (
                <button
                  key={loc}
                  type="button"
                  onClick={() => togglePresetLocality(loc)}
                  style={{
                    background: isSelected ? '#1f73e8' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1px solid #1f73e8' : '1px solid #cbd5e1',
                    borderRadius: 20,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: isSelected ? '0 2px 6px rgba(31, 115, 232, 0.25)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected ? <Check size={13} /> : <Plus size={13} />}
                  {loc}
                </button>
              )
            })}
          </div>
        </div>

        {/* Custom Locality Input */}
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-light, #e2e8f0)' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
            Add Other Custom Locality:
          </div>
          <div style={{ display: 'flex', gap: 8, maxWidth: 440 }}>
            <input
              type="text"
              placeholder="e.g. Nungambakkam, Guindy, Chromepet"
              value={newAreaInput}
              onChange={(e) => setNewAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddArea()
                }
              }}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                fontSize: 13,
                flex: 1,
              }}
            />
            <button className="btn btn-primary" type="button" onClick={handleAddArea} style={{ padding: '0 16px' }}>
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Selected Localities Active List */}
        <div style={{ marginTop: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
            Selected Service Localities ({serviceAreas.length}):
          </div>
          {serviceAreas.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 13, fontStyle: 'italic', padding: '6px 0' }}>
              No localities selected. Click the Chennai quick-select buttons above to add areas.
            </div>
          ) : (
            <div className="chips" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {serviceAreas.map((area) => (
                <span
                  key={area}
                  className="chip"
                  style={{
                    background: '#f1f5f9',
                    color: '#1e293b',
                    padding: '6px 12px',
                    borderRadius: 18,
                    fontSize: 12,
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <MapPin size={12} color="#1a73e8" />
                  {area}
                  <button
                    type="button"
                    onClick={() => handleRemoveArea(area)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#64748b',
                      marginLeft: 2,
                    }}
                    title={`Remove ${area}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border-light, #e2e8f0)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-primary" type="button" onClick={handleSubmit} disabled={saving} style={{ fontSize: 13, padding: '8px 18px' }}>
            <Save size={15} /> {saving ? 'Saving...' : 'Save Localities'}
          </button>
        </div>
      </div>

      {/* Social Media & Online Links Card (Requirement 21) */}
      <div className="card social-card" style={{ padding: 22 }}>
        <h3>Social media &amp; online links</h3>
        <p className="social-help">
          Add your public social profiles and website. Customers can click these links directly from your rjpm.in storefront.
        </p>

        <div className="social-grid">
          <div className="field social-field">
            <label>Instagram</label>
            <span className="social-icon">📸</span>
            <input
              type="url"
              name="instagram"
              placeholder="https://instagram.com/yourbusiness"
              value={socialLinks.instagram}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>Facebook</label>
            <span className="social-icon">f</span>
            <input
              type="url"
              name="facebook"
              placeholder="https://facebook.com/yourbusiness"
              value={socialLinks.facebook}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>YouTube</label>
            <span className="social-icon">▶</span>
            <input
              type="url"
              name="youtube"
              placeholder="https://youtube.com/@yourbusiness"
              value={socialLinks.youtube}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>Telegram</label>
            <span className="social-icon">✈️</span>
            <input
              type="url"
              name="telegram"
              placeholder="https://t.me/yourbusiness"
              value={socialLinks.telegram}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>LinkedIn</label>
            <span className="social-icon">in</span>
            <input
              type="url"
              name="linkedin"
              placeholder="https://linkedin.com/company/yourbusiness"
              value={socialLinks.linkedin}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>X (Twitter)</label>
            <span className="social-icon">𝕏</span>
            <input
              type="url"
              name="twitter"
              placeholder="https://x.com/yourbusiness"
              value={socialLinks.twitter}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>Business website</label>
            <span className="social-icon">🌐</span>
            <input
              type="url"
              name="website"
              placeholder="https://www.yourbusiness.com"
              value={socialLinks.website}
              onChange={handleSocialChange}
            />
          </div>

          <div className="field social-field">
            <label>Other social link</label>
            <span className="social-icon">🔗</span>
            <input
              type="url"
              name="other"
              placeholder="Paste any other public profile link"
              value={socialLinks.other}
              onChange={handleSocialChange}
            />
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            <Save size={16} /> Save profile &amp; social links
          </button>
        </div>
      </div>
    </section>
  )
}
