import { rtdb } from './firebase';
import { ref, set } from 'firebase/database';

const TEST_USERS = [
  {
    uid: 'bAWeg4zMQBcEGOu0KckbT3GO5Wm2',
    email: 'tumail+test1@gmail.com',
    first: 'Maria',
    last: 'Garcia',
    dept: 'Anointed Psalmists',
    position: 'Leader',
    court: 'Glory Court',
    bio: 'Passionate about worship and music. Love serving the community!',
    interests: ['Music', 'Worship', 'Community Service'],
    profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=60'
  },
  {
    uid: 'PKifoCF18gSmQrgBXTthOUHZ8Cf2',
    email: 'tumail+test2@gmail.com',
    first: 'Juan',
    last: 'Lopez',
    dept: 'Disciples Training Ministry (DTM)',
    position: 'Youth Pastor',
    court: 'Glory Court',
    bio: 'Dedicated to mentoring young people and building strong faith foundations.',
    interests: ['Youth', 'Sports', 'Leadership'],
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=60'
  },
  {
    uid: 'IU0pFVyTpmPTZIqGz5UQ6K7aH6s2',
    email: 'tumail+test3@gmail.com',
    first: 'Sofia',
    last: 'Martinez',
    dept: 'Outreach',
    position: 'Volunteer Coordinator',
    court: 'Hope Court',
    bio: 'Committed to helping those in need. Faith in action is my passion.',
    interests: ['Community', 'Volunteering', 'Helping Others'],
    profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=500&q=60'
  },
  {
    uid: 'GG2LoxKTZdRFVqFI8qBc6qULcXJ2',
    email: 'tumail+test4@gmail.com',
    first: 'Carlos',
    last: 'Rodriguez',
    dept: 'Disciples Training Ministry (DTM)',
    position: 'Study Leader',
    court: 'Glory Court',
    bio: 'Passionate about scripture and deep biblical discussions. Always learning!',
    interests: ['Bible Study', 'Theology', 'Teaching'],
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=60'
  },
  {
    uid: 'S3YYHaibN2Qb1CT3T5y9eTWJhkm1',
    email: 'tumail+test5@gmail.com',
    first: 'Laura',
    last: 'Sanchez',
    dept: 'General',
    position: 'Children\'s Director',
    court: 'Glory Court',
    bio: 'Nurturing the next generation of believers. Making faith fun and engaging!',
    interests: ['Children', 'Education', 'Fun Activities'],
    profilePhoto: 'https://images.unsplash.com/photo-1507214159351-0e6658ffb367?auto=format&fit=crop&w=500&q=60'
  }
];

export const seedTestData = async () => {
  try {
    console.log('Agregando datos de prueba...');

    for (const user of TEST_USERS) {
      const userRef = ref(rtdb, `users/${user.uid}`);
      await set(userRef, {
        uid: user.uid,
        email: user.email,
        first: user.first,
        last: user.last,
        dept: user.dept,
        position: user.position,
        court: user.court,
        bio: user.bio,
        interests: user.interests,
        profilePhoto: user.profilePhoto,
        createdAt: new Date().toISOString()
      });

      console.log(`✅ Agregado: ${user.first} ${user.last}`);
    }

    console.log('✅ Datos de prueba agregados exitosamente!');
    return true;
  } catch (error) {
    console.error('Error al agregar datos de prueba:', error);
    throw error;
  }
};
