// GHL form configuration
// Read from environment variables with fallback defaults

export const GHL_FORM_ID = import.meta.env.PUBLIC_GHL_FORM_ID || 'oYUiMg4kenLeJuNDxiw0';

export const GHL_FORM_URL = `https://links.projectautomate.com/widget/form/${GHL_FORM_ID}`;
