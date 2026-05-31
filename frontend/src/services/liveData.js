import { rtdb } from './firebase';
import { ref, set } from 'firebase/database';
import { 
  upsertUserProfile, 
  createAnnouncement, 
  createEvent, 
  createBaptism 
} from '../lib/dataconnect';

// Get current date/time for realistic timestamps
const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Helper to create timestamps
const minutesAgo = (mins) => new Date(Date.now() - mins * 60 * 1000).toISOString();
const hoursAgo = (hours) => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

// Get date strings
const todayStr = today.toISOString().split('T')[0];
const tomorrowStr = new Date(today.getTime() + 24*60*60*1000).toISOString().split('T')[0];
const day3Str = new Date(today.getTime() + 2*24*60*60*1000).toISOString().split('T')[0];
const day4Str = new Date(today.getTime() + 3*24*60*60*1000).toISOString().split('T')[0];
const day5Str = new Date(today.getTime() + 4*24*60*60*1000).toISOString().split('T')[0];

// LIVE CHURCH DATA
export const LIVE_CHURCH_INFO = {
  name: 'Grace Community Church',
  shortName: 'GCC',
  email: 'info@gracecommunity.church',
  phone: '+1 (555) 123-4567',
  address: '1847 Oak Ridge Drive, Denver, CO 80206',
  city: 'Denver',
  state: 'Colorado',
  country: 'USA',
  website: 'www.gracecommunity.church',
  founded: 2008,
  description: 'A vibrant community of believers dedicated to spiritual growth, community service, and spreading the Gospel of Jesus Christ.',
  mainServiceTime: 'Sundays 10:00 AM',
  serviceLanguages: ['English', 'Spanish'],
  campuses: [
    { name: 'Main Campus', address: '1847 Oak Ridge Drive, Denver, CO 80206', phone: '+1 (555) 123-4567' },
    { name: 'Downtown Campus', address: '450 Market Street, Denver, CO 80202', phone: '+1 (555) 123-4568' }
  ],
  status: 'LIVE',
  lastUpdated: now.toISOString(),
  activeUsers: 47,
  totalMembers: 1250
};

