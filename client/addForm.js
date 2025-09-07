
const token = localStorage.getItem('token');

if (!token)
    window.location.href = "login.html";


const addJobApplication = async (event) => {
  event.preventDefault();
  try {
    const token = localStorage.getItem("token");
    const { companyName, jobTitle, applicationDate, status, notes, resume } = event.target;

    // Create form data
    const formData = new FormData();
    formData.append("companyName", companyName.value);
    formData.append("jobTitle", jobTitle.value);
    formData.append("applicationDate", applicationDate.value);
    formData.append("status", status.value);
    formData.append("notes", notes.value);
    formData.append("resume", resume.files[0]); // ✅ correct way to grab file

    // Send as multipart/form-data
    await axios.post("http://localhost:3000/applications/addApplication", formData, {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Application added successfully!");
    event.target.reset();
  } catch (err) {
    console.error(err);
    alert("Error adding job application!");
  }
};



document.getElementById('logoutBtn').addEventListener('click', () => {

    if (!confirm('Do you really want to log out?'))
        return

    localStorage.removeItem('token');

    window.location.href = "login.html";
})