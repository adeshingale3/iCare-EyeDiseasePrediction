# iCare - Eye Disease Prediction System

## Overview
iCare is an AI-powered eye disease detection platform that helps predict various eye conditions through retinal image analysis and symptom-based diagnosis. The system utilizes advanced machine learning models to detect diseases like Cataract, Glaucoma, and Diabetic Retinopathy.

## Features
- **AI-Based Disease Detection**: Analyzes retinal images using deep learning models
- **Symptom-Based Analysis**: Predicts potential eye conditions based on reported symptoms
- **Patient History Dashboard**: Tracks and visualizes patient data and disease statistics
- **Automated Report Generation**: Creates detailed medical reports in DOCX format
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Technologies Used
- **Frontend**:
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap 5
  - Chart.js
  - DocxJS

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB

- **AI/ML**:
  - Python
  - TensorFlow/PyTorch
  - Flask

## Installation & Setup

1. Clone the repository:
```bash
git clone https://https://github.com/adeshingale3/iCare-EyeDiseasePrediction
cd iCare-EyeDiseasePrediction
```

2. Install dependencies:
```bash
npm install
```

3. Clone this Google Colab Notebook:
```bash
"https://colab.research.google.com/drive/1XQv5xX_oZVci8W11xNpnyS8kh6dPOpWe#scrollTo=x4o5wDMGa99Q"
```

4. Copy this h5 model in you Google Drive:
```bash
"https://drive.google.com/file/d/13M-GEOaLdpKRjqpKGJ-Xr55cDiwAZqj7/view?usp=drive_link"
```

7. After running the 7th cell in Colab Notebook paste ngrok url in script.js:
```bash
"Link will Look like this : https://7546-35-237-179-239.ngrok-free.app"
```

## Project Structure
```
iCare/
├── Home/              # Home page assets and components
├── assets/           
│   ├── css/          # Stylesheets
│   ├── js/           # JavaScript files
│   ├── img/          # Images and icons
│   └── vendor/       # Third-party libraries
├── index.html        # Main application entry
├── patient-history.html  # Patient history dashboard
├── script.js         # Core application logic
├── styles.css        # Custom styles
└── README.md
```

## Key Features Explained

### 1. Disease Detection
- Upload retinal images for AI analysis
- Get instant predictions with confidence scores
- View affected areas through heatmap visualization

### 2. Download Detailed Report
- After predicting disease, you can download medical report.

### 3. Patient History
- Track patient records and medical history
- Visualize gender distribution and disease frequency
- Generate comprehensive medical reports

### 4. User Interface
- Clean and intuitive design
- Responsive across all devices
- Real-time feedback and animations



