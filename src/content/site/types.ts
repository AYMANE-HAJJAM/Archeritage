export type SiteCard = {
  title: string;
  text: string;
  points?: string[];
};

export type SiteSection = {
  eyebrow?: string;
  title: string;
  introduction?: string;
  cards?: SiteCard[];
  points?: string[];
  variant?: 'cards' | 'steps' | 'split' | 'list';
};

export type SitePage = {
  eyebrow: string;
  title: string;
  introduction: string;
  statement?: string;
  sections: SiteSection[];
  cta: {
    title: string;
    text: string;
    label: string;
    href: string;
  };
};
