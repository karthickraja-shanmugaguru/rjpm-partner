import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import { useLanguage } from '../../context/LanguageContext'
import { compressImageFile, compressMultipleImages } from '../../utils/imageUtils'
import {
  ArrowLeft,
  Users,
  Save,
  CheckCircle2,
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Plus,
  Info,
} from 'lucide-react'

const LABOUR_ROLE_TEMPLATES = [
  {
    type: 'Food & Panthi Servers',
    name: 'Traditional Panthi & Buffet Food Servers',
    price: 550,
    details: 'Trained in traditional banana-leaf panthi serving sequence (salt, sweet, kootu, poriyal, rice, sambar, rasam, payasam) in spotless clean uniforms.',
  },
  {
    type: 'Kitchen Helpers & Cutters',
    name: 'Vegetable Cutters & Kitchen Assistants',
    price: 500,
    details: 'Fast, hygienic chopping for bulk weddings (50kg+ vegetables), grinding, coconut grating, and cooking assistant support.',
  },
  {
    type: 'Dishwashers & Vessel Cleaners',
    name: 'Heavy Catering Boiler & Vessel Cleaners',
    price: 600,
    details: 'Skilled in washing large catering vessels, brass boilers, steel dinner plates, and silver dining sets with hot water sanitization.',
  },
  {
    type: 'Cleaning Staff',
    name: 'Dining Hall & Mandapam Cleaners',
    price: 450,
    details: 'Continuous dining table wiping, banana leaf disposal, floor mopping between panthi batches, and post-event waste clearing.',
  },
  {
    type: 'Panthal & Shamiana Riggers',
    name: 'Heavy Pandal & Bamboo Rigging Crew',
    price: 750,
    details: 'Experienced pandal rigging team for high-rise bamboo frames, waterproof German shamianas, and fabric ceiling draping.',
  },
  {
    type: 'Setup & Furniture Crew',
    name: 'Banquet Furniture & Stage Setup Crew',
    price: 550,
    details: 'Rapid unloading and arrangement of 500+ banquet chairs, round dining tables, sofa sets, VIP seating, and stage carpets.',
  },
  {
    type: 'Valet Parking & Marshals',
    name: 'Uniformed Valet Parking Drivers',
    price: 700,
    details: 'Licensed, courteous drivers with parking token systems, safe car parking, and traffic marshals to avoid mandapam congestion.',
  },
  {
    type: 'Security & Bouncers',
    name: 'Certified Bouncers & Event Security Guards',
    price: 950,
    details: 'Professional bouncers and security personnel for gate entry control, VIP crowd handling, and valuable gift counter security.',
  },
]

const LABOUR_CATEGORIES = [
  'Food & Panthi Servers',
  'Kitchen Helpers & Cutters',
  'Dishwashers & Vessel Cleaners',
  'Cleaning Staff',
  'Panthal & Shamiana Riggers',
  'Setup & Furniture Crew',
  'Valet Parking & Marshals',
  'Security & Bouncers',
  'Hospitality & Thamboolam Staff',
  'Luggage & Room Attendants',
  'Sound, Light & Generator Crew',
  'Flower & Garland Helpers',
  'Pooja & Homam Assistants',
]

