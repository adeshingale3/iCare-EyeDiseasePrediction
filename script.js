const form = document.getElementById("predict-form");
const resultDiv = document.getElementById("result");
const downloadBtn = document.getElementById("downloadReport");

let formDataStore;
let predictionDataStore;

// Add this function to save patient data to MongoDB
async function savePatientData(formData, prediction) {
    try {
        const response = await fetch('http://localhost:3000/api/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.get('name'),
                age: formData.get('age'),
                bloodGroup: formData.get('bloodGroup'),
                gender: formData.get('gender'),
                pastOperations: formData.get('pastOperations'),
                symptoms: formData.get('symptoms'),
                prediction: prediction
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save patient data');
        }

        const data = await response.json();
        console.log('Patient data saved successfully:', data);
    } catch (error) {
        console.error('Error saving patient data:', error);
    }
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formDataStore = formData;

    const ngrokURL = "https://7546-35-237-179-239.ngrok-free.app";  // Replace with your actual ngrok URL

    const predictButton = form.querySelector('.predict-btn');
    setLoading(predictButton, true);

    try {
        const response = await fetch(`${ngrokURL}/predict`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Prediction failed");

        const data = await response.json();
        predictionDataStore = data;

        // Save patient data to MongoDB with the prediction
        await savePatientData(formData, data.prediction);

        resultDiv.innerHTML = `
            <h3>Prediction Results</h3>
            <p><strong>Patient Name:</strong> ${formData.get('name')}</p>
            <p><strong>Predicted Disease:</strong> ${data.prediction}</p>
            <p><strong>Symptoms:</strong> ${data.symptoms}</p>
        `;

        addResultAnimation();
        downloadBtn.style.display = "block";

        setLoading(predictButton, false);
    } catch (error) {
        console.error("Prediction error:", error);
        resultDiv.innerHTML = "<p class='error'>An error occurred. Please try again.</p>";
        downloadBtn.style.display = "none";
        setLoading(predictButton, false);
    }
});

downloadBtn.addEventListener("click", async function() {
    const downloadButton = this;
    setLoading(downloadButton, true);
    addDownloadAnimation();
    try {
        const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun, AlignmentType } = docx;

        // Convert image to base64
        const imageInput = document.getElementById("image");
        let imageBase64 = null;
        
        if (imageInput.files && imageInput.files[0]) {
            imageBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(imageInput.files[0]);
            });
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "iCare By KIT's Hospitality",
                                bold: true,
                                size: 28,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "KIT's Hospitality, Gokul Shirgaon, Kolhapur, Maharashtra 416234",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Phone: +91 8948675953 | Email: info@kitcoek.com",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Medical Report",
                                bold: true,
                                size: 26,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Patient Information",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Name: ${formDataStore.get('name')}`,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Age: ${formDataStore.get('age')}`,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Gender: ${formDataStore.get('gender')}`,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Blood Group: ${formDataStore.get('bloodGroup')}`,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Past Eye Operations: ${formDataStore.get('pastOperations')}`,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Reported Symptoms",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: formDataStore.get('symptoms'),
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Retinal Image",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    // Add the image if available
                    ...(imageBase64 ? [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                                new ImageRun({
                                    data: imageBase64.split(',')[1], // Remove the data URL prefix
                                    transformation: {
                                        width: 400,
                                        height: 300,
                                    },
                                }),
                            ],
                        }),
                    ] : []),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Diagnosis",
                                bold: true,
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Predicted Disease: ${predictionDataStore.prediction || 'Not Available'}`,
                                size: 22,
                            }),
                        ],
                    }),
                    
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Time of Checkup: ${new Date().toLocaleString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}`,
                                size: 22,
                            }),
                        ],
                    }),
                   
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "Dr. Priya Sharma",
                                bold: true,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "Eye Specialist",
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "KIT's Hospitality",
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({text : ""}),
                    
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "Saftey Guidelines",
                                bold: true,
                                size: 24,
                                
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "1. Individuals working in environments with dust, chemicals, or sharp objects should wear appropriate safety glasses or goggles to prevent eye injuries.",
                                size: 21,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "2. Minimize direct contact with eyes, especially with unwashed hands, to reduce the risk of infections and irritation.",
                                size: 21,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "3. To prevent digital eye strain, every 20 minutes, look at an object 20 feet away for at least 20 seconds when using digital devices.",
                                size: 21,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "4. TMaintain proper lighting while reading or working to avoid unnecessary eye strain and fatigue.",
                                size: 21,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "5. Routine eye check-ups are essential to detect vision problems early and ensure long-term eye health.",
                                size: 21,
                            }),
                        ],
                    }),
                    new Paragraph({text: ""}),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: "Disclaimer: This report is generated by an AI system. Please consult our doctors for a detailed analysis and treatment plan.",
                                bold: true,
                                size: 16,
                            }),
                        ],
                    }),

                ],
            }],
        });

        // Generate and download the document
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "eye_disease_report.docx");

        setLoading(downloadButton, false);
    } catch (error) {
        console.error("Error generating Word document:", error);
        alert("Error generating report. Please try again.");
        setLoading(downloadButton, false);
    }
});

// Add these functions after your existing code

function addResultAnimation() {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('animate-slide');
    void resultDiv.offsetWidth; // Trigger reflow
    resultDiv.classList.add('animate-slide');
}

function addDownloadAnimation() {
    const downloadBtn = document.getElementById('downloadReport');
    downloadBtn.classList.add('animate-pulse');
    downloadBtn.addEventListener('animationend', () => {
        downloadBtn.classList.remove('animate-pulse');
    });
}

// Add loading state to buttons
function setLoading(button, isLoading) {
    if (isLoading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}
