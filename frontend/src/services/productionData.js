import { rtdb } from './firebase';
import { ref, set } from 'firebase/database';

// Real Church Information
export const CHURCH_INFO = {
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
    { name: 'Glory Court', address: '1847 Oak Ridge Drive, Denver, CO 80206', phone: '+1 (555) 123-4567' },
    { name: 'Hope Court', address: '450 Market Street, Denver, CO 80202', phone: '+1 (555) 123-4568' }
  ]
};

// Real Church Members with varied roles and departments
export const REAL_MEMBERS = [
  {
    uid: 'pastor_001',
    email: 'pastor.james@gracecommunity.church',
    first: 'James',
    last: 'Peterson',
    dept: 'General',
    position: 'Senior Pastor',
    campus: 'Glory Court',
    bio: 'Passionate about discipleship and reaching the community. 20+ years of ministry experience.',
    interests: ['Preaching', 'Leadership', 'Outreach', 'Disciples Training Ministry (DTM)'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    joined: '2008-01-15'
  },
  {
    uid: 'pastor_002',
    email: 'pastor.rachel@gracecommunity.church',
    first: 'Rachel',
    last: 'Thompson',
    dept: 'Anointed Psalmists',
    position: 'Worship Pastor',
    campus: 'Glory Court',
    bio: 'Director of worship with a heart for authentic encounters with God. Musician and singer.',
    interests: ['Music', 'Worship', 'Teaching', 'Prayer'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    joined: '2012-03-22'
  },
  {
    uid: 'member_001',
    email: 'juan.rivera@email.com',
    first: 'Juan',
    last: 'Rivera',
    dept: 'Disciples Training Ministry (DTM)',
    position: 'Youth Director',
    campus: 'Glory Court',
    bio: 'Dedicated youth minister working with ages 13-18. Building faith foundations in the next generation.',
    interests: ['Youth', 'Sports', 'Leadership', 'Mentoring'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    joined: '2015-08-10'
  },
  {
    uid: 'member_002',
    email: 'sofia.garcia@email.com',
    first: 'Sofia',
    last: 'Garcia',
    dept: 'Outreach',
    position: 'Outreach Coordinator',
    campus: 'Hope Court',
    bio: 'Passionate about serving the homeless and underserved communities. Faith in action.',
    interests: ['Community Service', 'Volunteering', 'Social Justice', 'Compassion'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    joined: '2016-05-20'
  },
  {
    uid: 'member_003',
    email: 'mark.anderson@email.com',
    first: 'Mark',
    last: 'Anderson',
    dept: 'Disciples Training Ministry (DTM)',
    position: 'Disciples Training Ministry (DTM) Leader',
    campus: 'Glory Court',
    bio: 'Seminary graduate passionate about deep biblical study and theological discussions.',
    interests: ['Disciples Training Ministry (DTM)', 'Theology', 'Teaching', 'Mentoring'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    joined: '2014-02-14'
  },
  {
    uid: 'member_004',
    email: 'maria.santos@email.com',
    first: 'Maria',
    last: 'Santos',
    dept: 'Children\'s Ministry',
    position: 'Children\'s Director',
    campus: 'Glory Court',
    bio: 'Nursery & elementary teacher with a passion for children\'s spiritual development.',
    interests: ['Children', 'Education', 'Games', 'Storytelling'],
    profilePhoto: 'https://images.unsplash.com/photo-1507214159351-0e6658ffb367?auto=format&fit=crop&w=400&q=60',
    joined: '2017-09-05'
  },
  {
    uid: 'member_005',
    email: 'david.lee@email.com',
    first: 'David',
    last: 'Lee',
    dept: 'Finance and administration',
    position: 'Church Administrator',
    campus: 'Glory Court',
    bio: 'Manages day-to-day operations and facilities. Dedicated servant leader.',
    interests: ['Organization', 'Facilities', 'Media Ministry', 'Administration'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    joined: '2013-06-01'
  },
  {
    uid: 'member_006',
    email: 'patricia.white@email.com',
    first: 'Patricia',
    last: 'White',
    dept: 'Prayer ministry',
    position: 'Prayer Coordinator',
    campus: 'Hope Court',
    bio: 'Leads intercessory prayer meetings and pastoral prayer team. Retired missionary.',
    interests: ['Prayer', 'Intercession', 'Missions', 'Mentoring'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    joined: '2010-11-18'
  },
  {
    uid: 'member_007',
    email: 'thomas.brown@email.com',
    first: 'Thomas',
    last: 'Brown',
    dept: 'Zamar',
    position: 'Worship Band Member',
    campus: 'Glory Court',
    bio: 'Professional musician - drums & percussion. Loves bringing energy to worship.',
    interests: ['Music', 'Drums', 'Worship', 'Community'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=60',
    joined: '2018-01-10'
  },
  {
    uid: 'member_008',
    email: 'sarah.johnson@email.com',
    first: 'Sarah',
    last: 'Johnson',
    dept: 'Disciples Training Ministry (DTM)',
    position: 'Small Groups Leader',
    campus: 'Glory Court',
    bio: 'Leads a weekly small group for young adults. Passionate about Biblical discipleship.',
    interests: ['Disciples Training Ministry (DTM)', 'Bible', 'Community', 'Growth'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=60',
    joined: '2019-03-17'
  },
  {
    uid: 'member_009',
    email: 'michael.chen@email.com',
    first: 'Michael',
    last: 'Chen',
    dept: 'Media Ministry',
    position: 'IT Support',
    campus: 'Glory Court',
    bio: 'Manages church technology and streaming. Volunteer IT specialist.',
    interests: ['Media Ministry', 'Streaming', 'Problem Solving', 'Innovation'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=60',
    joined: '2020-02-09'
  },
  {
    uid: 'member_010',
    email: 'elena.rodriguez@email.com',
    first: 'Elena',
    last: 'Rodriguez',
    dept: 'Media Ministry',
    position: 'Social Media Coordinator',
    campus: 'Hope Court',
    bio: 'Manages church communications and social media. Passionate about storytelling.',
    interests: ['Media Ministry', 'Social Media', 'Design', 'Storytelling'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=60',
    joined: '2021-05-12'
  }
];

// Real Church News/Feed Posts
export const REAL_FEED_POSTS = [
  {
    id: 1,
    author: 'General',
    authorId: 'pastor_001',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    content: 'Join us this Sunday at 10 AM for our special worship series "Grace Unfolded". Pastor James will be speaking on God\'s relentless grace in our lives. Both campuses available - in-person and online.',
    scope: 'Public',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=800&q=80',
    likes: 47,
    comments: [
      { author: 'Maria Santos', text: 'Can\'t wait! Looking forward to this message.' },
      { author: 'Juan Rivera', text: 'Will be bringing our youth group!' }
    ]
  },
  {
    id: 2,
    author: 'Disciples Training Ministry (DTM)',
    authorId: 'member_001',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    content: 'Youth Summer Camp registrations are NOW OPEN! June 21-25 at Rocky Mountain Camp. $299 early bird (until May 31). Contact Juan or visit our table after service for more info.',
    scope: 'Public',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    likes: 63,
    comments: [
      { author: 'David Lee', text: 'Great opportunity for our youth!' },
      { author: 'Sarah Johnson', text: 'I\'ll have my kids ready!' },
      { author: 'Thomas Brown', text: 'Is there scholarships available?' }
    ]
  },
  {
    id: 3,
    author: 'Outreach',
    authorId: 'member_004',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    content: 'Thank you ALL who participated in last week\'s Community Food Drive! We collected 847 lbs of food and supplies for the Denver Food Bank. Your generosity is changing lives!',
    scope: 'Public',
    category: 'Update',
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
    likes: 89,
    comments: [
      { author: 'Patricia White', text: 'Praise God for this amazing outreach!' },
      { author: 'Elena Rodriguez', text: 'This is what community looks like!' }
    ]
  },
  {
    id: 4,
    author: 'Anointed Psalmists',
    authorId: 'pastor_002',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    content: 'We are looking for musicians and singers for our expanded Worship Band! No experience necessary - just a willing heart. Join us for rehearsals on Fridays at 7 PM. Come see what God has in store!',
    scope: 'Public',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    likes: 34,
    comments: [
      { author: 'Thomas Brown', text: 'The worship team is amazing! Highly recommend!' }
    ]
  },
  {
    id: 5,
    author: 'Disciples Training Ministry (DTM)',
    authorId: 'member_003',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    content: 'Join us for "Psalms & Prayer" - an 8-week deep dive into the Psalms. Starting June 5, Wednesdays at 7 PM in the Fellowship Hall. Coffee & conversation from 6:45. All levels welcome!',
    scope: 'Public',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?auto=format&fit=crop&w=800&q=80',
    likes: 28,
    comments: [
      { author: 'Mark Anderson', text: 'This is going to be DEEP. Can\'t wait!' },
      { author: 'Sarah Johnson', text: 'Registering now!' }
    ]
  },
  {
    id: 6,
    author: 'Children\'s Ministry',
    authorId: 'member_004',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    content: 'Vacation Bible School is coming! June 15-19, 9 AM - 12 PM. Theme: "Adventure in Faith" for ages 3-12. Sign up by June 1st. $40/child, scholarships available. This year promises to be our BEST VBS yet!',
    scope: 'Public',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1503454537688-e0ce8a41f600?auto=format&fit=crop&w=800&q=80',
    likes: 76,
    comments: [
      { author: 'Maria Santos', text: 'Already signed up my 3 kids!' },
      { author: 'Patricia White', text: 'Volunteering as usual! This ministry is life-changing.' }
    ]
  },
  {
    id: 7,
    author: 'Prayer ministry',
    authorId: 'member_006',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    content: 'Prayer Request: Please lift up the Chen family as they welcome their newborn daughter, Grace, to the family. Also praying for healing for Brother Robert who is recovering from surgery. Join us in intercession!',
    scope: 'Public',
    category: 'Prayer Request',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
    likes: 52,
    comments: [
      { author: 'Elena Rodriguez', text: 'Praying for the entire family! Congratulations!' }
    ]
  },
  {
    id: 8,
    author: 'Church Leadership',
    authorId: 'pastor_001',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    content: 'Leadership nominations are open! If you sense God calling you to leadership at Grace Community, we want to hear from you. Applications due by May 31. Requirements: 1 year membership, strong faith, servant heart.',
    scope: 'Public',
    category: 'Announcement',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    likes: 31,
    comments: [
      { author: 'David Lee', text: 'Excited to see who God raises up for leadership!' },
      { author: 'Sarah Johnson', text: 'Submitting my application!' }
    ]
  }
];

// Real Baptism Events
export const REAL_BAPTISM_EVENTS = [
  {
    id: 'baptism_001',
    title: 'Water Baptism Service - June',
    date: '2025-06-22',
    time: '09:00 AM',
    location: 'Glory Court - Outdoor Baptismal Pool',
    description: 'Public declaration of faith in Jesus Christ through baptism. Open to all who have accepted Christ and desire to make their commitment public.',
    capacity: 30,
    registeredCount: 12,
    createdAt: new Date().toISOString(),
    createdBy: 'pastor_001'
  },
  {
    id: 'baptism_002',
    title: 'Water Baptism Service - July',
    date: '2025-07-20',
    time: '10:00 AM',
    location: 'Hope Court - Baptismal Pool',
    description: 'Share your faith journey! Join us as we celebrate those taking this important step in their spiritual life.',
    capacity: 25,
    registeredCount: 8,
    createdAt: new Date().toISOString(),
    createdBy: 'pastor_002'
  },
  {
    id: 'baptism_003',
    title: 'Youth Water Baptism Service - June',
    date: '2025-06-29',
    time: '02:00 PM',
    location: 'Glory Court - Youth Area',
    description: 'Special baptism service for our youth who are ready to make their commitment to Jesus.',
    capacity: 20,
    registeredCount: 5,
    createdAt: new Date().toISOString(),
    createdBy: 'member_001'
  }
];

// Real Church Events/Schedule
export const REAL_CHURCH_EVENTS = [
  {
    id: 'event_001',
    title: 'Sunday Worship Service - Glory Court',
    date: '2025-06-01',
    time: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Grace Community Church - Glory Court, 1847 Oak Ridge Drive',
    description: 'Join us for our weekly worship gathering with prayer, worship, and a message from God\'s word.',
    type: 'Worship',
    capacity: 450,
    registered: 342,
    recurring: 'weekly',
    nextOccurrence: '2025-06-08'
  },
  {
    id: 'event_002',
    title: 'Youth Group Meeting',
    date: '2025-06-03',
    time: '07:00 PM',
    endTime: '09:00 PM',
    location: 'Glory Court - Youth Room',
    description: 'Weekly gathering for ages 13-18. Games, discussion, growth, and community.',
    type: 'Disciples Training Ministry (DTM)',
    capacity: 80,
    registered: 54,
    recurring: 'weekly'
  },
  {
    id: 'event_003',
    title: 'Adult Disciples Training Ministry (DTM) - Psalms',
    date: '2025-06-04',
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Glory Court - Fellowship Hall',
    description: 'In-depth study of selected Psalms. Coffee available. Newcomers welcome!',
    type: 'Education',
    capacity: 75,
    registered: 42,
    recurring: 'weekly'
  },
  {
    id: 'event_004',
    title: 'Community Food Drive',
    date: '2025-06-07',
    time: '09:00 AM',
    endTime: '02:00 PM',
    location: 'Hope Court & Community Center',
    description: 'Help us serve the community! Collecting food and supplies for the Denver Food Bank.',
    type: 'Outreach',
    capacity: 200,
    registered: 87,
    recurring: 'monthly'
  },
  {
    id: 'event_005',
    title: 'Prayer Night',
    date: '2025-06-09',
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Glory Court - Prayer Room',
    description: 'Dedicated time of intercession and prayer for church, community, and world.',
    type: 'Prayer',
    capacity: 50,
    registered: 23,
    recurring: 'weekly'
  },
  {
    id: 'event_006',
    title: 'Vacation Bible School',
    date: '2025-06-15',
    time: '09:00 AM',
    endTime: '12:00 PM',
    location: 'Glory Court - Children\'s Wing',
    description: 'VBS 2025: "Adventure in Faith" - For children ages 3-12. Games, crafts, stories, worship!',
    type: 'Children',
    capacity: 150,
    registered: 98,
    recurring: null
  },
  {
    id: 'event_007',
    title: 'Leadership Meeting',
    date: '2025-06-10',
    time: '07:00 PM',
    endTime: '08:30 PM',
    location: 'Glory Court - Boardroom',
    description: 'Monthly leadership team meeting. Prayer, planning, and pastoral updates.',
    type: 'Leadership',
    capacity: 25,
    registered: 19,
    recurring: 'monthly'
  },
  {
    id: 'event_008',
    title: 'Youth Summer Camp',
    date: '2025-06-21',
    time: '08:00 AM',
    endTime: '2025-06-25 05:00 PM',
    location: 'Rocky Mountain Camp, Colorado',
    description: 'Summer camp for youth ages 13-18. Games, worship, teaching, friendship, and fun!',
    type: 'Disciples Training Ministry (DTM)',
    capacity: 100,
    registered: 34,
    recurring: null
  },
  {
    id: 'event_009',
    title: 'Water Baptism Service',
    date: '2025-06-22',
    time: '09:00 AM',
    endTime: '11:00 AM',
    location: 'Glory Court - Outdoor Baptismal Pool',
    description: 'Public declaration of faith in Jesus Christ through water baptism.',
    type: 'Baptism',
    capacity: 30,
    registered: 12,
    recurring: null
  }
];

// Seed production data to Firebase
export const seedProductionData = async () => {
  try {
    console.log('🌱 Agregando datos de producción a Firebase...');

    // Add church info
    const churchRef = ref(rtdb, 'churchInfo');
    await set(churchRef, CHURCH_INFO);
    console.log('✅ Información de la iglesia agregada');

    // Add members
    for (const member of REAL_MEMBERS) {
      const memberRef = ref(rtdb, `users/${member.uid}`);
      await set(memberRef, {
        ...member,
        createdAt: member.joined
      });
      console.log(`✅ Miembro agregado: ${member.first} ${member.last}`);
    }

    // Add feed posts
    for (const post of REAL_FEED_POSTS) {
      const postRef = ref(rtdb, `feed/${post.id}`);
      await set(postRef, post);
    }
    console.log(`✅ ${REAL_FEED_POSTS.length} posts de noticias agregados`);

    // Add baptism events
    for (const baptism of REAL_BAPTISM_EVENTS) {
      const baptismRef = ref(rtdb, `baptisms/events/${baptism.id}`);
      await set(baptismRef, baptism);
    }
    console.log(`✅ ${REAL_BAPTISM_EVENTS.length} eventos de bautismo agregados`);

    // Add church events
    for (const event of REAL_CHURCH_EVENTS) {
      const eventRef = ref(rtdb, `events/${event.id}`);
      await set(eventRef, event);
    }
    console.log(`✅ ${REAL_CHURCH_EVENTS.length} eventos de la iglesia agregados`);

    console.log('✅ ¡Datos de producción agregados exitosamente!');
    return true;
  } catch (error) {
    console.error('❌ Error al agregar datos de producción:', error);
    throw error;
  }
};
