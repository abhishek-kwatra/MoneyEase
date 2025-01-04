import React, { useState } from "react";
import axios from "axios";

const OCRComponent = () => {
  const [image, setImage] = useState(null);
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  // Handle OCR button click
  const handleOCR = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:4000/api/ocr", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTotal(response.data.total);
    } catch (error) {
      console.error("Error in OCR:", error);
      setTotal("Failed to detect total");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Splitwise Bill OCR</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <button onClick={handleOCR} disabled={!image || loading}>
        {loading ? "Processing..." : "Detect Total"}
      </button>
      {total && <h2>Detected Total: {total}</h2>}
    </div>
  );
};

export default OCRComponent;
