import React, { createContext, useContext, useState, useEffect } from 'react'

const TRANSLATIONS = {
  en: {
    // Brand
    productName: 'rjpm.in',
    portalTitle: 'rjpm.in Partner Portal',
    providerPill: 'PROVIDER',

    // Nav Labels
    navBusiness: 'BUSINESS',
    navInsights: 'INSIGHTS',
    navAccount: 'ACCOUNT',

    // Navigation Items
    dashboard: 'Dashboard',
    myBusinessProfile: 'My Business Profile',
    myServices: 'My Services',
    myPackages: 'My Packages',
    myLabourStaff: 'My Labour Staff',
    addLabourService: 'Add Labour Service',
    enquiries: 'Enquiries',
    availability: 'Availability',
    reviews: 'Reviews',
    performance: 'Performance',
    settings: 'Settings',

    // TopBar
    previewCustomerView: 'Preview customer view',
    notifications: 'Notifications',
    notificationsUpToDate: 'All notifications are up to date.',

    // Common Actions
    save: 'Save',
    saveChanges: 'Save Changes',
    saveAsDraft: 'Save as draft',
    publish: 'Publish',
    publishLive: 'Publish Live',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    pause: 'Pause',
    activate: 'Activate',
    search: 'Search',
    allStatus: 'All status',
    allCategories: 'All categories',
    allEventTypes: 'All event types',
    live: 'Live',
    paused: 'Paused',
    draft: 'Draft',
    loading: 'Loading...',

    // Profile Progress
    completeProfile: 'Complete your profile',
    completeNow: 'Complete now',

    // Services Page
    myServicesTitle: 'My Services',
    myServicesSubtitle: 'Manage the services customers can discover and enquire about.',
    addNewService: 'Add new service',
    searchMyServices: 'Search my services...',
    loadingServices: 'Loading your active service listings...',
    createServiceSubtitle: 'Add and manage individual event services in your business catalog.',
    noServicesFound: 'No services found',
    noServicesYet: 'You have not added any services yet. Start adding the services you provide (e.g. Catering, Floral Decor, Photography).',

    // Service Form
    editService: 'Edit Service',
    createService: 'Create Service',
    serviceTitle: 'Service name *',
    category: 'Category *',
    pricingType: 'Pricing type *',
    startingFrom: 'Starting from',
    fixedPrice: 'Fixed price',
    perPlate: 'Per plate / guest',
    price: 'Price (₹) *',
    serviceCoverPhoto: 'Service cover photo',
    uploadServiceCover: 'Upload service cover photo',
    changePhoto: 'Change photo',
    browseFile: 'Browse file',
    pastWorkPhotosCount: 'Past work photos (up to 10 photos)',
    addPhotos: 'Add photos',
    updateService: 'Update Service',
    publishService: 'Publish Service',

    // Packages Page
    addNewPackage: 'Add new package',
    packagesSubtitle: 'Create ready-made event packages by combining your existing services.',
    noPackagesFound: 'No packages found',
    noPackagesYet: 'You have not created any packages yet. Combine your services into complete celebration bundles.',

    // Package Form
    editPackage: 'Edit Package',
    createPackage: 'Create Package',
    packageSubtitle: 'Bundle your existing services into one easy-to-buy event package.',
    packageName: 'Package name *',
    eventType: 'Event type *',
    packagePricing: 'Package pricing *',
    packagePrice: 'Package price (₹) *',
    guestCapacity: 'Guest capacity',
    packageCoverImage: 'Package Cover Image',
    uploadPackageCover: 'Upload package cover photo',
    changeCover: 'Change cover',
    referencePhotos: 'Reference & past work photos',
    referencePhotosSubtitle: 'Upload up to 10 real event photos or reference setups included in this package. Stored directly in the database.',
    selectServicesOptional: 'Select services included in this package (Optional)',
    selectServicesSubtitle: 'Optionally check any services from your catalog that are bundled into this offering.',
    noServicesToSelect: 'No individual services added yet in "My Services". You can still create and publish standalone celebration packages.',
    selectedServices: 'Selected services',
    servicesSelectedCount: 'services selected',
    publishPackage: 'Publish Package',
    updatePackage: 'Update Package',

    // Enquiries Page
    enquiriesTitle: 'Client Enquiries & Bookings',
    enquiriesSubtitle: 'Respond quickly to event organizers and customers seeking your services.',
    accept: 'Accept',
    decline: 'Decline',
    chatOnWhatsApp: 'Chat on WhatsApp',

    // Reviews Page
    reviewsTitle: 'Customer Reviews',
    reviewsSubtitle: 'Client ratings and feedback from hosts and organizers.',

    // Settings
    partnerSupport: 'Partner Support',
    switchLanguage: 'Language: English / தமிழ்',
  },
  ta: {
    // Brand
    productName: 'rjpm.in',
    portalTitle: 'rjpm.in விற்பனையாளர் தளம்',
    providerPill: 'விற்பனையாளர்',

    // Nav Labels
    navBusiness: 'வணிகம்',
    navInsights: 'புள்ளிவிவரங்கள்',
    navAccount: 'கணக்கு',

    // Navigation Items
    dashboard: 'முகப்பு பலகை',
    myBusinessProfile: 'வணிக சுயவிவரம்',
    myServices: 'எனது சேவைகள்',
    myPackages: 'எனது தொகுப்புகள்',
    myLabourStaff: 'எனது தொழிலாளர் & பணியாளர்கள்',
    addLabourService: 'பணியாளர் சேவை சேர்க்க',
    enquiries: 'விசாரணைகள்',
    availability: 'கிடைக்கும் நாட்கள்',
    reviews: 'மதிப்புரைகள்',
    performance: 'செயல்திறன்',
    settings: 'அமைப்புகள்',

    // TopBar
    previewCustomerView: 'வாடிக்கையாளர் பார்வையை காண்க',
    notifications: 'அறிவிப்புகள்',
    notificationsUpToDate: 'அனைத்து அறிவிப்புகளும் புதுப்பிக்கப்பட்டுள்ளன.',

    // Common Actions
    save: 'சேமிக்க',
    saveChanges: 'மாற்றங்களை சேமிக்கவும்',
    saveAsDraft: 'வரைவாக சேமிக்க',
    publish: 'வெளியிடுக',
    publishLive: 'நேரலையாக வெளியிடுக',
    cancel: 'ரத்து செய்',
    edit: 'திருத்துக',
    delete: 'நீக்குக',
    pause: 'இடைநிறுத்து',
    activate: 'செயல்படுத்து',
    search: 'தேடுக',
    allStatus: 'அனைத்து நிலை',
    allCategories: 'அனைத்து பிரிவுகள்',
    allEventTypes: 'அனைத்து நிகழ்வுகள்',
    live: 'நேரலை',
    paused: 'இடைநிறுத்தப்பட்டது',
    draft: 'வரைவு',
    loading: 'ஏற்றப்படுகிறது...',

    // Profile Progress
    completeProfile: 'சுயவிவரத்தை முழுமையாக்குங்கள்',
    completeNow: 'இப்போதே முடிக்கவும்',

    // Services Page
    myServicesTitle: 'என் சேவைகள்',
    myServicesSubtitle: 'வாடிக்கையாளர்கள் கண்டறிந்து விசாரிக்கக்கூடிய உங்கள் சேவைகளை நிர்வகிக்கவும்.',
    addNewService: 'புதிய சேவை சேர்க்க',
    searchMyServices: 'சேவைகளைத் தேடுக...',
    loadingServices: 'உங்கள் சேவைப் பட்டியல்கள் ஏற்றப்படுகின்றன...',
    createServiceSubtitle: 'உங்கள் வணிக அட்டவணையில் தனிப்பட்ட நிகழ்வு சேவைகளைச் சேர்த்து நிர்வகிக்கவும்.',
    noServicesFound: 'சேவைகள் எதுவும் கிடைக்கவில்லை',
    noServicesYet: 'நீங்கள் இன்னும் எந்த சேவைகளையும் சேர்க்கவில்லை. நீங்கள் வழங்கும் சேவைகளைச் சேர்க்கத் தொடங்குங்கள் (எ.கா. கேட்டரிங், மலர் அலங்காரம், புகைப்படம்).',

    // Service Form
    editService: 'சேவையைத் திருத்துக',
    createService: 'சேவையை உருவாக்குக',
    serviceTitle: 'சேவையின் பெயர் *',
    category: 'பிரிவு *',
    pricingType: 'விலை வகை *',
    startingFrom: 'தொடங்கும் விலை',
    fixedPrice: 'நிலையான விலை',
    perPlate: 'விருந்தினர் / தட்டு ஒன்றுக்கு',
    price: 'விலை (₹) *',
    serviceCoverPhoto: 'சேவை முகப்பு புகைப்படம்',
    uploadServiceCover: 'சேவை முகப்பு புகைப்படத்தை பதிவேற்றவும்',
    changePhoto: 'புகைப்படத்தை மாற்றுக',
    browseFile: 'கோப்பை தேர்ந்தெடுக்க',
    pastWorkPhotosCount: 'முந்தைய பணி புகைப்படங்கள் (10 வரை)',
    addPhotos: 'புகைப்படங்கள் சேர்க்க',
    updateService: 'சேவையைப் புதுப்பிக்கவும்',
    publishService: 'சேவையை வெளியிடுக',

    // Packages Page
    addNewPackage: 'புதிய தொகுப்பு சேர்க்க',
    packagesSubtitle: 'உங்கள் சேவைகளை ஒன்றாக இணைத்து ஆயத்த நிகழ்வு தொகுப்புகளை உருவாக்கவும்.',
    noPackagesFound: 'தொகுப்புகள் எதுவும் கிடைக்கவில்லை',
    noPackagesYet: 'நீங்கள் இன்னும் எந்த தொகுப்புகளையும் உருவாக்கவில்லை. முழுமையான கொண்டாட்ட தொகுப்புகளை உருவாக்கத் தொடங்குங்கள்.',

    // Package Form
    editPackage: 'தொகுப்பைத் திருத்துக',
    createPackage: 'தொகுப்பை உருவாக்குக',
    packageSubtitle: 'உங்கள் சேவைகளை எளிதாக வாங்கக்கூடிய ஒரே நிகழ்வு தொகுப்பாக இணைக்கவும்.',
    packageName: 'தொகுப்பின் பெயர் *',
    eventType: 'நிகழ்வு வகை *',
    packagePricing: 'தொகுப்பு விலை முறை *',
    packagePrice: 'தொகுப்பு விலை (₹) *',
    guestCapacity: 'விருந்தினர் எண்ணிக்கை',
    packageCoverImage: 'தொகுப்பு முகப்பு படம்',
    uploadPackageCover: 'தொகுப்பு முகப்பு படத்தை பதிவேற்றவும்',
    changeCover: 'முகப்பை மாற்றுக',
    referencePhotos: 'தொகுப்பு குறிப்பு & முந்தைய பணி புகைப்படங்கள்',
    referencePhotosSubtitle: 'இந்த தொகுப்பில் சேர்க்கப்பட்டுள்ள 10 நேரடி நிகழ்வு புகைப்படங்கள் வரை பதிவேற்றலாம். தரவுத்தளத்தில் சேமிக்கப்படும்.',
    selectServicesOptional: 'இந்த தொகுப்பில் சேர்க்கப்படும் சேவைகள் (விருப்பமானது)',
    selectServicesSubtitle: 'இந்த தொகுப்புடன் உங்கள் பட்டியலிலுள்ள சேவைகளை விருப்பப்பட்டால் இணைக்கலாம்.',
    noServicesToSelect: 'சேவைகள் எதுவும் இன்னும் சேர்க்கப்படவில்லை. நீங்கள் தனிப்பட்ட முழுமையான கொண்டாட்ட தொகுப்பாகவும் உருவாக்கலாம்.',
    selectedServices: 'தேர்ந்தெடுக்கப்பட்ட சேவைகள்',
    servicesSelectedCount: 'சேவைகள் தேர்ந்தெடுக்கப்பட்டுள்ளன',
    publishPackage: 'தொகுப்பை வெளியிடுக',
    updatePackage: 'தொகுப்பை புதுப்பிக்கவும்',

    // Enquiries Page
    enquiriesTitle: 'வாடிக்கையாளர் விசாரணைகள் & முன்பதிவுகள்',
    enquiriesSubtitle: 'உங்கள் சேவைகளைத் தேடும் நிகழ்வு ஒருங்கிணைப்பாளர்களுக்கும் வாடிக்கையாளர்களுக்கும் விரைவாகப் பதிலளிக்கவும்.',
    accept: 'ஏற்றுக்கொள்',
    decline: 'நிராகரி',
    chatOnWhatsApp: 'வாட்ஸ்அப்பில் உரையாடவும்',

    // Reviews Page
    reviewsTitle: 'வாடிக்கையாளர் மதிப்புரைகள்',
    reviewsSubtitle: 'வாடிக்கையாளர்கள் வழங்கிய மதிப்பீடுகள் மற்றும் கருத்துக்கள்.',

    // Settings
    partnerSupport: 'பங்குதாரர் உதவி மையம்',
    switchLanguage: 'மொழி: English / தமிழ்',
  },
}

const LanguageContext = createContext(null)

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('rjpm_provider_lang') || 'en'
  })

  const setLanguage = (lang) => {
    setLanguageState(lang)
    localStorage.setItem('rjpm_provider_lang', lang)
  }

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ta' : 'en'
    setLanguage(next)
  }

  const t = (key, fallback = '') => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en
    if (dict[key]) return dict[key]
    const enDict = TRANSLATIONS.en
    if (enDict[key]) return enDict[key]
    return fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
