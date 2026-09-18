'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnimatedButton from '@/components/ui/AnimatedButton';

const HubSpotNewsletter: React.FC = () => {
  const pathname = usePathname();
  const [formData, setFormData] = useState({ firstName: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('');

  useEffect(() => {
    const pageName =
      pathname === '/'
        ? 'home'
        : pathname.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' - ');
    setCurrentPage(pageName.charAt(0).toUpperCase() + pageName.slice(1));
  }, [pathname]);

  // Function to submit form data directly to HubSpot API
  const submitToHubSpot = async (formData: { firstName: string; email: string }) => {
    const portalId = '143756519'; // Your HubSpot Portal ID
    const formId = '6eb58708-664b-4091-bd43-e052a30e5626'; // Your HubSpot Form ID
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: [
            {
              name: 'firstname',
              value: formData.firstName
            },
            {
              name: 'email',
              value: formData.email
            },
            {
              name: 'hs_analytics_source',
              value: 'Website'
            },
            {
              name: 'hs_analytics_source_data_1',
              value: window.location.href
            },
            {
              name: 'hs_analytics_source_data_2',
              value: currentPage
            },
            {
              name: 'hs_lead_status',
              value: 'NEW'
            },
            {
              name: 'lifecyclestage',
              value: 'lead'
            }
          ],
          context: {
            hutk: document.cookie.match(/hubspotutk=(.*?);/)?.[1] || null,
            pageUri: window.location.href,
            pageName: currentPage
          }
        })
      });

      if (response.ok) {
        //console.log(`Form submitted successfully to HubSpot from page: ${currentPage} (${window.location.href})`);
        return { success: true };
      } else {
        console.error('Error submitting form to HubSpot:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      console.error('Network error submitting form to HubSpot:', error);
      return { success: false, error: 'Network error' };
    }
  };

  // Handle form input changes
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, firstName: e.target.value }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, email: e.target.value }));
  };

  // Clear notification after 5 seconds
  const clearNotification = () => {
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.firstName.trim() || !formData.email.trim()) {
      setNotification({ message: 'Please fill in all fields', type: 'error' });
      clearNotification();
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitToHubSpot(formData);
      
      if (result.success) {
        // Reset form data after successful submission
        setFormData({ firstName: '', email: '' });
        setNotification({ message: 'Thank you for subscribing!', type: 'success' });
        clearNotification();
      } else {
        setNotification({ message: 'Form submission failed. Please try again.', type: 'error' });
        clearNotification();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setNotification({ message: 'Form submission failed. Please try again.', type: 'error' });
      clearNotification();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <p tabIndex={2}>Subscribe for access to exclusive events and project reveals.</p>
      
      {/* Custom Form */}
      <form className="flex items-start gap-2 flex-col w-full" onSubmit={handleFormSubmit}>
        <input 
          type="text" 
          placeholder="First Name" 
          value={formData.firstName}
          onChange={handleFirstNameChange}
          className="bg-transparent border-b border-[#6A758C] px-0 py-2 w-full" 
          tabIndex={2} 
          aria-label="First Name"
          disabled={isSubmitting}
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={formData.email}
          onChange={handleEmailChange}
          className="bg-transparent border-b border-[#6A758C] px-0 py-2 w-full" 
          tabIndex={2} 
          aria-label="Email"
          disabled={isSubmitting}
        />

        {/* Submit Button */}
        <AnimatedButton
          type="submit"
          className="white-bg text-white text-sm z-50 uppercase mt-4 relative"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Subscribing...' : 'Sign Up Now'}
        </AnimatedButton>
      </form>

      {/* Notification Message */}
      {notification && (
        <div 
          className={`mt-4 p-3 rounded-md text-sm transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default HubSpotNewsletter;
