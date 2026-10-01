// GHL form configuration
// Read from environment variables with fallback defaults

export const GHL_FORM_ID = import.meta.env.PUBLIC_GHL_FORM_ID || 'fapRkzoUEgzfgU07jlnQ';

export const GHL_FORM_URL = `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}`;
