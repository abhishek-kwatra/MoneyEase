import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRComponent = () => {
    const [image, setImage] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleOCR = () => {
        if (image) {
            setLoading(true);
            Tesseract.recognize(image, "eng", { logger: (info) => console.log(info) })
                .then(({ data: { text } }) => {
                    const amountMatch = text.match(/\b\d+(\.\d{2})?\b/);
                    setAmount(amountMatch ? amountMatch[0] : "No amount detected");
                })
                .catch((err) => console.error("OCR error:", err))
                .finally(() => setLoading(false));
        }
    };

    return (
        <div>
            <h1>Upload Bill for OCR</h1>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <button onClick={handleOCR} disabled={!image || loading}>
                {loading ? "Processing..." : "Detect Amount"}
            </button>
            {amount && <p>Detected Amount: {amount}</p>}
        </div>
    );
};

export default OCRComponent;
