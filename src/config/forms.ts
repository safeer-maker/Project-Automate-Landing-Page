// GHL Form and Booking Configuration
// Read from environment variables with fallback defaults

export const GHL_FORM_ID = import.meta.env.PUBLIC_GHL_FORM_ID || 'ZiepwgoZzuozaOg3NIkl';
export const GHL_BOOKING_ID = import.meta.env.PUBLIC_GHL_BOOKING_ID || 'UF6HdyNtYwKpZHABOBtL';

export const GHL_FORM_URL = `https://api.leadconnectorhq.com/widget/form/${GHL_FORM_ID}`;
export const GHL_BOOKING_URL = `https://api.leadconnectorhq.com/widget/booking/${GHL_BOOKING_ID}`;
