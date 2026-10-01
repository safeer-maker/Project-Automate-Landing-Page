// Footer and social details, mirrored from the main website's src/data/site.ts
// and src/data/nav.ts so the landing page carries the same footer. Internal
// website links are absolute, since this page lives on its own host.

const SITE_URL = 'https://projectautomate.com';

type Link = { label: string; href: string };

const siteLinks = (links: Link[]): Link[] =>
  links.map((link) => ({ ...link, href: `${SITE_URL}${link.href}` }));

export const siteInfo = {
  name: 'PROJECT: automate',
  legalName: 'Project Automate Inc.',
  tagline:
    'The art of invisible intelligence. Custom smart home systems for the world’s most refined residences.',
  url: SITE_URL,
  email: 'sales@projectautomate.com',
  // The A2P 10DLC registered number; the website footer shows this one only.
  smsPhone: '(310) 402-4818',
  address: {
    line1: '1600 Rosecrans Ave Building 7, Suite 400',
    line2: 'Manhattan Beach, CA 90266',
  },
  // Each `icon` names its logo in public/images/social/.
  social: [
    { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/project_automate' },
    {
      label: 'LinkedIn',
      icon: 'linkedin',
      href: 'https://www.linkedin.com/company/projectautomate/',
    },
    { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/ProjectAutomate' },
    { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/project-automate' },
    { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@projectautomate' },
  ] as const,
  credit: { label: 'Powered by AI Media', href: 'https://aimedia.design/' },
};

export type SocialIcon = (typeof siteInfo.social)[number]['icon'];

// Each network's logo at its rendered size. The marks have different shapes,
// so each is sized to carry the same visual weight.
export const socialLogos: Record<SocialIcon, { width: number; height: number }> = {
  instagram: { width: 28, height: 28 },
  linkedin: { width: 28, height: 28 },
  facebook: { width: 28, height: 28 },
  youtube: { width: 34, height: 24 },
  tiktok: { width: 25, height: 28 },
};

export const footerQuickLinks = siteLinks([
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Design Partner', href: '/design-partners/' },
  { label: 'Journal', href: '/blog/' },
  { label: 'Contact Us', href: '/schedule/' },
]);

// One line per website service pillar, each opening its lead service.
export const footerServices = siteLinks([
  { label: 'Control & Climate', href: '/control-systems/' },
  { label: 'Light & Shade', href: '/lighting-control-systems/' },
  { label: 'Private Entertainment', href: '/home-theater/' },
  { label: 'Outdoor Living', href: '/outdoor-living/' },
  { label: 'Security & Access', href: '/security-systems/' },
  { label: 'Concierge Care', href: '/technology-support-membership/' },
]);

export const solutionsHub = `${SITE_URL}/solutions/`;

export const footerMenu = siteLinks([
  { label: 'Success Stories', href: '/success-stories/' },
  { label: 'Inspiration', href: '/get-inspired/' },
  { label: 'Brands', href: '/brands/' },
  { label: 'HTA Budget Calculator', href: '/budget-calculator/' },
]);

export const legalLinks = siteLinks([
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions/' },
]);
