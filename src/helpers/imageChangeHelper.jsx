export const handleImageChange = (index, event, currentImages, setImages) => {
  const file = event.target.files[0];
  if (!file) return;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImages = [...currentImages];
      newImages[index] = e.target.result;
      console.log(currentImages);

      setImages(newImages);
      resolve(newImages);
    };
    reader.readAsDataURL(file);
  });
};

export const getMediaType = (file) => {
  return file.type.includes("gif") ? "gif" : "image";
};
