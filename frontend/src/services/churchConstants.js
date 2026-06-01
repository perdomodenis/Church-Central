export const COURTS = ['Main Campus', 'Downtown Campus'];

export const DEPARTMENTS = [
  'Senior Leadership',
  'Worship & Arts',
  'Youth Ministry',
  'Community Outreach',
  'Bible Study',
  'Children\'s Ministry',
  'Operations',
  'Prayer Ministry',
  'Music Ministry',
  'Discipleship',
  'Technology',
  'Communications',
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
