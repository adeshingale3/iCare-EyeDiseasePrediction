const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/eyecare', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Patient Schema
const patientSchema = new mongoose.Schema({
    name: String,
    age: Number,
    bloodGroup: String,
    gender: String,
    pastOperations: String,
    symptoms: String,
    imagePath: String,
    prediction: String,
    createdAt: { type: Date, default: Date.now }
});

const Patient = mongoose.model('Patient', patientSchema);

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// API Routes
app.post('/api/patients', upload.single('image'), async (req, res) => {
    try {
        const { name, age, bloodGroup, gender, pastOperations, symptoms, prediction } = req.body;
        
        const patient = new Patient({
            name,
            age,
            bloodGroup,
            gender,
            pastOperations,
            symptoms,
            imagePath: req.file ? req.file.path : null,
            prediction
        });

        await patient.save();
        res.status(201).json({ message: 'Patient data saved successfully', patient });
    } catch (error) {
        console.error('Error saving patient data:', error);
        res.status(500).json({ error: 'Failed to save patient data' });
    }
});

app.get('/api/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 