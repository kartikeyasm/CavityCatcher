import React, { useRef, useState } from "react";
import AnnotatedImage from "./components/AnnotatedImage";

export default function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [report, setReport] = useState("");
  const [convertedImageBlob, setConvertedImageBlob] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loader, setLoader] = useState(false);
  const fileInput = useRef();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/convert-dicom-to-jpg/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setImageUrl(url);
      setConvertedImageBlob(blob);
      setPredictions([]); 
      setReport("");
    } catch (err) {
      setImageUrl(null);
      setConvertedImageBlob(null);
      setReport("Failed to convert image");
    }
  };

  const handlePredict = async () => {
    if (!convertedImageBlob) {
      setReport("Please convert an image first");
      return;
    }
    setLoader(true);
    try {
      const jpgFile = new File(
        [convertedImageBlob],
        "converted_image.jpg",
        { type: "image/jpeg" }
      );

      const formData = new FormData();
      formData.append("image", jpgFile);

      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPredictions(data.predictions || []);

      const reportContent = data.predictions?.map(p =>
        `${p.class} (${(p.confidence * 100).toFixed(1)}%)`
      ).join("\n") || "No anomalies detected";

      setReport(data.diagnostic_report || "No report generated");
    } catch (error) {
      setReport("Error analyzing image");
      setPredictions([]);
    } finally{
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg flex">

        {/* Left Panel */}
        <div className="w-2/3 p-8 flex flex-col items-center border-r">
          <h2 className="text-xl font-bold mb-4">Dental X-ray Viewer</h2>

          <div className="w-full flex flex-col items-center">
            <input
              type="file"
              accept=".dcm,.rvg"
              ref={fileInput}
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500 self-start">
              Supported formats: .dcm, .rvg
            </p>

            {/* Show plain image if no predictions, else show annotated image */}
            {imageUrl ? (
              predictions.length === 0 ? (
                <img
                  src={imageUrl}
                  alt="X-ray Preview"
                  className="w-full max-w-md h-auto border rounded mb-4 mt-4"
                />
              ) : (
                <AnnotatedImage
                  imageUrl={imageUrl}
                  predictions={predictions}
                />
              )
            ) : (
              <div className="w-full max-w-md h-64 flex items-center justify-center border-2 border-dashed rounded text-gray-400 mb-4 mt-4">
                No image uploaded
              </div>
            )}

            <button
              onClick={handlePredict}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              disabled={!convertedImageBlob}
            >
              Analyze X-ray
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/3 p-8 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Diagnostic Report</h2>
          <div className="flex-1 bg-gray-50 p-4 rounded shadow-inner">
            {loader ? (
              <div className="flex flex-col items-center justify-center h-full">
                
                <svg className="animate-spin h-8 w-8 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span className="text-blue-700 font-semibold">Generating Report...</span>
              </div>
            ) : report ? (
              <div className="text-gray-800 space-y-4">
                <h3 className="font-semibold text-lg">Clinical Findings</h3>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {report}
                </p>
              </div>
            ) : (
              <p className="text-gray-400">Report will appear here after prediction.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
