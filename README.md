# CavityCatcher

**Dental X-ray Viewer and Diagnostic Report Generator
using FastAPI, React, Roboflow, and LLMs (Gemini)**

---

## Features

- Upload dental X-ray images in DICOM format
- Conversion to JPEG for preview
- AI-powered anomaly detection (Roboflow)
- Visual annotation of detected regions
- LLM-generated clinical diagnostic reports (Gemini)
- Modern React frontend and FastAPI backend

---

## Project Structure

```
CavityCatcher/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   └── package.json
└── README.md
```

---

## Quickstart

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/CavityCatcher.git
cd CavityCatcher
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # On Windows
# source venv/bin/activate    # On Linux/Mac
pip install -r requirements.txt
# Edit your .env file with API keys
uvicorn app.main:app --reload
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

---

## Links

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend:** [http://localhost:8000](http://localhost:8000)

---

## Environment Variables

### Backend (`backend/.env`)

```env
ROBOFLOW_API_KEY=your_roboflow_api_key
ROBOFLOW_WORKSPACE=your_workspace
ROBOFLOW_PROJECT=your_project
ROBOFLOW_VERSION=your_version
GOOGLE_API_KEY=your_gemini_api_key
```


---

## How It Works

1. **Upload X-ray:** User uploads a DICOM image.
2. **Conversion:** Backend converts DICOM to JPEG.
3. **Preview:** JPEG is shown in the frontend.
4. **Detection:** On "Analyze", JPEG is sent to Roboflow for anomaly detection.
5. **Annotation:** Detected regions are drawn with bounding boxes and labels.
6. **LLM Report:** Annotations are sent to Gemini, which generates a clinical report.
7. **Results:** Annotated image and report are displayed to the user.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** FastAPI
- **AI/ML:** Roboflow, Google Gemini

---

## Contact

For questions or support, open an issue or contact
📧 [kartikeyasm16@gmail.com](mailto:kartikeyasm16@gmail.com)