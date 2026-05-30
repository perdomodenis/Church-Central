import { db, storage } from './firebase';
import { ref, set, get, push, query, orderByChild, onValue, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadBaptismPost = async (userId, userName, message, file) => {
  let photoUrl = null;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;
    const photoRef = storageRef(storage, `baptism-posts/${userId}/${fileName}`);
    await uploadBytes(photoRef, file);
    photoUrl = await getDownloadURL(photoRef);
  }

  const postRef = push(ref(db, 'baptism-posts'));
  await set(postRef, {
    userId,
    userName,
    message,
    photoUrl,
    timestamp: new Date().toISOString(),
    likes: 0
  });

  return postRef.key;
};

export const getBaptismPosts = async () => {
  try {
    const snapshot = await get(ref(db, 'baptism-posts'));
    const posts = [];
    snapshot.forEach((child) => {
      posts.push({
        id: child.key,
        ...child.val()
      });
    });
    return posts.reverse();
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

export const listenToBaptismPosts = (callback) => {
  const query_ref = query(ref(db, 'baptism-posts'), orderByChild('timestamp'));
  return onValue(query_ref, (snapshot) => {
    const posts = [];
    snapshot.forEach((child) => {
      posts.push({
        id: child.key,
        ...child.val()
      });
    });
    callback(posts.reverse());
  });
};

export const deleteBaptismPost = async (postId) => {
  await remove(ref(db, `baptism-posts/${postId}`));
};

export const likeBaptismPost = async (postId, currentLikes) => {
  await set(ref(db, `baptism-posts/${postId}/likes`), currentLikes + 1);
};
