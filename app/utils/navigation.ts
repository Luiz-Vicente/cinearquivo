export interface NavItem {
  to: string
  labelKey: string
  icon: string
  /** Only shown in the mobile bottom bar (the header has its own search button). */
  mobileOnly?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', labelKey: 'nav.home', icon: 'house' },
  { to: '/movies', labelKey: 'nav.movies', icon: 'film' },
  { to: '/shorts', labelKey: 'nav.shorts', icon: 'clapperboard' },
  { to: '/decades', labelKey: 'nav.decades', icon: 'calendar-range' },
  { to: '/search', labelKey: 'nav.search', icon: 'search', mobileOnly: true },
  { to: '/my-list', labelKey: 'nav.myList', icon: 'bookmark' },
]
