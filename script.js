const form = document.getElementById("predict-form");
const resultDiv = document.getElementById("result");
const downloadBtn = document.getElementById("downloadReport");

let formDataStore;
let predictionDataStore;

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    formDataStore = formData;

    const ngrokURL = "https://8dcd-34-125-1-44.ngrok-free.app";

    try {
        const response = await fetch(`${ngrokURL}/predict`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Prediction failed");

        const data = await response.json();
        predictionDataStore = data;

        resultDiv.innerHTML = `
            <h3>Prediction Results</h3>
            <p><strong>Patient Name:</strong> ${formData.get('name')}</p>
            <p><strong>Predicted Disease:</strong> ${data.prediction}</p>
            <p><strong>Symptoms:</strong> ${data.symptoms}</p>
        `;

        downloadBtn.style.display = "block";
    } catch (error) {
        console.error("Prediction error:", error);
        resultDiv.innerHTML = "<p class='error'>An error occurred. Please try again.</p>";
        downloadBtn.style.display = "none";
    }
});

downloadBtn.addEventListener("click", async () => {
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
                                text: "Vision Care Hospital",
                                bold: true,
                                size: 28,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "123 Medical Center Drive, City, State - 12345",
                                size: 24,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: "Phone: (123) 456-7890 | Email: info@visioncare.com",
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
                    new Paragraph({ text: "" }),
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
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "Dr. John Smith",
                                bold: true,
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "Consultant Ophthalmologist",
                                size: 22,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: "Vision Care Hospital",
                                size: 22,
                            }),
                        ],
                    }),
                ],
            }],
        });

        // Generate and download the document
        const blob = await Packer.toBlob(doc);
        saveAs(blob, "eye_disease_report.docx");
    } catch (error) {
        console.error("Error generating Word document:", error);
        alert("Error generating report. Please try again.");
    }
});
