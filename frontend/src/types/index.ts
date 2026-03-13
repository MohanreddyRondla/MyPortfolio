export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export type HeroData = {
  name: string;
  title: string;
  tagline: string;
  resumeUrl?: string;
};

export type AboutCard = {
  title: string;
  description: string;
};

export type Skill = {
  name: string;
  description: string;
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
};

export type Experience = {
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
};

export type PortfolioData = {
  hero: HeroData;
  about: {
    paragraphs: string[];
    cards: AboutCard[];
  };
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  contact: {
    intro: string;
    links: ContactLink[];
  };
};

export type MessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

export type AdminMessagesResponse = {
  messages: MessageRecord[];
  meta: {
    total: number;
    storage: 'postgresql' | 'json-file';
    emailNotifications: boolean;
  };
};
