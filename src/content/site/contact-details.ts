export const contactDetails = {
  email: 'contact@archeritage.ma',
  phoneDisplay: '06 61 04 71 30',
  phoneHref: '+212661047130',
  addressLines: [
    'Rue Bachir IBRAHILI, Escalier F',
    'Étage 2, Apprt. 5 — La Gironde',
    'Casablanca, Maroc',
  ],
  streetAddress: 'Rue Bachir IBRAHILI, Escalier F, Étage 2, Apprt. 5 — La Gironde',
  city: 'Casablanca',
  country: 'Maroc',
  countryCode: 'MA',
} as const;

export const contactLinks = {
  email: `mailto:${contactDetails.email}`,
  phone: `tel:${contactDetails.phoneHref}`,
} as const;
