export const COURTS = ['Glory Court', 'Hope Court', 'Praise Court'];

export const DISTRICTS = ['District 1', 'District 2', 'District 3', 'District 4'];

export const SOW_CLASSES = [
  'King David',
  'JEREMIAH',
  'ANTIOCH',
  'KING SOLOMON',
  'TIMOTHY',
  'EPHESIANS (German)'
];

export const DEPARTMENTS = [
  'Disciples Training Ministry (DTM)',
  'Glorious Vessels of Virtue (GVV)',
  'Faithful Men Ecclessia (FaME)',
  'Outreach',
  'Protocol',
  'Prayer ministry',
  'Media Ministry',
  'Finance and administration',
  'Anointed Psalmists',
  'Judah Ecclesiastes',
  'Zamar',
  'Olives',
  'General'
];

export const ROLES = [
  'Visitor',
  'Member',
  'Co-Leader',
  'Leader',
  'Deacon',
  'Pastor',
  'Admin',
  'Reverend',
  'Bishop'
];

export const getAccessLevel = (role) => {
  if (['Bishop', 'Reverend', 'Admin'].includes(role)) return 4;
  if (['Pastor', 'Deacon', 'Leader'].includes(role)) return 3;
  if (['Member', 'Co-Leader'].includes(role)) return 2;
  return 1; // Visitor
};
