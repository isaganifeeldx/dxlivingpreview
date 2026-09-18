export type MenuLink = {
  label: string
  href: string
}

export type FloatingCtaAction = {
  label: string
  href: string
}

export type SiteSettingsData = {
  header: {
    navLinks: MenuLink[]
    login: MenuLink
    apply: MenuLink
    contact: MenuLink
  }
  footer: {
    tagline: string
    linkColumnTitle: string
    linkColumn: MenuLink[]
    modulesColumnTitle: string
    modulesColumn: MenuLink[]
    contact: {
      intro: string
      email: string
      phone: string
      phoneHref: string
      location: string
      locationHref: string
    }
    social: Array<{
      platform: 'facebook' | 'linkedin' | 'instagram' | 'youtube'
      href: string
    }>
    legalLinks: MenuLink[]
    copyright: string
  }
  floatingCta: {
    enabled: boolean
    whatsapp: FloatingCtaAction
    messenger: FloatingCtaAction
    support: FloatingCtaAction
    submitForm: FloatingCtaAction
    call: FloatingCtaAction
  }
  tracking: {
    googleTagHead: string
    googleTagBody: string
    metaPixel: string
    ahrefs: string
  }
}

export const siteSettingsDefaults: SiteSettingsData = {
  header: {
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Modules', href: '/modules' },
      { label: 'Projects', href: '/projects' },
      { label: 'About', href: '/about' },
      { label: 'Articles', href: '/articles' },
      { label: 'Contact', href: '/contact' },
    ],
    login: { label: 'Log in', href: '/login' },
    apply: { label: 'Apply', href: '/apply' },
    contact: { label: 'Contact', href: '/contact' },
  },
  footer: {
    tagline:
      "We help Australia's most discerning residential developers and architects bring unbuilt homes to life long before construction begins.",
    linkColumnTitle: 'Links',
    linkColumn: [
      { label: 'Home', href: '/' },
      { label: 'Modules', href: '/modules' },
      { label: 'Projects', href: '/projects' },
      { label: 'Suppliers', href: '/suppliers' },
      { label: 'About', href: '/about' },
      { label: 'Articles', href: '/articles' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
    modulesColumnTitle: 'Our Modules',
    modulesColumn: [
      { label: 'DX Studio', href: '/studio' },
      { label: 'DX Interiors', href: '/interiors' },
      { label: 'DX Model', href: '/model' },
      { label: 'DX Prestige', href: '/prestige' },
    ],
    contact: {
      intro:
        'Want to explore how DX LIVING can elevate your space? Get in touch we\'d love to hear from you.',
      email: 'contact@dxliving.com',
      phone: '1800 333 539',
      phoneHref: 'tel:1800333539',
      location: '44 Lakeview Drive, Scoresby VIC 3179, Australia',
      locationHref: 'https://maps.app.goo.gl/MC2gyhLwGvroMYoE7',
    },
    social: [
      { platform: 'facebook', href: 'https://www.facebook.com/dxlivingaustralia' },
      { platform: 'linkedin', href: 'https://www.linkedin.com/company/108389291' },
      { platform: 'instagram', href: 'https://www.instagram.com/dxliving.au/' },
      { platform: 'youtube', href: 'https://www.youtube.com/@DXLVNG' },
    ],
    legalLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
    ],
    copyright: '© 2026 DX Living. ALL RIGHTS RESERVED',
  },
  floatingCta: {
    // Floating menu + Support chat (reference1 ChatBox). Toggle off in Site > Settings if needed.
    enabled: true,
    whatsapp: { label: 'Whatsapp', href: 'https://wa.me/1800333539' },
    messenger: { label: 'Messenger', href: 'https://m.me/dxlivingaustralia' },
    support: { label: 'Support', href: 'mailto:contact@dxliving.com' },
    submitForm: { label: 'Submit Form', href: '/contact' },
    call: { label: 'Call', href: 'tel:1800333539' },
  },
  tracking: {
    // Mirrored from reference1 (GTM-PZ9N8QTR + Meta Pixel). Ahrefs ships inside GTM — leave empty.
    googleTagHead: `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZ9N8QTR');</script>`,
    googleTagBody: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PZ9N8QTR" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1734949674549899&ev=PageView&noscript=1" alt="" /></noscript>`,
    metaPixel: `<script>(function(f,b,e,v,n,t,s){
  if(f.__dxMetaPixelLoaded)return;
  f.__dxMetaPixelLoaded=true;
  if(f.fbq)return;
  n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s);
  fbq('init','1734949674549899');
  fbq('track','PageView');
})(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');</script>`,
    ahrefs: '',
  },
}
