import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  ArrowLeft,
  Check,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  Plus,
  X,
  Image as ImageIcon,
  Clock,
  CalendarClock,
  AlertCircle,
  CheckSquare,
  XCircle,
  ShieldCheck,
  FileText,
  SlidersHorizontal,
} from 'lucide-react'
import { compressImageFile, compressMultipleImages } from '../../utils/imageUtils'

const EVENT_TYPES = [
  'Wedding',
  'Birthday',
  'Reception',
  'Engagement',
  'Housewarming',
  'Baby Shower',
  'Anniversary',
  'Corporate',
]

export const PackageFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: '',
    eventType: 'Wedding',
    pricingType: 'STARTING_FROM',
    price: '',
    guestCapacity: '',
    duration: '',
    setupTime: '',
    advanceNotice: '',
    customizable: true,
    coverImage: '',
    description: '',
    inclusions: '',
    exclusions: '',
    highlights: '',
    terms: '',
    status: 'LIVE',
  })

  const [referencePhotos, setReferencePhotos] = useState([])
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [existingServices, setExistingServices] = useState([])
  const [selectedServiceIds, setSelectedServiceIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, packagesRes] = await Promise.all([
          providerService.getServices(),
          isEdit ? providerService.getPackages() : Promise.resolve({ data: [] }),
        ])

        setExistingServices(servicesRes.data || [])

        if (isEdit) {
          const pkg = packagesRes.data?.find((p) => p.id === Number(id))
          if (pkg) {
            setFormData({
              name: pkg.name || '',
              eventType: pkg.eventType || pkg.type || 'Wedding',
              pricingType: pkg.pricingType || 'STARTING_FROM',
              price: pkg.priceAmount || (typeof pkg.price === 'string' ? pkg.price.replace(/[^0-9.]/g, '') : pkg.price) || '',
              guestCapacity: String(pkg.guestCapacity || pkg.guests || '').replace(/[^0-9]/g, '') || '',
              duration: pkg.duration || '',
              setupTime: pkg.setupTime || pkg.setup_time || '',
              advanceNotice: pkg.advanceNotice || pkg.advance_notice || '',
              customizable: pkg.customizable !== undefined ? Boolean(pkg.customizable) : true,
              coverImage: pkg.coverImage || '',
              description: pkg.description || '',
              inclusions: typeof pkg.inclusions === 'string' ? pkg.inclusions : (Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : ''),
              exclusions: typeof pkg.exclusions === 'string' ? pkg.exclusions : (Array.isArray(pkg.exclusions) ? pkg.exclusions.join('\n') : ''),
              highlights: typeof pkg.highlights === 'string' ? pkg.highlights : (Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : ''),
              terms: pkg.terms || '',
              status: pkg.status || 'LIVE',
            })
            if (pkg.services) {
              setSelectedServiceIds(pkg.services.map((s) => (typeof s === 'object' ? s.id : s)))
            }
            if (Array.isArray(pkg.images)) {
              setReferencePhotos(pkg.images)
            }
          }
        }
      } finally {
        setInitialLoading(false)
      }
    }
    loadData()
  }, [id, isEdit])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((i) => i !== serviceId) : [...prev, serviceId]
    )
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
      e.target.value = ''
    }
  }

  const handleReferencePhotosUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remainingSlots = 10 - referencePhotos.length
    if (remainingSlots <= 0) {
      showToast('You have already added the maximum 10 reference photos.')
      return
    }

    const filesToProcess = files.slice(0, remainingSlots)
    if (files.length > remainingSlots) {
      showToast(`Only adding ${remainingSlots} photos (maximum limit is 10 photos).`)
    }

    setUploadingPhotos(true)
    try {
      const compressedList = await compressMultipleImages(filesToProcess, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.82,
      })
      setReferencePhotos((prev) => [...prev, ...compressedList].slice(0, 10))
      showToast(`Added ${compressedList.length} reference photo(s).`)
    } catch (err) {
      showToast('Error uploading photos: ' + err.message)
    } finally {
      setUploadingPhotos(false)
      e.target.value = ''
    }
  }

  const handleRemovePhoto = (indexToRemove) => {
    setReferencePhotos((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleSubmit = async (targetStatus = 'LIVE') => {
    if (!formData.name || !formData.price) {
      showToast('Please provide a package name and price.')
      return
    }

    setLoading(true)
    try {
      const priceNum = Number(formData.price) || 0
      const payload = {
        ...formData,
        name: formData.name.trim(),
        type: formData.eventType,
        eventType: formData.eventType,
        pricingType: formData.pricingType,
        price: priceNum,
        priceDisplay: priceNum > 0 ? `₹${priceNum.toLocaleString('en-IN')}` : 'Price on request',
        guests: formData.guestCapacity ? `${formData.guestCapacity} guests` : 'Capacity on request',
        guestCapacity: formData.guestCapacity ? Number(formData.guestCapacity) : null,
        duration: (formData.duration || '').trim(),
        setupTime: (formData.setupTime || '').trim(),
        advanceNotice: (formData.advanceNotice || '').trim(),
        customizable: Boolean(formData.customizable),
        description: (formData.description || '').trim(),
        inclusions: (formData.inclusions || '').trim(),
        exclusions: (formData.exclusions || '').trim(),
        highlights: (formData.highlights || '').trim(),
        terms: (formData.terms || '').trim(),
        serviceIds: selectedServiceIds,
        services: selectedServiceIds,
        coverImage: formData.coverImage || null,
        images: referencePhotos,
        status: targetStatus,
      }

      if (isEdit) {
        await providerService.updatePackage(id, payload)
        showToast('Package updated successfully!')
      } else {
        await providerService.createPackage(payload)
        showToast('Package published live!')
      }
      navigate('/packages')
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to save package.')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Loading package data...</div>
  }

  return (
    <section id="add-package" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/packages')}
            style={{ marginBottom: 12, padding: '6px 12px' }}
          >
            <ArrowLeft size={14} /> {t('cancel', 'Cancel')}
          </button>
          <h1 className="page-title">{isEdit ? t('editPackage', 'Edit Package') : t('createPackage', 'Create Package')}</h1>
          <p className="page-subtitle">{t('packageSubtitle', 'Bundle your existing services and specifications into one turnkey celebration package.')}</p>
        </div>
      </div>

      <div className="card form-card">
        <div className="package-form-note">
          💡 <b>Turnkey Package Setup:</b> Provide clear specifications, inclusions, duration, and photos so customers in RJPM get complete clarity before inquiring.
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('LIVE'); }}>
          <div className="form-grid" style={{ marginTop: 18 }}>
            {/* Section 1: Basic Information */}
            <div className="field full">
              <label>{t('packageName', 'Package name *')}</label>
              <input
                id="packageName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Complete Grand Wedding Package"
                required
              />
            </div>

            <div className="field">
              <label>{t('eventType', 'Event type *')}</label>
              <select
                id="packageType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
              >
                {EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>{t('packagePricing', 'Package pricing *')}</label>
              <select
                name="pricingType"
                value={formData.pricingType}
                onChange={handleChange}
              >
                <option value="STARTING_FROM">{t('startingFrom', 'Starting from')}</option>
                <option value="FIXED">{t('fixedPrice', 'Fixed package price')}</option>
                <option value="PER_GUEST">{t('perPlate', 'Per guest')}</option>
              </select>
            </div>

            <div className="field">
              <label>{t('packagePrice', 'Package price (₹) *')}</label>
              <input
                id="packagePrice"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 150000"
                required
              />
            </div>

            <div className="field">
              <label>{t('guestCapacity', 'Guest capacity (guests)')}</label>
              <input
                id="packageGuests"
                name="guestCapacity"
                type="number"
                value={formData.guestCapacity}
                onChange={handleChange}
                placeholder="e.g. 500"
              />
            </div>

            {/* Section 2: Timing, Logistics & Flexibility */}
            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Clock size={15} color="var(--primary)" /> Event Duration Covered
              </label>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. Full Day (8 - 10 hours), 6 Hours, 2 Days"
              />
            </div>

            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CalendarClock size={15} color="#0891b2" /> Setup Time Required
              </label>
              <input
                name="setupTime"
                value={formData.setupTime}
                onChange={handleChange}
                placeholder="e.g. 3 hours prior to muhurtham / event"
              />
            </div>

            <div className="field">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={15} color="#d97706" /> Advance Booking Notice
              </label>
              <input
                name="advanceNotice"
                value={formData.advanceNotice}
                onChange={handleChange}
                placeholder="e.g. Book at least 5 days in advance"
              />
            </div>

            <div className="field" style={{ display: 'flex', alignItems: 'center', paddingTop: 26 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  name="customizable"
                  checked={Boolean(formData.customizable)}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customizable: e.target.checked }))}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text)' }}>
                  ✨ 100% Customizable Package (Allow clients to request adjustments)
                </span>
              </label>
            </div>

            {/* Section 3: Detailed Inclusions & Exclusions */}
            <div className="field full" style={{ marginTop: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
                <CheckSquare size={16} color="#16a34a" /> What&apos;s Included in this Package (Key Inclusions)
              </label>
              <p style={{ color: 'var(--muted)', fontSize: 12, margin: '2px 0 8px' }}>
                Enter each included item or specification on a new line (customers will see these as a bulleted checklist).
              </p>
              <textarea
                name="inclusions"
                rows={5}
                value={formData.inclusions}
                onChange={handleChange}
                placeholder={`Grand 20ft Stage Floral Backdrop with Traditional Jasmine & Orchids\nTraditional Mandapam Decor with Brass Kuthuvilakku & Banana Trees\nWelcome Entrance Arch & Pathway Flower Pillars\n2 Dedicated Candid & Traditional Photographers (Full Day)\nFull HD Cinematic Video Coverage with Teaser Highlight\nProfessional Sound System with 4 Wireless Microphones\nBride & Groom Royal Varmala Garlands (2 Sets)\nWelcome Drinks & Traditional Tamboolam Bags Setup`}
                style={{ fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            <div className="field full" style={{ marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
                <XCircle size={16} color="#dc2626" /> What&apos;s NOT Included (Exclusions / Extra Charges)
              </label>
              <p style={{ color: 'var(--muted)', fontSize: 12, margin: '2px 0 8px' }}>
                State any excluded items or optional add-ons (one per line) to maintain complete trust and transparency.
              </p>
              <textarea
                name="exclusions"
                rows={3}
                value={formData.exclusions}
                onChange={handleChange}
                placeholder={`Generator fuel charges (arranged at actuals if needed)\nTransportation outside RJPM city limits (nominal mileage charge)\nDrone photography permit and coverage (available as optional add-on)\nSpecial orchestra / melam troupe (available on request)`}
                style={{ fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            <div className="field full" style={{ marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 14 }}>
                <Sparkles size={16} color="#f59e0b" /> Key Highlights & Selling Points
              </label>
              <p style={{ color: 'var(--muted)', fontSize: 12, margin: '2px 0 8px' }}>
                Short selling badges displayed as prominent highlights (one per line).
              </p>
              <textarea
                name="highlights"
                rows={3}
                value={formData.highlights}
                onChange={handleChange}
                placeholder={`Dedicated On-Ground Event Coordinator\nPre-event Planning & Coordination Session\nComplete Setup & Post-Event Clean-up\n100% On-time Guarantee`}
                style={{ fontFamily: 'inherit', fontSize: 13.5, lineHeight: 1.6 }}
              />
            </div>

            {/* Section 4: Package Cover Photo Upload */}
            <div className="field full" style={{ marginTop: 12, marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <ImageIcon size={16} /> {t('packageCoverImage', 'Package Cover Image')}
              </label>

              {formData.coverImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 220,
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '1px solid var(--border, #e2e8f0)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    background: '#000',
                  }}
                >
                  <img
                    src={formData.coverImage}
                    alt="Package cover preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
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
                      <Camera size={13} /> Change cover
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
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Upload package cover photo</div>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0, maxWidth: 380 }}>
                    Select an eye-catching photo showing the complete setup. It will be compressed and stored directly in the database.
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
                  <div style={{ width: '100%', maxWidth: 440, marginTop: 10 }}>
                    <input
                      name="coverImage"
                      value={formData.coverImage}
                      onChange={handleChange}
                      placeholder="Or paste an image URL here..."
                      style={{ fontSize: 12, padding: '6px 12px' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Reference Photos Section (Up to 10 photos) */}
            <div className="field full" style={{ marginTop: 10, marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <label style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>
                    {t('referencePhotos', 'Reference & past work photos')} ({referencePhotos.length}/10)
                  </label>
                  <p style={{ color: 'var(--muted)', fontSize: 12, margin: '2px 0 0' }}>
                    {t('referencePhotosSubtitle', 'Upload up to 10 real event photos or reference setups included in this package.')}
                  </p>
                </div>
                {referencePhotos.length < 10 && (
                  <label
                    className="btn btn-secondary"
                    style={{
                      cursor: 'pointer',
                      margin: 0,
                      padding: '6px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Plus size={14} /> {t('addPhotos', 'Add photos')}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleReferencePhotosUpload}
                      disabled={uploadingPhotos}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {uploadingPhotos && (
                <div style={{ padding: '8px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: 8, fontSize: 12, marginBottom: 10 }}>
                  Optimizing and uploading selected photos...
                </div>
              )}

              {referencePhotos.length === 0 ? (
                <div
                  style={{
                    border: '1px dashed var(--border, #cbd5e1)',
                    borderRadius: 12,
                    padding: '24px 16px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    color: 'var(--muted)',
                    fontSize: 13,
                  }}
                >
                  <ImageIcon size={24} style={{ opacity: 0.5, margin: '0 auto 6px', display: 'block' }} />
                  No reference photos uploaded yet. Click <b>&quot;Add photos&quot;</b> above to upload up to 10 reference images.
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  {referencePhotos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        aspectRatio: '4 / 5',
                        borderRadius: 10,
                        overflow: 'hidden',
                        border: '1px solid var(--border, #e2e8f0)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        background: '#f1f5f9',
                      }}
                    >
                      <img
                        src={photoUrl}
                        alt={`Reference ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'grid',
                          placeItems: 'center',
                          padding: 0,
                        }}
                        title="Remove photo"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          padding: '2px 6px',
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      >
                        #{idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 5: Description & Terms */}
            <div className="field full">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileText size={15} /> Package Overview & Description
              </label>
              <textarea
                id="packageDescription"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain what customers get with this package (food choices, decoration theme, stage setup, audio setup)..."
              />
            </div>

            <div className="field full">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={15} color="#2563eb" /> Booking & Cancellation Terms
              </label>
              <textarea
                name="terms"
                rows={3}
                value={formData.terms}
                onChange={handleChange}
                placeholder={`20% advance booking deposit to lock calendar date.\n50% on event day setup inspection.\nRemaining 30% upon final delivery of photos & digital album.\nFree date rescheduling if informed at least 7 days prior.`}
              />
            </div>
          </div>

          {/* Section 6: Service Selector from existing provider services */}
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 4 }}>Select services included in this package (Optional)</h3>
            <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
              Optionally check any individual services from your catalog that are bundled into this offering.
            </p>

            {existingServices.length === 0 ? (
              <div
                style={{
                  padding: 14,
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: 10,
                  color: 'var(--muted)',
                  fontSize: 13,
                  marginTop: 10,
                }}
              >
                No individual services added yet in &quot;My Services&quot;. You can still create and publish standalone celebration packages.
              </div>
            ) : (
              <div
                id="packageServiceSelector"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 10,
                  marginTop: 12,
                }}
              >
                {existingServices.map((svc) => {
                  const isChecked = selectedServiceIds.includes(svc.id)
                  return (
                    <div
                      key={svc.id}
                      onClick={() => handleToggleService(svc.id)}
                      className="package-selected-service"
                      style={{
                        cursor: 'pointer',
                        borderColor: isChecked ? 'var(--primary)' : 'var(--border)',
                        background: isChecked ? '#f8fbff' : '#fff',
                        transition: '0.15s',
                      }}
                    >
                      <label style={{ cursor: 'pointer', pointerEvents: 'none' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          readOnly
                        />
                        <div>
                          <span style={{ display: 'block', fontWeight: 700, color: 'var(--text)' }}>
                            {svc.title}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                            {svc.category} &middot; ₹{Number(svc.price).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </label>
                      {isChecked && <Check size={16} color="var(--primary)" />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="package-form-preview" style={{ marginTop: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Selected catalog services</div>
            <div id="selectedPackageServices" style={{ fontWeight: 800, marginTop: 5 }}>
              {selectedServiceIds.length} services bundled
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => handleSubmit('DRAFT')}
            >
              {t('saveAsDraft', 'Save as draft')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Sparkles size={16} /> {loading ? t('loading', 'Saving...') : isEdit ? t('updatePackage', 'Update Package') : t('publishPackage', 'Publish Package')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default PackageFormPage
