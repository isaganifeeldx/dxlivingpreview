'use client';

import React, { useEffect, useState } from 'react';
import AnchorMenu from '@/components/ui/AnchorMenu';
import AnimatedButton from '@/components/ui/AnimatedButton';
import LinkedInStoriesEmbed from '@/components/ui/LinkedInStoriesEmbed';
import VimeoEmbed from '@/components/ui/VimeoEmbed';
import { usePageAnimations, usePageTransition } from '@/lib/utils/animations'
import type { ContactPageContentData } from '@/lib/contact/types'
import { submitContactToHubSpot, type ContactFormData } from '@/components/pages/contact/HubSpotContact'

interface ContactPageContentProps {
  content: ContactPageContentData
}

const phoneHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

const ContactPageContent: React.FC<ContactPageContentProps> = ({ content }) => {
  const sections =
    content.anchorMenu?.length > 0
      ? content.anchorMenu
      : [
          { id: 'intro', label: 'Overview' },
          { id: 'contact-information', label: 'Contact Information' },
          { id: 'where-to-find-us', label: 'Where to Find Us' },
          { id: 'section-4', label: 'LinkedIn Stories' },
        ]

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    projectType: '',
    message: '',
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submissionMessage, setSubmissionMessage] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      const contactInfoSection = document.getElementById('contact-information')
      if (!contactInfoSection) return

      // Use section scroll margin offset (scroll-m-[100px]).
      contactInfoSection.scrollIntoView({ behavior: 'auto', block: 'start' })
    }, 0)

    return () => clearTimeout(timer)
  }, [])

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmissionMessage('');

    const missingFields = [];
    if (!formData.firstName.trim()) missingFields.push('First Name');
    if (!formData.lastName.trim()) missingFields.push('Last Name');
    if (!formData.email.trim()) missingFields.push('Email Address');
    if (!formData.company.trim()) missingFields.push('Company Name');
    if (!formData.phone.trim()) missingFields.push('Contact Number');
    if (!formData.projectType.trim()) missingFields.push('Service of Interest');
    if (!formData.message.trim()) missingFields.push('Message');

    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setSubmissionMessage(
        `Please complete the following required fields: ${missingFields.join(', ')}`,
      );
      setIsSubmitting(false);
      return;
    }

    try {
      const contactFormData: ContactFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        company: formData.company,
        phone: formData.phone,
        projectType: formData.projectType,
        message: formData.message,
        uploadedFiles,
      };

      const result = await submitContactToHubSpot(contactFormData);

      if (result.success) {
        setSubmitStatus('success');
        setSubmissionMessage("Thank you for your message! We'll get back to you soon.");
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          phone: '',
          projectType: '',
          message: '',
        });
        setUploadedFiles([]);
      } else {
        setSubmitStatus('error');
        setSubmissionMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setSubmitStatus('error');
      setSubmissionMessage('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen page-content">
      <AnchorMenu sections={sections} />

      <section className="mx-auto px-4 py-16 lg:h-screen h-[calc(65vh)] bg-cover bg-center bg-no-repeat relative flex items-center justify-center overflow-hidden banner-section">
        <div
          className="absolute inset-0 w-full lg:h-full h-[calc(65vh)] -z-10 overflow-hidden md:scale-200 scale-100 lg:scale-110"
          data-parallax="fix"
          data-speed="0.5"
        >
          <VimeoEmbed
            videoId={content.banner.vimeoBackgroundVideo}
            title="Begin Your Dream Home | DX LIVING"
            className="w-full lg:h-full h-[calc(65vh)]"
            autoplay
            loop
            controls={false}
            muted
            parallax
            signalPageReady
          />
        </div>
        <div
          className="absolute inset-0 bg-black bg-opacity-30 z-10"
          data-animation="fade"
          data-delay="0.2"
          data-duration="1.0"
        />
        <div className="absolute z-20 text-white top-50 bottom-50 m-auto left-50 md:bottom-10 md:left-8 mb-4">
          <h1
            className="text-reveal heading-large"
            data-animation="text-reveal"
            data-delay="3.0"
            data-duration="1.0"
          >
            {content.banner.title}
          </h1>
        </div>
      </section>

      <section
        className="bg-white p-8 py-[100px] md:py-[150px] xl:py-[200px] white-bg-section"
        data-animation="fade"
        data-delay="0.2"
        data-duration="1.0"
        id="intro"
      >
        <div className="max-w-[1400px] mx-auto text-center">
          <p
            className="black max-w-[1400px] mx-auto font-semibold leading-[38px]"
            data-animation="fade"
            data-delay="0.6"
            data-duration="1.0"
          >
            {content.introduction}
          </p>
        </div>
      </section>

      <section
        className="bg-white p-8 py-0 white-bg-section scroll-m-[100px]"
        data-animation="fade"
        data-delay="0.2"
        data-duration="1.0"
        id="contact-information"
      >
        <div className="max-w-[1400px] mx-auto">
          <div
            className="tertiary-bg p-8 md:p-[50px] rounded-lg"
            data-animation="fade"
            data-delay="0.6"
            data-duration="1.0"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full text-white placeholder:text-[#bfb6ad]"
                  placeholder="First Name*"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full text-white placeholder:text-[#bfb6ad]"
                  placeholder="Last Name*"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full text-white placeholder:text-[#bfb6ad]"
                  placeholder="Email Address*"
                />
              </div>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full text-white placeholder:text-[#bfb6ad]"
                placeholder="Company Name*"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full text-white placeholder:text-[#bfb6ad]"
                placeholder="Contact Number*"
              />

              <select
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                required
                className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full text-[#bfb6ad]"
              >
                <option value="">Service of Interest*</option>
                <option value="3d-rendering">3D Rendering & Visualization</option>
                <option value="bim-modelling">BIM Modelling & Construction</option>
                <option value="digital-planning">Digital Planning Tools</option>
                <option value="supplier-integration">Supplier Integration</option>
                <option value="consultation">Consultation & Strategy</option>
                <option value="other">Other</option>
              </select>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={2}
                className="bg-transparent border-b border-[#bfb6ad] px-0 py-2 w-full resize-none text-white placeholder:text-[#bfb6ad]"
                placeholder="Message"
              />

              <div className="pt-4">
                <AnimatedButton
                  type="submit"
                  className="text-white w-fit mx-auto uppercase text-[14px] md:text-[16px]"
                >
                  {isSubmitting ? 'Sending Message...' : 'Submit'}
                </AnimatedButton>
              </div>

              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  {submissionMessage}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  {submissionMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <section
        className="p-8 pt-[50px] pb-[100px] xl:pb-[200px] bg-white white-bg-section scroll-m-[-20px]"
        data-animation="fade"
        data-delay="0.2"
        data-duration="1.0"
        id="where-to-find-us"
      >
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-[20px] lg:gap-[100px]">
          <div className="flex flex-col">
            <h2 className="heading-medium black font-semibold">{content.quickEnquiries.heading}</h2>
            <p className="black text-left">{content.quickEnquiries.content}</p>
          </div>
          <div>
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-1 w-full lg:w-[230px]">
              <p className="black text-left flex flex-row items-center gap-4">
                <img src="/images/phone.svg" alt="Phone" />{' '}
                <a href={phoneHref(content.quickEnquiries.phone)}>{content.quickEnquiries.phone}</a>
              </p>
              <p className="black text-left flex flex-row items-center gap-4">
                <img src="/images/email.svg" alt="Email" />{' '}
                <a href={`mailto:${content.quickEnquiries.email}`}>{content.quickEnquiries.email}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white p-8 pt-0 pb-[100px] xl:pb-[200px] white-bg-section"
        data-animation="fade"
        data-delay="0.5"
        data-duration="1.0"
      >
        <div className="max-w-[1400px] mx-auto">
          <h2 className="heading-small black font-semibold text-center mb-8">
            {content.whereToFindUs.heading}
          </h2>
          <div className="flex flex-row gap-[20px] flex-wrap justify-center">
            {content.whereToFindUs.branches.map((branch) => (
              <div key={branch.branchName} className="p-4 px-8 light-grey-bg w-full md:w-[calc(50%-20px)]">
                <div className="flex flex-row justify-between items-center gap-4">
                  <div className="flex flex-col">
                    <p className="black text-left font-semibold">{branch.branchName}</p>
                    <p className="black text-left max-w-[220px]">
                      {branch.locationLink ? (
                        <a
                          href={branch.locationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="decoration-transparent transition-colors underline hover:decoration-black"
                        >
                          {branch.location}
                        </a>
                      ) : (
                        branch.location
                      )}
                    </p>
                    <p className="black text-left">
                      <a
                        href={phoneHref(branch.phone)}
                        className="decoration-transparent transition-colors underline hover:decoration-black"
                      >
                        {branch.phone}
                      </a>
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <img src={branch.svgImageUrl} alt={`${branch.branchName} map`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-white pb-[50px] md:pb-[150px] white-bg-section overflow-hidden scroll-m-[150px]"
        data-animation="fade"
        data-delay="1.0"
        data-duration="1.0"
        id="section-4"
      >
        <div className="max-w-[1200px] mx-auto text-center">
          <h2
            className="heading-small mb-[50px] secondary-color"
            data-animation="fade"
            data-delay="0.6"
            data-duration="1.2"
          >
            Our LinkedIn Stories
          </h2>
          <LinkedInStoriesEmbed title="linkedin-stories" />
        </div>
      </section>
    </div>
  );
};

export default ContactPageContent;
