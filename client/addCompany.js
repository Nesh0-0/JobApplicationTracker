document.getElementById("companyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  const companyData = {
    companyName: document.getElementById("companyName").value,
    contactDetails: document.getElementById("contactDetails").value,
    industry: document.getElementById("industry").value,
    notes: document.getElementById("notes").value
  };

  try {
    await axios.post("http://localhost:3000/companies/addCompany", { companyData }, {
      headers: { Authorization: token }
    });

    alert("Company added successfully!");
    document.getElementById("companyForm").reset();
  } catch (err) {
    console.error("Error adding company:", err);
    alert("Failed to add company.");
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = "login.html";
});
