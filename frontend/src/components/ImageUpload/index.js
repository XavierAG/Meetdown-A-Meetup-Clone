import React, { useState } from "react";
import s3 from "../../utils/awsConfig";

function ImageUpload({ setUrl }) {
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
    const uploadParams = {
      Bucket: process.env.REACT_APP_AWS_S3_BUCKET,
      Key: file.name,
      Body: file,
      ACL: "public-read",
    };

    try {
      const response = await s3.upload(uploadParams).promise();
      console.log("File uploaded:", response.Location);
      setUrl(response.Location);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h2>Upload an Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
    </div>
  );
}

export default ImageUpload;
