import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { compressImageFile, compressMultipleImages } from '../../utils/imageUtils'
import {
  Camera,
  ArrowLeft,
  Save,
  Sparkles,
  Upload,
  Plus,
  X,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Clock,
  Calendar,
  ShieldCheck,
  Check,
  FileText,
  Info,
} from 'lucide-react'

const SERVICE_CATEGORIES = [
  'Catering',
  'Food & Panthi Servers (Catering Staff)',
  'Kitchen Helpers & Cutters',
  'Dishwashers & Vessel Cleaners',
  'Cleaning & Housekeeping Staff',
  'Decoration',
  'Panthal & Shamiana Riggers',
  'Setup & Furniture Crew',
  'Valet Parking & Marshals',
  'Security & Bouncers',
  'Hospitality & Welcome Hosts',
  'Photography',
  'Videography',
  'Mehendi',
  'Jewellery',
  'Mandapam',
  'Music & DJ',
  'Sound, Light & Generator Crew',
  'Flower & Garland Helpers',
  'Pooja & Homam Assistants',
  'Tailoring',
  'Makeup',
  'Flowers',
  'Furniture',
  'Beauty & Spa',
  'Panthal & Tent',
  'Sweets & Desserts',
  'Water Supply',
  'Event Staff (General Workers)',
  'Priest & Rituals',
  'Invitations',
  'Transport',
]

const RAJAPALAYAM_LOCALITIES = [
  'Entire Rajapalayam',
  'Gandhi Nagar',
  'PACR Road',
  'Tenkasi Road',
  'Srivilliputhur',
  'Chattrapatti',
  'Alagappapuram',
  'Railway Feeder Road',
  'Thiruvalluvar Nagar',
  'Kollam Road',
]

const QUICK_INCLUSIONS = [
  'Complimentary consultation & planning',
  'Professional uniformed crew',
  'Complete setup & post-event cleanup',
  'On-time execution guarantee with dedicated lead',
  'All premium materials & equipment included',
  'Customized design variations',
  'Touch-up & aftercare support',
]