// LIVE ACTIVE MEMBERS
export const LIVE_MEMBERS = [
  {
    uid: 'pastor_001',
    email: 'pastor.james@gracecommunity.church',
    first: 'James',
    last: 'Peterson',
    dept: 'Senior Leadership',
    position: 'Senior Pastor',
    campus: 'Main Campus',
    bio: '20+ years of ministry. Leading with passion and grace.',
    interests: ['Preaching', 'Leadership', 'Prayer'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    joined: '2008-01-15',
    lastActive: minutesAgo(15),
    status: 'online',
    recentActivity: 'Posted news about this Sunday service'
  },
  {
    uid: 'pastor_002',
    email: 'pastor.rachel@gracecommunity.church',
    first: 'Rachel',
    last: 'Thompson',
    dept: 'Worship & Arts',
    position: 'Worship Pastor',
    campus: 'Main Campus',
    bio: 'Director of worship with authentic passion for God.',
    interests: ['Music', 'Worship', 'Teaching'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    joined: '2012-03-22',
    lastActive: minutesAgo(8),
    status: 'online',
    recentActivity: 'Commented on worship practice'
  },
  {
    uid: 'member_001',
    email: 'juan.rivera@email.com',
    first: 'Juan',
    last: 'Rivera',
    dept: 'Youth Ministry',
    position: 'Youth Director',
    campus: 'Main Campus',
    bio: 'Dedicated to the next generation. Believer in mentorship.',
    interests: ['Youth', 'Sports', 'Leadership'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    joined: '2015-08-10',
    lastActive: minutesAgo(32),
    status: 'online',
    recentActivity: 'Sent message in Youth Ministry group'
  },
  {
    uid: 'member_002',
    email: 'sofia.garcia@email.com',
    first: 'Sofia',
    last: 'Garcia',
    dept: 'Community Outreach',
    position: 'Outreach Coordinator',
    campus: 'Downtown Campus',
    bio: 'Passionate about serving the underserved.',
    interests: ['Community Service', 'Missions'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    joined: '2016-05-20',
    lastActive: hoursAgo(2),
    status: 'away',
    recentActivity: 'Registered for food bank volunteer'
  },
  {
    uid: 'member_003',
    email: 'mark.anderson@email.com',
    first: 'Mark',
    last: 'Anderson',
    dept: 'Bible Study',
    position: 'Bible Study Leader',
    campus: 'Main Campus',
    bio: 'Seminary graduate. Deep in scripture daily.',
    interests: ['Bible Study', 'Theology'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    joined: '2014-02-14',
    lastActive: minutesAgo(45),
    status: 'online',
    recentActivity: 'Posted discussion about Psalms'
  },
  {
    uid: 'member_004',
    email: 'maria.santos@email.com',
    first: 'Maria',
    last: 'Santos',
    dept: 'Children\'s Ministry',
    position: 'Children\'s Director',
    campus: 'Main Campus',
    bio: 'Nurturing the next generation with love.',
    interests: ['Children', 'Education'],
    profilePhoto: 'https://images.unsplash.com/photo-1507214159351-0e6658ffb367?auto=format&fit=crop&w=400&q=60',
    joined: '2017-09-05',
    lastActive: hoursAgo(1),
    status: 'away',
    recentActivity: 'Updated VBS registration details'
  },
  {
    uid: 'member_005',
    email: 'david.lee@email.com',
    first: 'David',
    last: 'Lee',
    dept: 'Operations',
    position: 'Church Administrator',
    campus: 'Main Campus',
    bio: 'Keeping things running smoothly.',
    interests: ['Organization', 'Technology'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    joined: '2013-06-01',
    lastActive: minutesAgo(5),
    status: 'online',
    recentActivity: 'Updated facility schedule'
  },
  {
    uid: 'member_006',
    email: 'patricia.white@email.com',
    first: 'Patricia',
    last: 'White',
    dept: 'Prayer Ministry',
    position: 'Prayer Coordinator',
    campus: 'Downtown Campus',
    bio: 'Interceding for our community daily.',
    interests: ['Prayer', 'Intercession'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    joined: '2010-11-18',
    lastActive: minutesAgo(20),
    status: 'online',
    recentActivity: 'Shared prayer request'
  },
  {
    uid: 'member_007',
    email: 'thomas.brown@email.com',
    first: 'Thomas',
    last: 'Brown',
    dept: 'Music Ministry',
    position: 'Worship Band - Drums',
    campus: 'Main Campus',
    bio: 'Bringing energy and joy to worship.',
    interests: ['Music', 'Drums'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    joined: '2018-01-10',
    lastActive: hoursAgo(3),
    status: 'offline',
    recentActivity: 'Confirmed for Sunday practice'
  },
  {
    uid: 'member_008',
    email: 'sarah.johnson@email.com',
    first: 'Sarah',
    last: 'Johnson',
    dept: 'Discipleship',
    position: 'Small Groups Leader',
    campus: 'Main Campus',
    bio: 'Building disciples one group at a time.',
    interests: ['Discipleship', 'Community'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    joined: '2019-03-17',
    lastActive: minutesAgo(12),
    status: 'online',
    recentActivity: 'Started small group discussion'
  },
  {
    uid: 'member_009',
    email: 'michael.chen@email.com',
    first: 'Michael',
    last: 'Chen',
    dept: 'Technology',
    position: 'IT Support',
    campus: 'Main Campus',
    bio: 'Tech volunteer keeping us connected.',
    interests: ['Technology', 'Streaming'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    joined: '2020-02-09',
    lastActive: minutesAgo(3),
    status: 'online',
    recentActivity: 'Fixed streaming setup'
  },
  {
    uid: 'member_010',
    email: 'elena.rodriguez@email.com',
    first: 'Elena',
    last: 'Rodriguez',
    dept: 'Communications',
    position: 'Social Media Coordinator',
    campus: 'Downtown Campus',
    bio: 'Sharing our story with the world.',
    interests: ['Communications', 'Social Media'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    joined: '2021-05-12',
    lastActive: minutesAgo(2),
    status: 'online',
    recentActivity: 'Posted service reminder'
  }
];

// LIVE FEED POSTS (Recent activity)
export const LIVE_FEED_POSTS = [
  {
    id: 1,
    author: 'Elena Rodriguez',
    authorId: 'member_010',
    timestamp: minutesAgo(8),
    content: '🙏 Reminder: Sunday service starts at 10 AM! Both campuses open. Bring your family and friends!',
    scope: 'News',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    likes: 23,
    comments: [
      { author: 'Sarah Johnson', text: 'See you there! 🙌', timestamp: minutesAgo(5) },
      { author: 'David Lee', text: 'Setup is ready!', timestamp: minutesAgo(3) }
    ]
  },
  {
    id: 2,
    author: 'James Peterson',
    authorId: 'pastor_001',
    timestamp: minutesAgo(47),
    content: 'What an amazing evening of prayer last night! Feeling God\'s presence deeply. Join us again Wednesday at 7 PM.',
    scope: 'News',
    category: 'Update',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80',
    likes: 34,
    comments: [
      { author: 'Patricia White', text: 'Amen! The Spirit was moving!', timestamp: minutesAgo(42) },
      { author: 'Mark Anderson', text: 'Powerful night of intercession', timestamp: minutesAgo(35) }
    ]
  },
  {
    id: 3,
    author: 'Juan Rivera',
    authorId: 'member_001',
    timestamp: hoursAgo(1),
    content: 'Youth group had 28 kids tonight! So energized by their passion for Jesus. Summer camp registration closes FRIDAY!',
    scope: 'News',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    likes: 45,
    comments: [
      { author: 'Rachel Thompson', text: 'What an amazing group of teenagers!', timestamp: hoursAgo(58) },
      { author: 'Maria Santos', text: 'Great to see so many young believers', timestamp: minutesAgo(50) }
    ]
  },
  {
    id: 4,
    author: 'Sofia Garcia',
    authorId: 'member_002',
    timestamp: hoursAgo(2),
    content: 'Food bank volunteer day tomorrow at 9 AM! We need 20 volunteers to pack food for 500 families. Who\'s in? 🙋',
    scope: 'News',
    category: 'Volunteer',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    likes: 67,
    comments: [
      { author: 'Patricia White', text: 'Signed up! Count me in!', timestamp: hoursAgo(119) },
      { author: 'Michael Chen', text: 'I\'ll be there!', timestamp: hoursAgo(115) },
      { author: 'Sarah Johnson', text: 'Bringing my small group!', timestamp: hoursAgo(110) }
    ]
  },
  {
    id: 5,
    author: 'Rachel Thompson',
    authorId: 'pastor_002',
    timestamp: hoursAgo(3),
    content: 'Worship band rehearsal was incredible! Sunday\'s service is going to blow your mind. New songs, fresh arrangements, pure worship.',
    scope: 'News',
    category: 'Update',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    likes: 56,
    comments: [
      { author: 'Thomas Brown', text: 'Can\'t wait to lead worship together!', timestamp: hoursAgo(178) }
    ]
  },
  {
    id: 6,
    author: 'Maria Santos',
    authorId: 'member_004',
    timestamp: hoursAgo(4),
    content: 'VBS 2025 is only 2 WEEKS away! "Adventure in Faith" - Ages 3-12. 23 kids already registered! Space is filling fast!',
    scope: 'News',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1503454537688-e0ce8a41f600?auto=format&fit=crop&w=800&q=80',
    likes: 78,
    comments: [
      { author: 'Sarah Johnson', text: 'My kids can\'t wait!', timestamp: hoursAgo(234) },
      { author: 'Elena Rodriguez', text: 'Volunteering as a team leader!', timestamp: hoursAgo(230) },
      { author: 'Patricia White', text: 'What an awesome event this will be!', timestamp: hoursAgo(225) }
    ]
  },
  {
    id: 7,
    author: 'Mark Anderson',
    authorId: 'member_003',
    timestamp: hoursAgo(5),
    content: 'Bible Study Discussion: How do we balance faith and works? Join us Wednesday 7 PM to explore Romans 3:28 and James 2:26. Deep dive!',
    scope: 'News',
    category: 'Discussion',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80',
    likes: 28,
    comments: [
      { author: 'David Lee', text: 'Great passage to study!', timestamp: hoursAgo(298) },
      { author: 'Patricia White', text: 'This is such an important topic!', timestamp: hoursAgo(290) }
    ]
  },
  {
    id: 8,
    author: 'Church Leadership',
    authorId: 'pastor_001',
    timestamp: daysAgo(1),
    content: '🙏 Prayer Request: Please lift up the Martinez family. They lost their home to a fire yesterday. God is faithful!',
    scope: 'News',
    category: 'Prayer Request',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    likes: 95,
    comments: [
      { author: 'Patricia White', text: 'We are praying without ceasing!', timestamp: daysAgo(1440) },
      { author: 'Sarah Johnson', text: 'Our group is holding them in prayer', timestamp: daysAgo(1435) },
      { author: 'Elena Rodriguez', text: 'Let me know how we can help', timestamp: daysAgo(1430) }
    ]
  }
];

// LIVE CHURCH EVENTS (Today, tomorrow, and upcoming)
export const LIVE_CHURCH_EVENTS = [
  {
    id: 'event_today_1',
    title: 'Food Bank Volunteer Drive',
    date: todayStr,
    time: '09:00 AM',
    endTime: '12:00 PM',
    location: 'Denver Food Bank, 250 Park Ave W',
    description: 'Pack food for 500 families. Bring your friends!',
    type: 'Volunteer',
    capacity: 50,
    registered: 18,
    createdBy: 'member_002',
    createdByName: 'Sofia Garcia'
  },
  {
    id: 'event_today_2',
    title: 'Worship Band Practice',
    date: todayStr,
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Main Campus - Worship Center',
    description: 'Preparing for Sunday service. All musicians welcome!',
    type: 'Music',
    capacity: 30,
    registered: 12,
    createdBy: 'pastor_002',
    createdByName: 'Rachel Thompson'
  },
  {
    id: 'event_sunday_1',
    title: '🙏 Sunday Worship Service',
    date: tomorrowStr,
    time: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Main Campus - Sanctuary',
    description: 'Weekly worship gathering. Coffee in lobby before service.',
    type: 'Worship',
    capacity: 500,
    registered: 287,
    recurring: 'weekly',
    createdBy: 'pastor_001',
    createdByName: 'James Peterson'
  },
  {
    id: 'event_sunday_2',
    title: '🙏 Sunday Worship Service - Downtown',
    date: tomorrowStr,
    time: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Downtown Campus - Main Hall',
    description: 'Bilingual service (English/Spanish). All welcome!',
    type: 'Worship',
    capacity: 250,
    registered: 142,
    recurring: 'weekly',
    createdBy: 'pastor_001',
    createdByName: 'James Peterson'
  },
  {
    id: 'event_sunday_3',
    title: 'Youth Group - Post Service',
    date: tomorrowStr,
    time: '12:00 PM',
    endTime: '02:00 PM',
    location: 'Main Campus - Youth Room',
    description: 'Lunch and fellowship after Sunday service. Ages 13-18.',
    type: 'Youth',
    capacity: 80,
    registered: 34,
    createdBy: 'member_001',
    createdByName: 'Juan Rivera'
  },
  {
    id: 'event_wed_1',
    title: '📖 Bible Study - Psalms Series',
    date: day3Str,
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Main Campus - Fellowship Hall',
    description: 'Deep study of Psalms. Coffee & snacks provided.',
    type: 'Education',
    capacity: 75,
    registered: 42,
    recurring: 'weekly',
    createdBy: 'member_003',
    createdByName: 'Mark Anderson'
  },
  {
    id: 'event_wed_2',
    title: '🙏 Prayer Night',
    date: day3Str,
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Main Campus - Prayer Room',
    description: 'Intercession for church, community, and missions.',
    type: 'Prayer',
    capacity: 50,
    registered: 23,
    recurring: 'weekly',
    createdBy: 'member_006',
    createdByName: 'Patricia White'
  },
  {
    id: 'event_summer_camp',
    title: '⛺ Youth Summer Camp',
    date: day4Str,
    time: '08:00 AM',
    endTime: day5Str + 'T05:00 PM',
    location: 'Rocky Mountain Camp, Estes Park CO',
    description: 'Overnight camp for ages 13-18. Games, worship, teaching, friendship!',
    type: 'Youth',
    capacity: 120,
    registered: 34,
    createdBy: 'member_001',
    createdByName: 'Juan Rivera'
  }
];

// LIVE BAPTISM EVENTS
export const LIVE_BAPTISM_EVENTS = [
  {
    id: 'baptism_this_week',
    title: 'Water Baptism Service',
    date: day4Str,
    time: '09:00 AM',
    location: 'Main Campus - Outdoor Baptismal Pool',
    description: 'Public declaration of faith. Come celebrate with us!',
    capacity: 30,
    registeredCount: 12,
    createdAt: hoursAgo(6),
    createdBy: 'pastor_001',
    createdByName: 'James Peterson'
  },
  {
    id: 'baptism_july',
    title: 'Water Baptism Service - July',
    date: '2025-07-20',
    time: '10:00 AM',
    location: 'Downtown Campus - Baptismal Pool',
    description: 'Summer baptism celebration. All welcome!',
    capacity: 25,
    registeredCount: 8,
    createdAt: daysAgo(5),
    createdBy: 'pastor_002',
    createdByName: 'Rachel Thompson'
  },
  {
    id: 'baptism_youth',
    title: 'Youth Water Baptism',
    date: day5Str,
    time: '02:00 PM',
    location: 'Main Campus - Youth Area',
    description: 'Special service for teens ready to take their faith public!',
    capacity: 20,
    registeredCount: 5,
    createdAt: daysAgo(3),
    createdBy: 'member_001',
    createdByName: 'Juan Rivera'
  }
];

// LIVE CHAT MESSAGES (Recent conversations)
export const LIVE_CHAT_MESSAGES = {
  'member_001_member_002': {
    participants: ['member_001', 'member_002'],
    participantNames: { 'member_001': 'Juan Rivera', 'member_002': 'Sofia Garcia' },
    messages: [
      { userId: 'member_002', userName: 'Sofia', text: 'Hey Juan! How was youth group tonight?', timestamp: minutesAgo(35) },
      { userId: 'member_001', userName: 'Juan', text: 'Amazing! 28 kids showed up. The energy was incredible', timestamp: minutesAgo(33) },
      { userId: 'member_002', userName: 'Sofia', text: 'That\'s awesome! Summer camp?', timestamp: minutesAgo(32) },
      { userId: 'member_001', userName: 'Juan', text: 'Already 34 registered. It\'s filling up fast!', timestamp: minutesAgo(30) }
    ]
  },
  'pastor_001_member_006': {
    participants: ['pastor_001', 'member_006'],
    participantNames: { 'pastor_001': 'James Peterson', 'member_006': 'Patricia White' },
    messages: [
      { userId: 'member_006', userName: 'Patricia', text: 'Pastor James, the prayer chain for the Martinez family is active', timestamp: minutesAgo(25) },
      { userId: 'pastor_001', userName: 'James', text: 'Thank you Patricia. Their house is gone but their faith is strong', timestamp: minutesAgo(23) },
      { userId: 'member_006', userName: 'Patricia', text: 'We\'re collecting funds. Already $3,500!', timestamp: minutesAgo(20) },
      { userId: 'pastor_001', userName: 'James', text: 'This is Christ\'s love in action. Praise God!', timestamp: minutesAgo(18) }
    ]
  },
  'member_004_member_008': {
    participants: ['member_004', 'member_008'],
    participantNames: { 'member_004': 'Maria Santos', 'member_008': 'Sarah Johnson' },
    messages: [
      { userId: 'member_008', userName: 'Sarah', text: 'Maria! VBS looks amazing this year', timestamp: minutesAgo(55) },
      { userId: 'member_004', userName: 'Maria', text: 'Right?? We have 23 kids registered already!', timestamp: minutesAgo(53) },
      { userId: 'member_008', userName: 'Sarah', text: 'My kids are SO excited', timestamp: minutesAgo(50) },
      { userId: 'member_004', userName: 'Maria', text: 'Can you help with crafts station?', timestamp: minutesAgo(48) },
      { userId: 'member_008', userName: 'Sarah', text: 'Absolutely! When do we meet to plan?', timestamp: minutesAgo(46) }
    ]
  }
};

// LIVE GROUP CHATS (Active groups)
export const LIVE_GROUP_CHATS = {
  'youth_ministry': {
    type: 'group',
    name: 'Youth Ministry',
    creatorId: 'member_001',
    members: ['member_001', 'member_005', 'member_009', 'member_010'],
    memberNames: {
      'member_001': 'Juan Rivera',
      'member_005': 'David Lee',
      'member_009': 'Michael Chen',
      'member_010': 'Elena Rodriguez'
    },
    isPublic: true,
    createdAt: daysAgo(30),
    messages: [
      { userId: 'member_001', userName: 'Juan', text: '28 kids tonight!!! So blessed', timestamp: minutesAgo(32) },
      { userId: 'member_005', userName: 'David', text: 'Praise God! The youth are excited!', timestamp: minutesAgo(30) },
      { userId: 'member_009', userName: 'Michael', text: 'Stream quality was great tonight', timestamp: minutesAgo(28) },
      { userId: 'member_010', userName: 'Elena', text: 'Posted recap on social media!', timestamp: minutesAgo(25) }
    ]
  },
  'prayer_warriors': {
    type: 'group',
    name: 'Prayer Warriors',
    creatorId: 'member_006',
    members: ['member_006', 'pastor_001', 'member_008', 'member_003'],
    memberNames: {
      'member_006': 'Patricia White',
      'pastor_001': 'James Peterson',
      'member_008': 'Sarah Johnson',
      'member_003': 'Mark Anderson'
    },
    isPublic: false,
    createdAt: daysAgo(60),
    messages: [
      { userId: 'member_006', userName: 'Patricia', text: 'Prayer request: Martinez family needs shelter', timestamp: hoursAgo(2) },
      { userId: 'pastor_001', userName: 'James', text: 'Let\'s fast and pray Wed-Fri', timestamp: hoursAgo(1) },
      { userId: 'member_008', userName: 'Sarah', text: 'Our group will intercede', timestamp: minutesAgo(58) },
      { userId: 'member_003', userName: 'Mark', text: 'Praying for divine provision', timestamp: minutesAgo(45) }
    ]
  }
};

// SEED LIVE DATA TO FIREBASE
export const seedLiveData = async () => {
  try {
    console.log('🚀 Agregando datos VIVOS a Firebase & PostgreSQL...\n');

    // Helper to convert time from 12-hour (e.g. "09:00 AM") to 24-hour HH:MM
    const convertTimeToHHMM = (t) => {
      if (!t) return '00:00';
      const cleanTime = t.trim().toUpperCase();
      if (cleanTime.includes('AM') || cleanTime.includes('PM')) {
        const [timePart, modifier] = cleanTime.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (hours === '12') {
          hours = '00';
        }
        if (modifier === 'PM') {
          hours = String(parseInt(hours, 10) + 12);
        }
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
      }
      return t;
    };

    // Church Info
    const churchRef = ref(rtdb, 'churchInfo');
    await set(churchRef, LIVE_CHURCH_INFO);
    console.log('✅ Información de iglesia (EN VIVO)');

    // PostgreSQL Members (Users)
    for (const member of LIVE_MEMBERS) {
      await upsertUserProfile({
        uid: member.uid,
        email: member.email,
        first: member.first,
        last: member.last,
        court: member.campus || 'Main Campus',
        dept: member.dept || 'General',
        position: member.position || 'Member',
        bio: member.bio || '',
        profilePhoto: member.profilePhoto || '',
        joined: member.joined,
        lastActive: member.lastActive,
        status: member.status,
        recentActivity: member.recentActivity || '',
        interests: member.interests || []
      });
    }
    console.log(`✅ ${LIVE_MEMBERS.length} miembros activos inyectados en PostgreSQL`);

    // PostgreSQL Announcements
    for (const post of LIVE_FEED_POSTS) {
      await createAnnouncement({
        content: post.content,
        scope: post.scope,
        category: post.category,
        imageUrl: post.image || '',
        authorUid: post.authorId
      });
    }
    console.log(`✅ ${LIVE_FEED_POSTS.length} posts recientes inyectados en PostgreSQL`);

    // PostgreSQL Events
    for (const event of LIVE_CHURCH_EVENTS) {
      await createEvent({
        title: event.title,
        date: event.date,
        time: convertTimeToHHMM(event.time),
        endTime: convertTimeToHHMM(event.endTime || '23:59'),
        location: event.location,
        description: event.description,
        type: event.type,
        capacity: event.capacity || 100,
        createdByUid: event.createdBy || 'pastor_001'
      });
    }
    console.log(`✅ ${LIVE_CHURCH_EVENTS.length} eventos inyectados en PostgreSQL`);

    // PostgreSQL Baptism Events
    for (const baptism of LIVE_BAPTISM_EVENTS) {
      await createBaptism({
        title: baptism.title,
        date: baptism.date,
        time: convertTimeToHHMM(baptism.time),
        location: baptism.location,
        description: baptism.description,
        capacity: baptism.capacity || 100,
        createdByUid: baptism.createdBy || 'pastor_001'
      });
    }
    console.log(`✅ ${LIVE_BAPTISM_EVENTS.length} eventos de bautismo inyectados en PostgreSQL`);

    // Chat Messages
    for (const [chatId, chatData] of Object.entries(LIVE_CHAT_MESSAGES)) {
      const chatRef = ref(rtdb, `chats/${chatId}`);
      await set(chatRef, {
        type: 'direct',
        participants: chatData.participants,
        participantNames: chatData.participantNames,
        createdAt: hoursAgo(24)
      });

      for (const msg of chatData.messages) {
        const msgRef = ref(rtdb, `chats/${chatId}/messages/${msg.userId}_${Date.now()}`);
        await set(msgRef, msg);
      }
    }
    console.log(`✅ ${Object.keys(LIVE_CHAT_MESSAGES).length} conversaciones directas (EN VIVO)`);

    // Group Chats
    for (const [groupId, groupData] of Object.entries(LIVE_GROUP_CHATS)) {
      const groupRef = ref(rtdb, `groups/${groupId}`);
      await set(groupRef, {
        type: 'group',
        name: groupData.name,
        creatorId: groupData.creatorId,
        members: groupData.members,
        memberNames: groupData.memberNames,
        isPublic: groupData.isPublic,
        createdAt: groupData.createdAt
      });

      for (const msg of groupData.messages) {
        const msgRef = ref(rtdb, `groups/${groupId}/messages/${msg.userId}_${Date.now()}`);
        await set(msgRef, msg);
      }
    }
    console.log(`✅ ${Object.keys(LIVE_GROUP_CHATS).length} grupos activos (EN VIVO)`);

    console.log('\n' + '═'.repeat(50));
    console.log('🎉 ¡DATOS VIVOS AGREGADOS EXITOSAMENTE!');
    console.log('═'.repeat(50));
    console.log('\n📊 Estado de la Iglesia EN VIVO:');
    console.log(`   🟢 ${LIVE_MEMBERS.filter(m => m.status === 'online').length} miembros en línea AHORA`);
    console.log(`   📅 ${LIVE_CHURCH_EVENTS.filter(e => e.date === todayStr).length} eventos HOY`);
    console.log(`   💬 ${Object.keys(LIVE_CHAT_MESSAGES).length} conversaciones activas`);
    console.log(`   👥 ${Object.keys(LIVE_GROUP_CHATS).length} grupos de iglesia`);
    console.log(`   📰 ${LIVE_FEED_POSTS.length} posts de noticias recientes`);
    console.log(`   🕊️ ${LIVE_BAPTISM_EVENTS.length} eventos de bautismo programados\n`);

    return true;
  } catch (error) {
    console.error('❌ Error al agregar datos vivos:', error);
    throw error;
  }
};
