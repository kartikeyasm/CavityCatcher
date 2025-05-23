import React, { useRef, useState } from "react";

export default function App() {
  const [image, setImage] = useState(null);
  const [report, setReport] = useState("");
  const fileInput = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handlePredict = () => {
    setReport(
      "Detected: Cavity on upper left molar. Advice: Schedule a restoration appointment."
    );
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
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                cursor-pointer
                border border-gray-300 rounded-lg
                bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500 self-start">
              Supported formats: .dcm, .rvg
            </p>

            {/* Rest of your existing image preview and predict button */}
            {image ? (
              <img
                src={image}
                alt="X-ray Preview"
                className="w-full max-w-md h-auto border rounded mb-4 mt-4"
              />
            ) : (
              <div className="w-full max-w-md h-64 flex items-center justify-center border-2 border-dashed rounded text-gray-400 mb-4 mt-4">
                No image uploaded
              </div>
            )}
            <button
              onClick={handlePredict}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Analyze X-ray
            </button>
          </div>
        </div>
        
        {/* Right Panel (unchanged) */}
        <div className="w-1/3 p-8 flex flex-col">
          <h2 className="text-xl font-bold mb-4">Diagnostic Report</h2>
          <div className="flex-1 bg-gray-50 p-4 rounded shadow-inner">
            {report ? (
              <p className="text-gray-800">{report}</p>
            ) : (
              <p className="text-gray-400">Report will appear here after prediction.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
