export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  message: string;
  uploadedFiles: File[];
}

export const submitContactToHubSpot = async (formData: ContactFormData) => {
  const portalId = '143756519';
  const formId = '7ed58ccd-5c67-488f-ad9a-e155dc2ad966';
  const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`;

  const requestBody = {
    fields: [
      { name: 'firstname', value: formData.firstName },
      { name: 'lastname', value: formData.lastName },
      { name: 'email', value: formData.email },
      { name: '0-2/name', value: formData.company },
      { name: 'phone', value: formData.phone },
      { name: 'TICKET.service_of_interest', value: formData.projectType },
      { name: 'message', value: formData.message },
      {
        name: 'upload_files',
        value:
          formData.uploadedFiles.length > 0
            ? `Files uploaded: ${formData.uploadedFiles.map((file) => file.name).join(', ')}`
            : 'No files uploaded',
      },
      { name: 'hs_analytics_source', value: 'Website' },
      { name: 'hs_analytics_source_data_1', value: window.location.href },
      { name: 'hs_analytics_source_data_2', value: 'Contact Page' },
      { name: 'hs_lead_status', value: 'NEW' },
      { name: 'lifecyclestage', value: 'lead' },
    ],
    context: {
      hutk: document.cookie.match(/hubspotutk=(.*?);/)?.[1] || null,
      pageUri: window.location.href,
      pageName: 'Contact Page',
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
      // fall through
    }

    return { success: false as const, error: 'Form submission failed. Please check all required fields and try again.' };
  } catch {
    return { success: false as const, error: 'Network error' };
  }
};
