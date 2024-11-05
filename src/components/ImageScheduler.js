import React, { useState } from "react";
import axios from "axios";

const ImageScheduler = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [theme, setTheme] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/generate-image`, { prompt });
      setGeneratedImage(response.data.imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveImage = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_URL}/api/save-image`, {
        imageUrl: generatedImage,
        answer,
        themeName: theme,
        date: selectedDate,
      });
      alert("Image saved and scheduled successfully!");
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <div className="image-scheduler">
      <h2>Generate and Schedule Image</h2>
      <input
        type="text"
        placeholder="Enter image prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleGenerateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {generatedImage && (
        <div>
          <h3>Preview</h3>
          <img src={generatedImage} alt="Generated Preview" style={{ maxWidth: "100%" }} />
          <input
            type="text"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={handleSaveImage}>Save Image</button>
        </div>
      )}
    </div>
  );
};

export default ImageScheduler;
