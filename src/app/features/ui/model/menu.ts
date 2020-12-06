import { NavItem } from './nav-item';

export let menu: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconName: 'dashboard',
    route: 'dashboard'
  },
  {
    displayName: 'Contacts',
    iconName: 'face',
    route: 'contacts',
    children: [
      {
        displayName: 'Add Contact',
        iconName: 'account_box',
        route: 'contacts/add-contact'
      }
    ]
  },
  {
    displayName: 'User',
    iconName: 'face',
    route: 'user',
    children: [
      {
        displayName: 'Account Info',
        iconName: 'account_box',
        route: 'user/account-info'
      },
      {
        displayName: 'Profile Image',
        iconName: 'image',
        route: 'user/profile-image'
      }
    ]
  },
  {
      displayName: 'Sign Out',
      iconName: 'highlight_off'
  }
];
