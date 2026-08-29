export const uploadToCloudinary = async (file) => {
  const CLOUD_NAME = "dqiivlmgs";
  const UPLOAD_PRESET = "hirevia";

  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  let resourceType = "image";

  if (file.type === "application/pdf") {
    resourceType = "raw";
  } else if (file.type.startsWith("video/")) {
    resourceType = "video";
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error(result);
      return null;
    }

    return result.secure_url;
  } catch (err) {
    console.error(err);
    return null;
  }
};
