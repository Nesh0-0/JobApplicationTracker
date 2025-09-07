const token = localStorage.getItem("token");
const companiesTable = document.getElementById("companiesTable");
let editModal = new bootstrap.Modal(document.getElementById("editCompanyModal"));


// Fetch and display companies
const loadCompanies = async () => {
  try {
    const res = await axios.get("http://localhost:3000/companies/getCompanies", {
      headers: { Authorization: token }
    });

    const companies = res.data.details;

    companiesTable.innerHTML = "";

    if (companies.length === 0) {
      companiesTable.innerHTML = `<tr><td colspan="4" class="text-center">No companies found</td></tr>`;
      return;
    }

    companies.forEach((company) => {

      const row = `
        <tr id="${company.id}">
          <td>${company.companyName}</td>
          <td>${company.contactDetails}</td>
          <td>${company.industry}</td>
          <td>${company.notes || "-"}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteCompany(${company.id})">Delete</button>
            <button class="btn btn-sm btn-warning" onclick="openEditModal(${company.id}, '${company.companyName}', '${company.contactDetails}', '${company.industry}', \`${company.notes || ""}\`)">Edit</button>
          </td>
        </tr>
      `;
      companiesTable.innerHTML += row;
    });
  } catch (err) {
    console.error("Error fetching companies:", err);
    companiesTable.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Failed to load companies</td></tr>`;
  }
};


const deleteCompany = async (id) => {


    const element = document.getElementById(`${id}`);

    console.log(element);
    
    if (element) {
      
      element.remove();

      const token = localStorage.getItem('token');

      try {

        const response = await axios.delete(`http://localhost:3000/companies/deleteCompany/${id}`, { headers: { Authorization: token } });
  
        if (!response.data.success) 
          throw new Error(response.data.message)
  
        alert(response.data.message)

      }
      catch (err) {

        alert(err.message);
      }


    } 

};


// Open modal and prefill data
window.openEditModal = (id, name, contact, industry, notes) => {
  document.getElementById("editCompanyId").value = id;
  document.getElementById("editCompanyName").value = name;
  document.getElementById("editContactDetails").value = contact;
  document.getElementById("editIndustry").value = industry;
  document.getElementById("editNotes").value = notes;
  editModal.show();
};

// Handle update
document.getElementById("editCompanyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editCompanyId").value;
  const updatedDetails = {
    id,
    companyName: document.getElementById("editCompanyName").value,
    contactDetails: document.getElementById("editContactDetails").value,
    industry: document.getElementById("editIndustry").value,
    notes: document.getElementById("editNotes").value,
  };

  try {
    await axios.put(`http://localhost:3000/companies/updateCompany`, { updatedDetails }, {
      headers: { Authorization: token }
    });

    editModal.hide();
    loadCompanies();
  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update company");
  }
});




// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = "login.html";
});

// Load on page start
loadCompanies();
