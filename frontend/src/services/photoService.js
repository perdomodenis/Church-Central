import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';

export const uploadPhoto = async (userId, file) => {
  const fileName = `${Date.now()}-${file.name}`;
  const photoRef = ref(storage, `users/${userId}/photos/${fileName}`);

  await uploadBytes(photoRef, file);
  const url = await getDownloadURL(photoRef);

  return { url, fileName };
};

export const getUserPhotos = async (userId) => {
  try {
    const photosRef = ref(storage, `users/${userId}/photos`);
    const result = await listAll(photosRef);

    const photoUrls = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        url: await getDownloadURL(item)
      }))
    );

    return photoUrls;
  } catch (error) {
    return [];
  }
};

export const deletePhoto = async (userId, fileName) => {
  const photoRef = ref(storage, `users/${userId}/photos/${fileName}`);
  await deleteObject(photoRef);
};
