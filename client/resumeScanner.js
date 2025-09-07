document.getElementById("scanForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("resume", document.getElementById("resume").files[0]);
    formData.append("jobDescription", document.getElementById("jobDescription").value);
    
    const token = localStorage.getItem('token');
    const res = await axios.post("http://localhost:3000/scanResume/scan", formData, {
  headers: { "Content-Type": "multipart/form-data" , 'Authorization': token}
});

if (!res.data.success) {

    alert('Resume review failed!');
    return 
}
    

const analysis = res.data.details;

let html = `
  <div class="card p-4 shadow-sm">
    <h4 class="mb-3">Resume Analysis for <em>${res.data.file}</em></h4>
    <p><strong>🎯 Relevance Score:</strong> <span class="badge bg-primary">${analysis.relevanceScore || "N/A"}%</span></p>
    <p><strong>📝 Summary:</strong> ${analysis.summary || "No summary available"}</p>
    <hr>

    <h5>✅ Matched Skills</h5>
    <ul class="list-group mb-3">
      ${(analysis.matchedSkills || []).map(s => `<li class="list-group-item">${s}</li>`).join("")}
    </ul>

    <h5>❌ Missing Skills</h5>
    <ul class="list-group mb-3">
      ${(analysis.missingSkills || []).map(s => `<li class="list-group-item">${s}</li>`).join("")}
    </ul>

    <h5>💪 Strengths</h5>
    <ul class="list-group mb-3">
      ${(analysis.strengths || []).map(s => `<li class="list-group-item">${s}</li>`).join("")}
    </ul>

    <h5>📌 Suggestions</h5>
    <ul class="list-group mb-3">
      ${(analysis.suggestions || []).map(s => `<li class="list-group-item">${s}</li>`).join("")}
    </ul>
  </div>
`;

document.getElementById("result").innerHTML = html;

});


document.getElementById('logoutBtn').addEventListener('click', () => {

    localStorage.removeItem('token');
    window.location.href = 'login.html';
})