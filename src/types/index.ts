export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type FooterLink = {
  label: string;
  href: string;
};

export type ExpertiseVisualType = 'diagnostic' | 'restoration' | 'reconversion' | 'investor' | 'studies' | 'site';

export type Service = {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  intro: string;
  image?: string;
  altText?: string;
  visualType: ExpertiseVisualType;
  visualLabel: string;
  icon: string;
  highlights: string[];
  process: string[];
  relatedProjectSlugs: string[];
};

export type ProjectCategory =
  | 'patrimoine-religieux'
  | 'kasbahs-medinas'
  | 'equipements-culturels'
  | 'sites-historiques'
  | 'etudes-conseils';

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  location: string;
  year: string;
  surface?: string;
  excerpt: string;
  description: string;
  coverImage: string;
  altText: string;
  heroImage: string;
  gallery: string[];
  serviceSlugs: string[];
};

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  coverImage: string;
  altText: string;
  heroImage: string;
  content: string[];
  relatedPostSlugs: string[];
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type Stat = {
  value: string;
  label: string;
  detail: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  altText: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  alt: string;
};

export type FooterGroup = {
  title: string;
  links: FooterLink[];
};