export const ServiceFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Catering',
    pricingType: 'STARTING_FROM',
    price: '',
    serviceAreaOverride: '',
    description: '',
    coverImage: '',
    status: 'LIVE',
    inclusions: '',
    terms: '',
    duration: '',
    setupTime: '',
    highlights: '',
    videoUrl: '',
  })
  const [pastWorkPhotos, setPastWorkPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      const loadService = async () => {
        try {
          const res = await providerService.getServices()
          const found = res.data?.find((s) => s.id === Number(id))
          if (found) {
            setFormData({
              title: found.title || found.name || '',
              category: found.category || 'Catering',
              pricingType: found.pricingType || 'STARTING_FROM',
              price: found.priceAmount || found.price || '',
              serviceAreaOverride: found.serviceAreaOverride || '',
              description: found.description || found.desc || '',
              coverImage: found.coverImage || '',
              status: found.status || 'LIVE',
              inclusions: found.inclusions || '',
              terms: found.terms || '',
              duration: found.duration || '',
              setupTime: found.setupTime || '',
              highlights: found.highlights || '',
              videoUrl: found.videoUrl || found.video_url || '',
            })
            if (Array.isArray(found.images)) {
              setPastWorkPhotos(found.images)
            }
          }
        } finally {
          setInitialLoading(false)
        }
      }
      loadService()
    }
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleLocality = (loc) => {
    setFormData((prev) => {
      const current = prev.serviceAreaOverride ? prev.serviceAreaOverride.split(',').map((s) => s.trim()).filter(Boolean) : []
      let updated = []
      if (current.includes(loc)) {
        updated = current.filter((item) => item !== loc)
      } else {
        updated = [...current, loc]
      }
      return { ...prev, serviceAreaOverride: updated.join(', ') }
    })
  }

  const handleAddInclusion = (incText) => {
    setFormData((prev) => {
      const currentLines = prev.inclusions
        ? prev.inclusions.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
        : []
      if (!currentLines.includes(incText)) {
        const nextInclusions = [...currentLines, incText].join('\n')
        return { ...prev, inclusions: nextInclusions }
      }
      return prev
    })
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const compressed = await compressImageFile(file, { maxWidth: 1400, maxHeight: 900, quality: 0.85 })
      setFormData((prev) => ({ ...prev, coverImage: compressed }))
      showToast('Cover photo uploaded successfully!')
    } catch (err) {
      showToast('Failed to process cover photo: ' + err.message)
    } finally {
      setUploadingCover(false)
    }
  }

  const handlePastWorkUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remainingSlots = 10 - pastWorkPhotos.length
    if (remainingSlots <= 0) {
      showToast('Maximum 10 past work photos allowed.')
      return
    }

    const filesToUpload = files.slice(0, remainingSlots)
    setUploadingPhotos(true)
    try {
      showToast(`Compressing & preparing ${filesToUpload.length} photo(s)...`)
      const compressedList = await compressMultipleImages(filesToUpload, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.8,
      })

      setPastWorkPhotos((prev) => [...prev, ...compressedList])
      showToast(`Added ${compressedList.length} photo(s) to gallery!`)
    } catch (err) {
      showToast('Error uploading photos: ' + err.message)
    } finally {
      setUploadingPhotos(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = (indexToRemove) => {
    setPastWorkPhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (targetStatus = 'LIVE') => {
    if (!formData.title || !formData.price) {
      showToast('Please provide a title and price.')
      return
    }

    setLoading(true)
    try {
      const priceNum = Number(formData.price) || 0
      const payload = {
        name: formData.title.trim(),
        title: formData.title.trim(),
        category: formData.category,
        pricingType: formData.pricingType,
        price: priceNum,
        priceAmount: priceNum,
        priceDisplay: `₹${priceNum.toLocaleString('en-IN')}`,
        serviceAreaOverride: formData.serviceAreaOverride,
        description: formData.description,
        coverImage: formData.coverImage,
        images: pastWorkPhotos,
        status: targetStatus,
        inclusions: formData.inclusions,
        terms: formData.terms,
        duration: formData.duration,
        setupTime: formData.setupTime,
        highlights: formData.highlights,
        videoUrl: formData.videoUrl,
      }

      if (isEdit) {
        await providerService.updateService(id, payload)
        showToast('Service updated successfully with all details!')
      } else {
        await providerService.createService(payload)
        showToast(targetStatus === 'LIVE' ? 'Service published live!' : 'Saved as draft.')
      }
      navigate('/services')
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to save service.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Loading service data...</div>
  }

  const activeLocalities = formData.serviceAreaOverride
    ? formData.serviceAreaOverride.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <section id="add-service" className="screen active" style={{ display: 'block' }}>
      <div className="section-header" style={{ marginBottom: 20 }}>
        <div>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/services')}
            style={{ marginBottom: 12, padding: '6px 12px' }}
          >
            <ArrowLeft size={14} /> {t('backToServices', 'Back to services')}
          </button>
          <h1 className="page-title">{isEdit ? t('editService', 'Edit Service') : t('createService', 'Add New Service')}</h1>
          <p className="page-subtitle">{t('createServiceSubtitle', 'Manage all service specifications, photos, deliverables, timings, and policies.')}</p>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('LIVE'); }}>
          <div className="form-grid">
            {/* Section 1: Core Information */}
            <div className="field full" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> 1. Core Service Information
              </span>
            </div>

            <div className="field full">
              <label>{t('serviceTitle', 'Service title *')}</label>
              <input
                id="serviceTitle"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Premium Bridal Mehendi & Guest Package"
                required
              />
            </div>

            <div className="field">
              <label>{t('category', 'Category *')}</label>
              <select
                id="serviceCategory"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {/staff|server|helper|clean|rigg|crew|valet|bouncer|guard|labour|worker/i.test(formData.category + ' ' + formData.title) && (
                <div
                  style={{
                    marginTop: 8,
                    padding: '8px 12px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 8,
                    fontSize: 12,
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={15} color="#16a34a" />
                  <span>
                    <strong>Event Staff & Labour:</strong> This listing will automatically appear in the <strong>Event Staff & Labour Support</strong> section on rjpm.in!
                  </span>
                </div>
              )}
            </div>

            <div className="field">
              <label>{t('pricingType', 'Pricing type *')}</label>
              <select
                name="pricingType"
                value={formData.pricingType}
                onChange={handleChange}
              >
                <option value="STARTING_FROM">{t('startingFrom', 'Starting from')}</option>
                <option value="FIXED">{t('fixedPrice', 'Fixed price')}</option>
                <option value="PER_STAFF">{t('perStaff', 'Per staff / worker')}</option>
                <option value="PER_PLATE">{t('perPlate', 'Per plate')}</option>
                <option value="PER_DAY">{t('perDay', 'Per day')}</option>
              </select>
            </div>

            <div className="field">
              <label>{t('price', 'Amount (₹) *')}</label>
              <input
                id="servicePrice"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 350 or 25000"
                required
              />
            </div>

            {/* Service Area with Rajapalayam Quick-Select Localities */}
            <div className="field full">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={15} color="var(--primary)" /> Service Area & Coverage
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
                  Areas where this service is provided
                </span>
              </label>
              <input
                name="serviceAreaOverride"
                value={formData.serviceAreaOverride}
                onChange={handleChange}
                placeholder="e.g. Entire Rajapalayam, PACR Road, Tenkasi Road"
              />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>
                  Quick-select Rajapalayam Localities:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {RAJAPALAYAM_LOCALITIES.map((loc) => {
                    const isSelected = activeLocalities.includes(loc)
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleToggleLocality(loc)}
                        style={{
                          background: isSelected ? 'var(--primary, #1a73e8)' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : 'var(--text)',
                          border: isSelected ? '1px solid var(--primary, #1a73e8)' : '1px solid #e2e8f0',
                          padding: '4px 10px',
                          borderRadius: 14,
                          fontSize: 12,
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {isSelected && <Check size={12} />}
                        {loc}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Section 2: Photos */}
            <div className="field full" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginTop: 14, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Camera size={16} /> 2. Photos & Gallery
              </span>
            </div>

            {/* Service Cover Photo */}
            <div className="field full">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span>Cover photo</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>Main portrait (4:5) image shown on cards</span>
              </label>

              {formData.coverImage ? (
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 14,
                    overflow: 'hidden',
                    height: 220,
                    backgroundImage: `url(${formData.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '1px solid var(--border-light, #e2e8f0)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <label
                      className="btn btn-secondary"
                      style={{
                        cursor: 'pointer',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(6px)',
                        padding: '6px 12px',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <Camera size={13} /> Change photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ padding: '6px 10px', fontSize: 12, background: 'rgba(239, 68, 68, 0.9)' }}
                      onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                      title="Remove cover photo"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: '2px dashed var(--border, #cbd5e1)',
                    borderRadius: 14,
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: '#e0e7ff',
                      color: 'var(--primary, #4f46e5)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Upload size={20} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Upload service cover photo</div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0, maxWidth: 360 }}>
                    Select an attractive photo from your device. It will be compressed and stored directly in the database.
                  </p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <label
                      className="btn btn-primary"
                      style={{ cursor: 'pointer', margin: 0, padding: '7px 16px', fontSize: 13 }}
                    >
                      <Upload size={14} /> {uploadingCover ? 'Processing...' : 'Browse file'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={uploadingCover}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Past Work Photos */}
            <div className="field full">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <ImageIcon size={15} color="var(--primary)" /> Past work photos ({pastWorkPhotos.length}/10)
                </span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
                  Shown in the interactive gallery &amp; lightbox
                </span>
              </label>

              {pastWorkPhotos.length === 0 ? (
                <div
                  style={{
                    border: '2px dashed var(--border, #cbd5e1)',
                    borderRadius: 14,
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <ImageIcon size={28} color="#94a3b8" />
                  <div style={{ fontWeight: 600, fontSize: 14 }}>No past work photos uploaded yet</div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0, maxWidth: 380 }}>
                    Upload up to 10 photos of your past setups, work, or client photos.
                  </p>
                  <label
                    className="btn btn-outline"
                    style={{ cursor: 'pointer', margin: '4px 0 0 0', padding: '7px 16px', fontSize: 13 }}
                  >
                    <Plus size={14} /> {uploadingPhotos ? 'Processing...' : 'Add photos'}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePastWorkUpload}
                      disabled={uploadingPhotos}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                    gap: 12,
                    padding: '12px',
                    background: '#f8fafc',
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {pastWorkPhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        aspectRatio: '4 / 5',
                        borderRadius: 10,
                        overflow: 'hidden',
                        backgroundImage: `url(${photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          background: 'rgba(0,0,0,0.65)',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 6,
                        }}
                      >
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        style={{
                          position: 'absolute',
                          top: 6,
                          right: 6,
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {pastWorkPhotos.length < 10 && (
                    <label
                      style={{
                        border: '2px dashed #cbd5e1',
                        borderRadius: 10,
                        aspectRatio: '4 / 5',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        color: '#64748b',
                        background: '#f8fafc',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary, #1a73e8)'
                        e.currentTarget.style.color = 'var(--primary, #1a73e8)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1'
                        e.currentTarget.style.color = '#64748b'
                      }}
                    >
                      <Plus size={20} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Add more</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePastWorkUpload}
                        disabled={uploadingPhotos}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* Section 3: Overview & Description */}
            <div className="field full" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginTop: 14, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FileText size={16} /> 3. Service Overview &amp; Description
              </span>
            </div>

            <div className="field full">
              <label>Detailed Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your service in detail: styles offered, premium materials or instruments used, experience, customization options, and client assurances..."
              />
            </div>

            {/* Section 4: What's Included */}
            <div className="field full" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginTop: 14, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={16} color="#16a34a" /> 4. What's Included (Deliverables Checklist)
              </span>
            </div>

            <div className="field full">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Inclusions (One per line)</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
                  Each line appears as a verified checkmark on the customer listing
                </span>
              </label>
              <textarea
                name="inclusions"
                rows={5}
                value={formData.inclusions}
                onChange={handleChange}
                placeholder={`Bridal Mehendi for both hands & feet\nPremium organic dark stain henna cones\nComplimentary simple design for 2 family members\nComplete on-site setup and post-event cleanup\nOn-time execution guarantee with dedicated lead`}
              />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>
                  Click to add quick inclusion suggestions:
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {QUICK_INCLUSIONS.map((inc) => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => handleAddInclusion(inc)}
                      style={{
                        background: '#f1f5f9',
                        color: 'var(--text)',
                        border: '1px solid #cbd5e1',
                        padding: '4px 10px',
                        borderRadius: 14,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e2e8f0'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f1f5f9'
                      }}
                    >
                      <Plus size={11} color="var(--primary)" /> {inc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Timing & Policies */}
            <div className="field full" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginTop: 14, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Clock size={16} /> 5. Timing, Execution &amp; Booking Terms
              </span>
            </div>

            <div className="field">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Clock size={14} color="var(--primary)" /> Service Duration
              </label>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 2 - 4 hours, Full Day, or Per session"
              />
            </div>

            <div className="field">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <Calendar size={14} color="var(--primary)" /> Setup / Arrival Time
              </label>
              <input
                name="setupTime"
                value={formData.setupTime}
                onChange={handleChange}
                placeholder="e.g. 1 hour prior to event, Day before"
              />
            </div>

            <div className="field full">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <ShieldCheck size={14} color="#16a34a" /> Advance Payment &amp; Cancellation Policy
              </label>
              <textarea
                name="terms"
                rows={3}
                value={formData.terms}
                onChange={handleChange}
                placeholder="e.g. 20% advance required to confirm booking date. Balance payable upon completion. Free cancellation/reschedule up to 48 hours prior."
              />
            </div>

            {/* Section 6: Video & Social Showcase */}
            <div className="field full" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginTop: 14, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} /> 6. Showcase Video &amp; Social Links
              </span>
            </div>

            <div className="field full">
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Service Video / YouTube / Instagram Reel URL</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>Optional showcase link</span>
              </label>
              <input
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                placeholder="e.g. https://www.youtube.com/watch?v=... or Instagram reel"
              />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                Customers can watch this video directly from your service page. Your provider business channel links are also automatically displayed.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 26, paddingTop: 16, borderTop: '1px solid #f1f5f9' }}>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={loading || uploadingPhotos || uploadingCover}
              onClick={() => handleSubmit('DRAFT')}
            >
              {t('saveAsDraft', 'Save as draft')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploadingPhotos || uploadingCover}
            >
              <Sparkles size={16} /> {loading ? t('loading', 'Saving...') : isEdit ? t('updateService', 'Update Service') : t('publishService', 'Publish Service')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
