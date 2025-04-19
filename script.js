const form = document.getElementById("predict-form");
const resultDiv = document.getElementById("result");
const downloadBtn = document.getElementById("downloadReport");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const ngrokURL = "https://17d1-34-139-245-220.ngrok-free.app"; // Replace with your actual ngrok URL

  try {
    const response = await fetch(`${ngrokURL}/predict`, {
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Prediction failed");

    const data = await response.json();
    resultDiv.innerHTML = `
      <h3>Prediction Results</h3>
      <p><strong>Patient Name:</strong> ${formData.get('name')}</p>
      <p><strong>Predicted Disease:</strong> ${data.prediction}</p>
      <p><strong>Symptoms:</strong> ${data.symptoms}</p>
    `;
    
    // Show download button
    downloadBtn.style.display = "block";
    
    // Update report template with current data
    await updateReportTemplate(formData, data);
  } catch (error) {
    console.error("Prediction error:", error);
    resultDiv.innerHTML = "<p class='error'>An error occurred. Please try again.</p>";
    downloadBtn.style.display = "none";
  }
});

// Handle download button click
downloadBtn.addEventListener("click", async () => {
  const element = document.getElementById("report-template");
  
  // Make the report template visible temporarily
  element.style.display = "block";
  
  // Wait for a short time to ensure all content is rendered
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const opt = {
    margin: [10, 10, 10, 10],
    filename: 'eye_disease_report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: true,
      allowTaint: true,
      onclone: function(clonedDoc) {
        const reportTemplate = clonedDoc.getElementById('report-template');
        reportTemplate.style.display = 'block';
        reportTemplate.style.visibility = 'visible';
        reportTemplate.style.position = 'static';
        reportTemplate.style.width = '210mm';
        reportTemplate.style.padding = '20mm';
        reportTemplate.style.backgroundColor = 'white';
      }
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation error:", error);
    alert("Error generating PDF. Please try again.");
  } finally {
    // Hide the report template again
    element.style.display = "none";
  }
});

async function updateReportTemplate(formData, predictionData) {
  return new Promise((resolve) => {
    // Update patient information
    document.getElementById("report-name").textContent = formData.get('name');
    document.getElementById("report-age").textContent = formData.get('age');
    document.getElementById("report-gender").textContent = formData.get('gender');
    document.getElementById("report-blood").textContent = formData.get('bloodGroup');
    document.getElementById("report-operations").textContent = formData.get('pastOperations');
    
    // Update symptoms
    document.getElementById("report-symptoms").textContent = formData.get('symptoms');
    
    // Update diagnosis
    document.getElementById("report-disease").textContent = predictionData.prediction;
    
    // Update checkup time
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
    document.getElementById("checkup-time").textContent = timeString;
    
    // Update image if available
    const imageInput = document.getElementById("image");
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const reportImage = document.getElementById("report-image");
        reportImage.src = e.target.result;
        reportImage.style.display = "block";
        // Wait for image to load
        reportImage.onload = function() {
          resolve();
        };
      };
      reader.readAsDataURL(imageInput.files[0]);
    } else {
      resolve();
    }
  });
}