export const LabourStaffFormPage = () => {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { t } = useLanguage()

  const [formData, setFormData] = useState({
    name: '',
    type: 'Food & Panthi Servers',
    priceAmount: 550,
    priceDisplay: 'From ₹550 / staff',
    details: '',
    coverImage: '',
    status: 'LIVE',
  })
  const [pastWorkPhotos, setPastWorkPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [initialLoading, setInitialLoading] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      providerService
        .getLabourListings()
        .then((res) => {
          const item = (res.data || []).find((l) => String(l.id) === String(id))
          if (item) {
            setFormData({
              name: item.name || '',
              type: item.type || 'Food & Panthi Servers',
              priceAmount: item.price_amount || 550,
              priceDisplay: item.price_display || `From ₹${item.price_amount || 550} / staff`,
              details: item.details || '',
              coverImage: item.coverImage || item.cover_image || '',
              status: item.status || 'LIVE',
            })
            if (Array.isArray(item.images)) {
              setPastWorkPhotos(item.images)
            }
          }
        })
        .finally(() => setInitialLoading(false))
    }
  }, [id, isEdit])

  const handleApplyTemplate = (tmpl) => {
    setFormData((prev) => ({
      ...prev,
      type: tmpl.type,
      name: tmpl.name,
      priceAmount: tmpl.price,
      priceDisplay: `From ₹${tmpl.price} / staff`,
      details: tmpl.details,
    }))
    showToast(`Template applied: ${tmpl.name}`)
  }

  const handlePriceChange = (val) => {
    const num = parseFloat(val) || 0
    setFormData((prev) => ({
      ...prev,
      priceAmount: val,
      priceDisplay: num > 0 ? `From ₹${num} / staff` : '',
    }))
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

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    const remainingSlots = 10 - pastWorkPhotos.length
    if (remainingSlots <= 0) {
      showToast('Maximum 10 work photos allowed.')
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
      showToast(`Added ${compressedList.length} photo(s) to staff gallery!`)
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
    if (!formData.name.trim()) {
      showToast('Please enter the staff role / service name')
      return
    }

    try {
      setLoading(true)
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        priceAmount: Number(formData.priceAmount) || 0,
        priceDisplay: formData.priceDisplay.trim() || `From ₹${formData.priceAmount} / staff`,
        details: formData.details.trim(),
        coverImage: formData.coverImage,
        images: pastWorkPhotos,
        status: targetStatus,
      }

      if (isEdit) {
        await providerService.updateLabourListing(id, payload)
        showToast('Labour service updated successfully!')
      } else {
        await providerService.createLabourListing(payload)
        showToast('Labour service published successfully to rjpm.in!')
      }
      navigate('/labour')
    } catch (err) {
      console.error(err)
      showToast(err.response?.data?.message || 'Failed to save labour service')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Loading staff details...</div>
  }

  return (
    <section id="labourForm" className="screen active" style={{ display: 'block' }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate('/labour')}
        style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <ArrowLeft size={16} /> {t('backToLabour', 'Back to Labour Staff')}
      </button>

      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
          {isEdit ? 'Edit Labour / Staff Service' : 'Add Labour / Staff Service'}
        </h1>
        <p className="page-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--muted)', fontSize: 14 }}>
          {isEdit
            ? 'Update the rates, photos, or details of your event staff listing.'
            : 'List your trained workers, servers, helpers, or crew for event hosts to hire in Rajapalayam.'}
        </p>
      </div>

      {/* Quick Role Templates (Only on Create) */}
      {!isEdit && (
        <div className="card" style={{ marginBottom: 24, background: '#f8fafc' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Users size={16} color="var(--primary)" /> Quick-Fill from Popular Staff Roles:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LABOUR_ROLE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                className="btn btn-outline"
                style={{ fontSize: 12, padding: '6px 12px', borderRadius: 20, background: '#ffffff' }}
                onClick={() => handleApplyTemplate(tmpl)}
              >
                + {tmpl.name.split('&')[0].trim()} (₹{tmpl.price})
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData.status || 'LIVE'); }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Section 1: Basic Information */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Users size={17} /> 1. Staff Role &amp; Pricing
            </span>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Staff Category Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                {LABOUR_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Staff Role / Service Title *</label>
              <input
                type="text"
                placeholder="e.g. Traditional Panthi & Buffet Food Servers"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="field">
              <label>Daily Rate (₹ per staff / worker) *</label>
              <input
                type="number"
                placeholder="e.g. 550"
                value={formData.priceAmount}
                onChange={(e) => handlePriceChange(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Display Price Text</label>
              <input
                type="text"
                placeholder="e.g. From ₹550 / staff"
                value={formData.priceDisplay}
                onChange={(e) => setFormData({ ...formData, priceDisplay: e.target.value })}
              />
            </div>
          </div>

          {/* Section 2: Photos (Cover + 10 Work Photos) */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginTop: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Camera size={17} /> 2. Photos &amp; Staff Gallery
            </span>
          </div>

          {/* Cover Photo */}
          <div className="field full">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span>Staff Cover photo</span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>Main image shown on customer labour cards</span>
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
                <div style={{ fontWeight: 600, fontSize: 14 }}>Upload staff cover photo</div>
                <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0, maxWidth: 360 }}>
                  Upload a photo of your staff in uniform or working at an event.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
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

          {/* Up to 10 Past Work Photos */}
          <div className="field full">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ImageIcon size={15} color="var(--primary)" /> Staff Work Photos ({pastWorkPhotos.length}/10)
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 400 }}>
                Shown in customer detail gallery &amp; lightbox
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
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#f1f5f9',
                    color: 'var(--muted)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <ImageIcon size={20} />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Upload past event staff photos (up to 10)</div>
                <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0, maxWidth: 360 }}>
                  Add photos of your crew serving food, arranging mandapams, or managing parking.
                </p>
                <label
                  className="btn btn-outline"
                  style={{ cursor: 'pointer', margin: 0, padding: '7px 16px', fontSize: 13 }}
                >
                  <Upload size={14} /> {uploadingPhotos ? 'Processing...' : 'Add photos'}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotosUpload}
                    disabled={uploadingPhotos}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  {pastWorkPhotos.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'relative',
                        borderRadius: 10,
                        overflow: 'hidden',
                        aspectRatio: '1',
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1px solid var(--border-light, #e2e8f0)',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                        }}
                        title="Remove photo"
                      >
                        <X size={12} />
                      </button>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 4,
                          left: 4,
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          fontSize: 10,
                          padding: '1px 5px',
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  {pastWorkPhotos.length < 10 && (
                    <label
                      style={{
                        border: '2px dashed var(--border, #cbd5e1)',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                        cursor: 'pointer',
                        aspectRatio: '1',
                        background: '#f8fafc',
                        color: 'var(--primary)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <Plus size={20} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Add more</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotosUpload}
                        disabled={uploadingPhotos}
                        style={{ display: 'none' }}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Work Details */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: 10, marginTop: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary, #1a73e8)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Info size={17} /> 3. Work Details &amp; Specifications
            </span>
          </div>

          <div className="field">
            <label>Staff Uniform, Experience &amp; Responsibilities</label>
            <textarea
              rows={4}
              placeholder="Describe staff training, uniform, serving style, or responsibilities..."
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
            />
          </div>

          <div
            style={{
              padding: '12px 16px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              fontSize: 13,
              color: '#166534',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <CheckCircle2 size={16} color="#16a34a" />
            <span>
              Once saved, your staff service and photos will immediately be visible on <strong>rjpm.in/labour</strong> for customers to call and hire.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/labour')}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-outline"
              disabled={loading}
              onClick={() => handleSubmit('PAUSED')}
            >
              Save as Paused
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Save size={16} /> {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Live'}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
export default LabourStaffFormPage
