import React from 'react'
import {
  Store,
  Wrench,
  Package,
  Users,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Zap,
} from 'lucide-react'

export const PartnerOnboardingGuide = () => {
  const steps = [
    {
      num: '1',
      icon: <Store size={20} color="#2563eb" />,
      iconBg: '#eff6ff',
      badgeColor: '#1d4ed8',
      title: 'Update Business Profile',
      tamilTitle: 'வணிக சுயவிவரம்',
      desc: 'Upload your shop logo & cover banner, add business description, experience, and set your direct WhatsApp number.',
      tags: ['Logo & Cover', 'About Shop', 'WhatsApp Number', 'Service Localities'],
    },
    {
      num: '2',
      icon: <Wrench size={20} color="#059669" />,
      iconBg: '#ecfdf5',
      badgeColor: '#047857',
      title: 'Add Services & Pricing',
      tamilTitle: 'சேவைகள் & கட்டணம்',
      desc: 'Add individual services (e.g. Saree Folding, Mehendi, Catering, Decor) with starting rates, inclusions, and photos of past work.',
      tags: ['Starting Rates', 'Photo Gallery', 'Inclusions & Duration'],
    },
    {
      num: '3',
      icon: <Package size={20} color="#7c3aed" />,
      iconBg: '#f5f3ff',
      badgeColor: '#6d28d9',
      title: 'Create Turnkey Packages',
      tamilTitle: 'விழா பேக்கேஜ்கள்',
      desc: 'Bundle your services into attractive combos (e.g., Bridal Muhurtham combo, Half-Saree set) with guest capacities and package pricing.',
      tags: ['Combos', 'Guest Capacity', 'Bundle Discounts'],
    },
    {
      num: '4',
      icon: <Users size={20} color="#d97706" />,
      iconBg: '#fffbeb',
      badgeColor: '#b45309',
      title: 'Register Labour & Helpers',
      tamilTitle: 'பணியாளர்கள் & ஆட்கள்',
      desc: 'List available event helpers, catering servers, kitchen assistants, or setup crew with per-day/per-shift wages for direct bookings.',
      tags: ['Daily Wages', 'Event Helpers', 'Catering Servers'],
    },
  ]

  return (
    <div className="partner-guide-card">
      <div className="partner-guide-header">
        <div className="partner-guide-pill">
          <Sparkles size={14} />
          <span>PARTNER ROADMAP • வழிகாட்டி</span>
        </div>
        <h2 className="partner-guide-title">How It Works After Registering</h2>
        <p className="partner-guide-subtitle">
          புதிதாக இணையும் பார்ட்னர்களுக்கு: 4 எளிய படிகளில் உங்கள் தொழிலை Rajapalayam வாடிக்கையாளர்களிடம் கொண்டு செல்லுங்கள்.
        </p>
      </div>

      <div className="partner-guide-steps">
        {steps.map((step) => (
          <div key={step.num} className="partner-guide-step-item">
            <div className="partner-guide-step-indicator">
              <div className="partner-step-icon-box" style={{ background: step.iconBg }}>
                {step.icon}
              </div>
              <span className="partner-step-badge" style={{ color: step.badgeColor }}>
                STEP {step.num}
              </span>
            </div>

            <div className="partner-guide-step-content">
              <div className="partner-step-titles">
                <h3 className="partner-step-main-title">{step.title}</h3>
                <span className="partner-step-tamil-badge">{step.tamilTitle}</span>
              </div>
              <p className="partner-step-desc">{step.desc}</p>
              <div className="partner-step-tags">
                {step.tags.map((tag, idx) => (
                  <span key={idx} className="partner-tag-pill">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="partner-guide-golive-box">
        <div className="partner-golive-icon">
          <Zap size={22} color="#059669" />
        </div>
        <div>
          <div className="partner-golive-heading">
            <CheckCircle2 size={16} color="#059669" />
            <span>Go Live & Get Direct Orders • நேரடி ஆர்டர்கள்</span>
          </div>
          <p className="partner-golive-text">
            Once saved, your business is published on <strong>rjpm.in</strong>. Customers in Rajapalayam call & WhatsApp you directly.
            <strong> 0% Commission — You keep 100% of your earnings!</strong>
          </p>
        </div>
      </div>

      <div className="partner-guide-footer">
        <div className="partner-support-note">
          <PhoneCall size={15} color="var(--primary)" />
          <span>
            Need help setting up? Call Vendor Support:{' '}
            <a href="tel:+919360226758" className="partner-support-link">
              +91 9360226758
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}

export default PartnerOnboardingGuide
