import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET
} from '../config/cloudinary';

export const uploadImage = async (image) => {
  const formData = new FormData();

  formData.append('file', image);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error('Greška prilikom upload-a slike');
  }

  const data = await response.json();

  return data.secure_url;
};