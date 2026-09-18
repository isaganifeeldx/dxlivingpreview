export interface FormData {
  fullName: string;
  brandName: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  productOverview: string;
  additionalNotes: string;
  nationallyDelivered: string;
  business_based: string;
  consent: string;
  confirm: boolean;
  services: string[];
  market: string[];
  clients: string[];
  digitalAssets: string[];
  interests: string[];
  productCatalogue: FileList | null;
}

export const submitToHubSpot = async (formData: FormData) => {
  const portalId = '143756519';
  const formId = 'a2489c50-a84b-4b9f-86a9-4d5fa9ab548d';
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  const requestBody = {
    fields: [
      { name: 'firstname', value: formData.fullName },
      { name: 'company', value: formData.brandName },
      { name: 'email', value: formData.email },
      { name: 'phone', value: formData.phone },
      { name: '0-2/website', value: formData.website },
      { name: 'hs_linkedin_url', value: formData.linkedin },
      { name: 'TICKET.product_categories', value: formData.services.join('; ') },
      { name: 'TICKET.market_segment', value: formData.market.join('; ') },
      { name: 'TICKET.business_based', value: formData.business_based || '' },
      { name: 'TICKET.deliver_products_nationally', value: formData.nationallyDelivered || '' },
      { name: 'TICKET.typical_clients', value: formData.clients.join('; ') },
      { name: 'TICKET.digital_assets', value: formData.digitalAssets.join('; ') },
      { name: 'TICKET.product_range', value: formData.productOverview || '' },
      { name: 'TICKET.interested', value: formData.interests.join('; ') },
      { name: 'additional_notes', value: formData.additionalNotes || '' },
      {
        name: 'TICKET.upload_files',
        value:
          formData.productCatalogue && formData.productCatalogue.length > 0
            ? `Files uploaded: ${Array.from(formData.productCatalogue)
                .map((file) => file.name)
                .join(', ')}`
            : 'No files uploaded',
      },
      { name: 'consent', value: formData.consent || '' },
      { name: 'agree_to_the_terms', value: formData.confirm ? 'Yes' : 'No' },
      { name: 'hs_analytics_source', value: 'Website' },
      { name: 'hs_analytics_source_data_1', value: window.location.href },
      { name: 'hs_analytics_source_data_2', value: 'Apply Page' },
      { name: 'hs_lead_status', value: 'NEW' },
      { name: 'lifecyclestage', value: 'lead' },
    ],
    context: {
      hutk: document.cookie.match(/hubspotutk=(.*?);/)?.[1] || null,
      pageUri: window.location.href,
      pageName: 'Apply Page',
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      return { success: true as const };
    }

    const errorText = await response.text();

    try {
      const errorData = JSON.parse(errorText) as {
        errors?: Array<{ errorType?: string; message?: string }>;
      };
      const missingFields = (errorData.errors ?? [])
        .filter((err) => err.errorType === 'REQUIRED_FIELD')
        .map((err) => {
          const fieldMatch = err.message?.match(/Required field '([^']+)' is missing/);
          return fieldMatch ? fieldMatch[1] : '';
        })
        .filter(Boolean);

      if (missingFields.length > 0) {
        return {
          success: false as const,
          error: `Please complete the following required fields: ${missingFields.join(', ')}`,
        };
      }
    } catch {
      // Parse failure: fall through to generic message.
    }

    return {
      success: false as const,
      error: 'Form submission failed. Please check all required fields and try again.',
    };
  } catch {
    return { success: false as const, error: 'Network error' };
  }
};
