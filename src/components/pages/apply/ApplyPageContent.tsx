'use client';

import React, { useState } from 'react';
import AnchorMenu from '@/components/ui/AnchorMenu';
import AnimatedButton from '@/components/ui/AnimatedButton';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import { cmsHtml as html } from '@/lib/cms/sanitizeHtml'
import type { ApplyPageContentData } from '@/lib/apply/types'
import { usePageAnimations, usePageTransition, useAutoScroll } from '@/lib/utils/animations'
import { useScrollToTop } from '@/lib/utils/scrollToTop'
import { submitToHubSpot, type FormData } from '@/components/pages/apply/HubSpotApplyNow'

interface ApplyPageContentProps {
  content: ApplyPageContentData
}

const ApplyPageContent: React.FC<ApplyPageContentProps> = ({ content }) => {
  useScrollToTop()
  useAutoScroll(0.65, 10000, 10, 1.5, 'power2.out', {
    showScrollArrow: true,
  })

  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Introduction' },
          { id: 'section-1', label: 'Why Join US?' },
          { id: 'section-2', label: 'Who This Is For?' },
          { id: 'section-3', label: 'How It Works?' },
          { id: 'apply-now', label: 'Apply Now' },
        ]

  usePageAnimations(false)
  usePageTransition('dynamic', '/images/whiteBanner.jpg', {
    slideDuration: 1.8,
    slideDelay: 0,
    fadeDelay: 0.8,
    fadeDuration: 1.8,
    backgroundPosition: 'center 11.5%',
    // Direct URL loads skip the wipe — it fights intro/preload and breaks Vimeo autoplay.
    skipOnInitialLoad: true,
    transitionType: 'fade',
    dynamicDirections: {
      toHomepage: 'top',
      fromHomepage: 'bottom',
      betweenPages: 'right',
    },
  })

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    brandName: '',
    email: '',
    phone: '',
    website: '',
    linkedin: '',
    productOverview: '',
    additionalNotes: '',
    nationallyDelivered: '',
    business_based: '',
    consent: '',
    confirm: false,
    services: [],
    market: [],
    clients: [],
    digitalAssets: [],
    interests: [],
    productCatalogue: null,
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string[]>([]);
  const [selectedDigitalAsset, setSelectedDigitalAsset] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string[]>([]);

  const totalSteps = 9;

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: FormData) => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
      setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev: FormData) => ({ ...prev, [name]: files }));
    } else {
      setFormData((prev: FormData) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) => (prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]));
    setFormData((prev: FormData) => ({
      ...prev,
      services: selectedServices.includes(service)
        ? selectedServices.filter((s) => s !== service)
        : [...selectedServices, service],
    }));
  };

  const handleMarketToggle = (market: string) => {
    setSelectedMarket((prev) => (prev.includes(market) ? prev.filter((m) => m !== market) : [...prev, market]));
    setFormData((prev: FormData) => ({
      ...prev,
      market: selectedMarket.includes(market)
        ? selectedMarket.filter((m) => m !== market)
        : [...selectedMarket, market],
    }));
  };

  const handleClientToggle = (client: string) => {
    setSelectedClient((prev) => (prev.includes(client) ? prev.filter((c) => c !== client) : [...prev, client]));
    setFormData((prev: FormData) => ({
      ...prev,
      clients: selectedClient.includes(client)
        ? selectedClient.filter((c) => c !== client)
        : [...selectedClient, client],
    }));
  };

  const handleDigitalAssetToggle = (asset: string) => {
    setSelectedDigitalAsset((prev) => (prev.includes(asset) ? prev.filter((a) => a !== asset) : [...prev, asset]));
    setFormData((prev: FormData) => ({
      ...prev,
      digitalAssets: selectedDigitalAsset.includes(asset)
        ? selectedDigitalAsset.filter((a) => a !== asset)
        : [...selectedDigitalAsset, asset],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterest((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
    setFormData((prev: FormData) => ({
      ...prev,
      interests: selectedInterest.includes(interest)
        ? selectedInterest.filter((i) => i !== interest)
        : [...selectedInterest, interest],
    }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const missingFields = [];
    if (!formData.fullName.trim()) missingFields.push('Full Name');
    if (!formData.brandName.trim()) missingFields.push('Company/Brand Name');
    if (!formData.email.trim()) missingFields.push('Email Address');
    if (!formData.phone.trim()) missingFields.push('Phone Number');
    if (!formData.website.trim()) missingFields.push('Website');
    if (!formData.business_based.trim()) missingFields.push('Business Location (State)');
    if (!formData.nationallyDelivered.trim()) missingFields.push('National Delivery');
    if (!formData.consent.trim()) missingFields.push('Consent to Contact');
    if (!formData.confirm) missingFields.push('Terms Agreement');
    if (selectedServices.length === 0) missingFields.push('Product Categories');
    if (selectedMarket.length === 0) missingFields.push('Market Segment');
    if (selectedClient.length === 0) missingFields.push('Typical Clients');
    if (selectedDigitalAsset.length === 0) missingFields.push('Digital Assets');
    if (selectedInterest.length === 0) missingFields.push('Partnership Interests');

    if (missingFields.length > 0) {
      setSubmissionStatus({
        message: `Please complete the following required fields: ${missingFields.join(', ')}`,
        type: 'error',
      });
      setTimeout(() => setSubmissionStatus(null), 8000);
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const completeFormData = {
        ...formData,
        services: selectedServices,
        market: selectedMarket,
        clients: selectedClient,
        digitalAssets: selectedDigitalAsset,
        interests: selectedInterest,
      };

      const result = await submitToHubSpot(completeFormData);

      if (result.success) {
        setSubmissionStatus({ message: 'Application submitted successfully!', type: 'success' });
        setTimeout(() => setCurrentStep(9), 2000);
      } else {
        setSubmissionStatus({ message: result.error ?? 'Submission failed. Please try again.', type: 'error' });
      }
    } catch {
      setSubmissionStatus({ message: 'Submission failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmissionStatus(null), 5000);
    }
  };

  const productOptions = [
    'Timber Flooring',
    'Tiles',
    'Lighting Fixtures',
    'Electrical / Switchgear',
    'Kitchen Appliances',
    'Stone / Benchtops',
    'Tapware / Fittings',
    'Sanitaryware',
    'Joinery / Cabinetry',
    'Windows / Glazing',
    'Paints / Finishes',
    'Smart Home Systems',
    'HVAC / Hydronics',
    'Cladding / Renders',
    'Landscaping & Outdoor',
    'Other',
  ];
  const marketOptions = [
    'Mid-Tier Residential',
    'High-End / Luxury Residential',
    'Architect-Specified',
    'Builder-Focused',
    'Design-Led / Boutique',
  ];
  const clientOptions = [
    'Architects',
    'Interior Designers',
    'Builders / Developers',
    'Display Homes',
    'Owner Builders',
    'Custom Luxury Homes',
    'Volume Housing',
    'Commercial Projects',
    'Other',
  ];
  const digitalAssetOptions = [
    '3D Models (FBX, OBJ, or similar)',
    'High-resolution Texture Maps (JPG, PNG)',
    'Material Swatch Images',
    'Specification Sheets (PDF)',
    'Revit or CAD files',
    "Nothing yet - Ill need support from DX LIVING",
  ];
  const interestOptions = [
    'Being included in rendered residential projects',
    'Being featured in client-facing tools (VR, CGI, model viewers)',
    'Being credited in promotional content (videos, brochures, reels)',
    'Future collaborations with builders and architects',
    'Becoming a Preferred Supplier Partner',
  ];

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={sections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] z-40 bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={content.banner.vimeoBackgroundVideo}
            title="Partner with DX LIVING | Become a Premium Supplier"
            className="w-full lg:h-full h-[calc(65vh)]"
            autoplay={true}
            loop={true}
            controls={false}
            muted={true}
            parallax={true}
            signalPageReady
          />
        </div>

        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-10"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        />

        <div
          className="absolute z-20 text-white top-50 bottom-50 m-auto left-50 md:bottom-10 md:left-8 mb-4"
          tabIndex={1}
          aria-label="Join Us Now"
        >
          <h1
            className="text-reveal heading-large"
            data-animation="text-reveal"
            data-delay="3.0"
            data-duration="1.0"
            dangerouslySetInnerHTML={html(content.banner.title)}
          />
        </div>
      </section>

      <section className="py-[100px] md:py-[150px] xl:py-[200px] tertiary-bg" id="intro">
        <div className="max-w-[1200px] mx-auto px-8">
          <h2
            className="heading-small mb-8 primary-color overflow-hidden opacity-0 text-center"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
          >
            {content.introduction.heading}
          </h2>
          <div
            className="opacity-0 text-center text-white"
            data-animation="fade"
            data-delay="0.5"
            data-duration="0.5"
            dangerouslySetInnerHTML={html(content.introduction.content)}
          />
        </div>
      </section>

      <section
        className="scroll-trigger py-[100px] md:py-[150px] xl:py-[200px] px-8 white-bg-section scroll-m-[-100px]"
        id="section-1"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
          >
            {content.whyJoin.heading}
          </h2>
          <p
            className="text-center mb-16"
            tabIndex={1}
            data-animation="fade"
            data-delay="0.5"
            data-duration="0.5"
            dangerouslySetInnerHTML={html(content.whyJoin.content)}
          />
        </div>
        <div className="max-w-[1200px] mx-auto" data-animation="fade" data-delay="0.5" data-duration="0.5">
          {content.whyJoin.items.map((item) => (
            <div key={item.heading} className="grid sm:grid-cols-5 gap-4 divider-l">
              <p className="font-semibold sm:col-span-2" dangerouslySetInnerHTML={html(item.heading)} />
              <p className="sm:col-span-3" dangerouslySetInnerHTML={html(item.content)} />
            </div>
          ))}
        </div>
      </section>

      <section
        className="gallery scroll-trigger white-bg-section px-8"
        data-animation="gallery"
        data-start="top 700"
        data-end="top 200"
        data-scrub="true"
      >
        <div className="gallery__grid flex flex-col xl:flex-row">
          <div className="gallery__left" data-speed=".9">
            <div className="gallery__item">
              <div className="w-full h-auto aspect-[16/8] gallery__anim">
                <VimeoEmbed
                  videoId={content.videos.left}
                  title="Premium Supply Partners Australia | DX LIVING"
                  className="w-full h-full rounded-[20px] overflow-hidden"
                  stretch
                  lazy
                />
              </div>
            </div>
          </div>
          <div className="gallery__right" data-speed="1.1">
            <div className="gallery__item">
              <div className="w-full h-auto aspect-[16/8] gallery__anim">
                <VimeoEmbed
                  videoId={content.videos.right}
                  title="Join Premium Supplier Network | DX LIVING"
                  className="w-full h-full rounded-[20px] overflow-hidden"
                  stretch
                  lazy
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-trigger py-[100px] md:py-[150px] xl:py-[200px] px-16 white-bg-section" id="section-2">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
          >
            {content.whoThisIsFor.heading}
          </h2>
          <div className="text-left max-w-[1200px] mx-auto" data-animation="fade" data-delay="0.5" data-duration="0.5">
            <p className="mb-8 text-center" tabIndex={1} dangerouslySetInnerHTML={html(content.whoThisIsFor.content)} />
            <ul className="flex flex-row gap-4 flex-wrap welcome-list">
              {content.whoThisIsFor.items.map((item) => (
                <li key={item} tabIndex={1} dangerouslySetInnerHTML={html(item)} />
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="scroll-trigger py-[100px] md:py-[150px] xl:py-[200px] tertiary-bg" id="section-3">
        <div className="max-w-[1400px] mx-auto text-center px-10">
          <h2
            className="heading-small mb-8 overflow-hidden text-center opacity-0 soft-sand-color"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
          >
            {content.howItWorks.heading}
          </h2>
          <div className="flex flex-row flex-wrap xl:flex-nowrap gap-4 items-center justify-center">
            {content.howItWorks.steps.map((step, index) => (
              <React.Fragment key={step.heading}>
                <div
                  className="w-full sm:w-[calc(50%-20px)] xl:w-1/4 how-it-works-box shadow-[inset_0_0px_10px_rgba(0,0,0,0.08)]"
                  data-animation="slide"
                  data-direction="left"
                  data-delay={(0.8 + index * 0.2).toFixed(1)}
                  data-duration="0.8"
                >
                  <h3 className="heading-small lao primary-color">{`Step ${index + 1}`}</h3>
                  <div className="flex flex-col gap-2">
                    <p className="font-bold" dangerouslySetInnerHTML={html(step.heading)} />
                    <p className="text-[16px]" dangerouslySetInnerHTML={html(step.content)} />
                  </div>
                </div>
                {index < content.howItWorks.steps.length - 1 && (
                  <div
                    className="spacer-white sm:hidden xl:block"
                    data-animation="fade"
                    data-delay="1.6"
                    data-duration="0.8"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="scroll-trigger py-[100px] md:py-[150px] xl:py-[200px] px-8 white-bg-section scroll-m-[-100px]" id="apply-now">
        <div className="max-w-[1400px] mx-auto text-center">
          <h2
            className="heading-small mb-8 black overflow-hidden text-center opacity-0"
            data-animation="text-split"
            data-split-by="words"
            data-stagger="0.05"
            data-delay="0.0"
            data-duration="0.5"
            tabIndex={1}
          >
            {content.applyToJoin.heading}
          </h2>
          <div className="max-w-[900px] mx-auto" data-animation="fade" data-delay="0.5" data-duration="0.5">
            <p className="mb-[60px] text-center" tabIndex={1} dangerouslySetInnerHTML={html(content.applyToJoin.content)} />
          </div>
        </div>

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-8 step-form">
          <div className="bg-[#F5F5F5] px-8 py-[100px] rounded-2xl min-h-[640px] lg:min-h-[calc(100vh-80px)] flex flex-col justify-between" data-pin="true" data-start="top 100" data-end="top 200" data-scrub="true">
            {currentStep === 1 && (
              <div className="max-w-[1400px] mx-auto text-center min-h-[500px] lg:h-[calc(100vh-200px)] flex flex-col justify-center">
                <h2 className="heading-small steal-slate-color mb-8 overflow-hidden text-center">
                  DX LIVING - Supplier Partner Application Form
                </h2>
                <div className="max-w-[850px] mx-auto">
                  <p className="mb-8 text-center">
                    Please complete this form to express interest in becoming an approved supplier for{' '}
                    <strong>DX</strong> LIVING. Required fields are marked with an asterisk (*).
                  </p>

                  <AnimatedButton
                    onClick={nextStep}
                    dataAnimation="fade"
                    dataDelay="0.0"
                    dataDuration="0.5"
                    className="white-bg text-sm uppercase m-auto relative"
                  >
                    Proceed
                  </AnimatedButton>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="max-w-[800px] mx-auto">
                <h3 className="heading-small mb-6 steal-slate-color text-center">Contact Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Full Name*"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      Please enter your first and last name.
                    </label>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Company / Brand Name*"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      The registered or trading name of your business.
                    </label>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Email Address*"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Phone Number*"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      Mobile or direct line preferred.
                    </label>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Website*"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      Link to your brand or product website.
                    </label>

                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="LinkedIn Profile"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      Optional: for company or personal profile.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="max-w-[100%] sm:max-w-[1400px] mx-auto mb-10">
                <h3 className="heading-small mb-6 steal-slate-color text-center">Product Information</h3>
                <div className="space-y-6 flex flex-row flex-wrap gap-12 justify-between">
                  <div>
                    <label className="block text-[18px] secondary-color mb-2 whitespace-nowrap">
                      What product categories do you offer?*
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-6 italic">
                      Select all that apply.
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 gap-3">
                      {productOptions.map((service) => (
                        <label key={service} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedServices.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span
                            className={`text-[16px] transition-colors duration-200 ${selectedServices.includes(service) ? 'black' : 'accent-color'}`}
                          >
                            {service}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '0px' }}>
                    <label className="block text-[18px] secondary-color mb-2 sm:whitespace-nowrap">
                      What best describes your market segment?*
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-6 italic">
                      Select all that apply.
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                      {marketOptions.map((market) => (
                        <label key={market} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedMarket.includes(market)}
                            onChange={() => handleMarketToggle(market)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span
                            className={`text-[16px] transition-colors duration-200 ${selectedMarket.includes(market) ? 'black' : 'accent-color'}`}
                          >
                            {market}
                          </span>
                        </label>
                      ))}
                    </div>

                    <label className="block text-[18px] secondary-color mt-6 mb-2 whitespace-nowrap">
                      Where is your business based?*
                    </label>
                    <select
                      name="business_based"
                      value={formData.business_based || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select State</option>
                      <option value="NSW">NSW</option>
                      <option value="VIC">VIC</option>
                      <option value="QLD">QLD</option>
                      <option value="SA">SA</option>
                      <option value="WA">WA</option>
                      <option value="NT">NT</option>
                      <option value="TAS">TAS</option>
                      <option value="ACT">ACT</option>
                      <option value="Other">Other</option>
                    </select>

                    <label className="block text-[18px] secondary-color mt-6 mb-2 whitespace-nowrap ">
                      Do you deliver products nationally?*
                    </label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="nationallyDelivered"
                          value="Yes"
                          checked={formData.nationallyDelivered === 'Yes'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`text-[16px] transition-colors duration-200 ${formData.nationallyDelivered === 'Yes' ? 'text-[#1F1F1F]' : 'accent-color'}`}
                        >
                          Yes
                        </span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="nationallyDelivered"
                          value="No"
                          checked={formData.nationallyDelivered === 'No'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`text-[16px] transition-colors duration-200 ${formData.nationallyDelivered === 'No' ? 'text-[#1F1F1F]' : 'accent-color'}`}
                        >
                          No
                        </span>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginTop: '0px' }}>
                    <label className="block text-[18px] secondary-color mb-2 whitespace-nowrap">
                      Who are your typical clients?
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-6 italic">
                      Select all that apply.
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-1 gap-3">
                      {clientOptions.map((client) => (
                        <label key={client} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedClient.includes(client)}
                            onChange={() => handleClientToggle(client)}
                            className="w-4 h-4 border-[#A7A9AC] focus:ring-blue-500"
                          />
                          <span
                            className={`text-[16px] transition-colors duration-200 ${selectedClient.includes(client) ? 'black' : 'accent-color'}`}
                          >
                            {client}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="max-w-[700px] mx-auto">
                <h3 className="heading-small steal-slate-color mb-6 text-gray-800">
                  Visual Asset Readiness
                </h3>
                <div>
                  <label className="block text-[18px] secondary-color mb-4">
                    Which of the following digital assets can you provide?
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {digitalAssetOptions.map((digitalAsset) => (
                      <label key={digitalAsset} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedDigitalAsset.includes(digitalAsset)}
                          onChange={() => handleDigitalAssetToggle(digitalAsset)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`text-[16px] transition-colors duration-200 ${selectedDigitalAsset.includes(digitalAsset) ? 'black' : 'accent-color'}`}
                        >
                          {digitalAsset}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="max-w-[800px] mx-auto">
                <div className="rounded-2xl mb-10">
                  <h3 className="heading-small steal-slate-color mb-6 text-gray-800 text-center">
                    Product Overview
                  </h3>
                  <div>
                    <label className="block text-[18px] font-medium text-gray-700 mb-2">
                      Briefly describe your product range and what makes it unique.*
                    </label>
                    <textarea
                      name="productOverview"
                      value={formData.productOverview}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Describe your products..."
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      200-300 characters recommended.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="max-w-[800px] mx-auto">
                <div className="rounded-2xl mb-10">
                  <h3 className="heading-small steal-slate-color mb-6 text-gray-800 text-center">
                    Partnership Interests
                  </h3>
                  <div>
                    <label className="block text-[18px] secondary-color mb-1">
                      What are you most interested in?
                    </label>
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic mb-6">
                      Select all that apply.
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-3">
                      {interestOptions.map((interest) => (
                        <label key={interest} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedInterest.includes(interest)}
                            onChange={() => handleInterestToggle(interest)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span
                            className={`text-[16px] transition-colors duration-200 ${selectedInterest.includes(interest) ? 'black' : 'accent-color'}`}
                          >
                            {interest}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="max-w-[800px] mx-auto">
                <div className="rounded-2xl">
                  <h3 className="heading-small steal-slate-color mb-6 text-center">Final Details</h3>
                  <div>
                    <label className="block text-[18px] secondary-color mb-1">
                      Additional Notes (optional)
                    </label>
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Add notes"
                    />
                    <label className="block text-sm font-medium text-gray-700 mb-2 italic">
                      Use this space to tell us anything else you'd like us to know about your business
                      or goals.
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="max-w-[800px] mx-auto">
                <div className="rounded-2xl">
                  <h3 className="heading-small steal-slate-color mb-6 text-gray-800 text-center">
                    Consent
                  </h3>
                  <div className="space-y-10">
                    <div>
                      <label className="block text-[18px] secondary-color mb-1">
                        Do you consent to being contacted by the <strong>DX</strong> LIVING team
                        regarding this submission?*
                      </label>
                      <div className="flex items-center space-x-6">
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="consent"
                            value="Yes"
                            checked={formData.consent === 'Yes'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span
                            className={`text-[16px] transition-colors duration-200 ${formData.consent === 'Yes' ? 'text-[#1F1F1F]' : 'accent-color'}`}
                          >
                            Yes
                          </span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="consent"
                            value="No"
                            checked={formData.consent === 'No'}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span
                            className={`text-[16px] transition-colors duration-200 ${formData.consent === 'No' ? 'text-[#1F1F1F]' : 'accent-color'}`}
                          >
                            No
                          </span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[18px] secondary-color mb-1">
                        By submitting this form, I confirm the information is accurate and agree to the
                        terms of participation.*
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          name="confirm"
                          checked={formData.confirm}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span
                          className={`text-[16px] transition-colors duration-200 ${formData.confirm ? 'text-[#1F1F1F]' : 'accent-color'}`}
                        >
                          I agree
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div className="max-w-[800px] mx-auto h-[calc(100vh-200px)] flex flex-col justify-center">
                <div className="rounded-2xl text-center">
                  <h3 className="heading-small steal-slate-color mb-6 text-gray-800">Thank You!</h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      We've received your application and truly appreciate your interest in collaborating
                      with us. Our team will review your submission and be in touch shortly with next
                      steps.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center w-full max-w-[1400px] mx-auto">
              {currentStep > 2 && currentStep < 9 && (
                <AnimatedButton
                  onClick={prevStep}
                  className="white-bg text-white"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.6"
                >
                  Previous
                </AnimatedButton>
              )}
              {currentStep > 1 && currentStep < 8 && (
                <AnimatedButton
                  onClick={nextStep}
                  className="white-bg text-white ml-auto relative"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.6"
                >
                  Next
                </AnimatedButton>
              )}
              {currentStep === 8 && (
                <AnimatedButton
                  onClick={() => handleSubmit()}
                  type="submit"
                  className="white-bg text-white ml-auto relative"
                  dataAnimation="fade"
                  dataDelay="0.2"
                  dataDuration="0.6"
                  disabled={isSubmitting}
                >
                  <b className="hidden sm:block">{isSubmitting ? 'Submitting...' : 'Submit Application'}</b>
                  <b className="block sm:hidden">{isSubmitting ? 'Submitting...' : 'Submit'}</b>
                </AnimatedButton>
              )}
            </div>
          </div>
        </form>

        {submissionStatus && (
          <div className="max-w-[800px] mx-auto mt-6">
            <div
              className={`p-4 rounded-lg text-center transition-all duration-300 ${
                submissionStatus.type === 'success'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {submissionStatus.message}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ApplyPageContent;
