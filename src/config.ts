import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Zine El Abidine Moualhi',
  subtitle: 'Demo Site',
  lang: 'en',
  themeHue: 250,
  banner: {
    enable: false,
    src: 'assets/images/demo-banner.png',
  },
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: 'GitHub',
      url: 'https://github.com/muandane',
      external: true,
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/demo-avatar.png',
  name: 'Zine El Abidine Moualhi',
  bio: 'Container-dwelling sorcerer crafting Kubernetes and Terraform enchantments 🧙‍♂️ 🔮.',
  links: [
    {
      name: 'Twitter',
      icon: 'fa6-brands:twitter',
      url: 'https://twitter.com/fatnorth',
    },
    // {
    //   name: 'Steam',
    //   icon: 'fa6-brands:steam',
    //   url: 'https://store.steampowered.com',
    // },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/muandane',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
