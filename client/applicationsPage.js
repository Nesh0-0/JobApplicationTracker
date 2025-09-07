let currentPage = 1;
let limit = 2; // default items per page
let totalPages = 1;
let allApplications = [];
// Fetch total applications count
const getApplicationsCount = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/applications/count", {
      headers: { Authorization: token },
    });
    return res.data.count; // backend should return { count: number }
  } catch (err) {
    console.error("Error fetching count:", err);
    return 0;
  }
};

// Fetch applications for a page
const getApplications = async (page = 1, entries = 2) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `http://localhost:3000/applications/getApplications?page=${page}&entries=${entries}`,
      { headers: { Authorization: token } }
    );

    if (res.data.reload) {

      localStorage.removeItem('token');
      window.location.href = "login.html";
    }

    const applications = res.data.details || res.data;
    allApplications = res.data.details;
    renderApplications(applications);
    renderPagination(page, totalPages);
  } catch (err) {
    console.error("Error fetching applications:", err);
    document.getElementById("applicationsDiv").innerHTML =
      `<div class="alert alert-danger">Failed to load applications.</div>`;
  }
};

// Render applications into a table
const renderApplications = (applications) => {
  if (!applications || applications.length === 0) {
    document.getElementById("applicationsDiv").innerHTML =
      `<div class="alert alert-warning">No applications found.</div>`;
    return;
  }

  let html = `
    <div class="card shadow-sm">
      <div class="card-body">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Company</th>
              <th>Job Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
  `;

  applications.forEach((app) => {
    html += `
      <tr id="${app.id}">
        <td>${app.companyName}</td>
        <td>${app.jobTitle}</td>
        <td>${app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : ""}</td>
        <td>${app.status}</td>
        <td>${app.notes || ""}</td>
        <td>
          <button class="btn btn-sm btn-danger me-1" onclick="deleteApplication(${app.id})">
            <i class="bi bi-trash"></i> Delete
          </button>

          <button class="btn btn-sm btn-primary me-1" onclick="downloadFile(${app.id})">
            <i class="bi bi-file-earmark-arrow-down"></i> Resume
          </button>

          <button class="btn btn-sm btn-warning me-1" onclick="editApplication(${app.id})">
            <i class="bi bi-pencil-square"></i> Edit
          </button>

          <button class="btn btn-sm btn-success" onclick="addReminder(${app.id})">
            <i class="bi bi-bell"></i> Reminder
          </button>

        </td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById("applicationsDiv").innerHTML = html;
};

// Render pagination with dropdown
const renderPagination = (page, totalPages) => {
  let pageOptions = "";
  for (let i = 1; i <= totalPages; i++) {
    pageOptions += `<option value="${i}" ${i === page ? "selected" : ""}>${i}</option>`;
  }

  let html = `
    <nav class="d-flex justify-content-center align-items-center gap-3 mt-3">
      <ul class="pagination mb-0">
        <li class="page-item ${page === 1 ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="changePage(${page - 1}, event)">Prev</a>
        </li>
        <li class="page-item ${page === totalPages ? "disabled" : ""}">
          <a class="page-link" href="#" onclick="changePage(${page + 1}, event)">Next</a>
        </li>
      </ul>
      <div>
        <label for="pageSelect" class="me-2">Go to page:</label>
        <select id="pageSelect" class="form-select d-inline-block w-auto">
          ${pageOptions}
        </select>
      </div>
    </nav>
  `;

  document.getElementById("paginationDiv").innerHTML = html;

  // Attach event listener to dropdown
  document.getElementById("pageSelect").addEventListener("change", (e) => {
    const selectedPage = parseInt(e.target.value);
    changePage(selectedPage, e);
  });
};

// Handle page change
const changePage = (page, event) => {
  if (event) event.preventDefault();
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  getApplications(currentPage, limit);
};

// Handle dropdown change for items per page
document.getElementById("pagination").addEventListener("change", async (e) => {
  limit = parseInt(e.target.value);
  currentPage = 1;
  const count = await getApplicationsCount();
  totalPages = Math.ceil(count / limit);
  getApplications(currentPage, limit);
});

// Load applications on page load
window.onload = async () => {
  if (!localStorage.getItem('token'))
    window.location.href = "login.html";

  const count = await getApplicationsCount();
  totalPages = Math.ceil(count / limit);
  getApplications(currentPage, limit);
};



const deleteApplication = async (id) => {
  if (!confirm("Are you sure you want to delete this application?")) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:3000/applications/deleteApplication/${id}`, {
      headers: { Authorization: token },
    });

    // Remove the row from DOM
    const row = document.getElementById(`${id}`);
    if (row) row.remove();

    // Update count and pagination if needed
    const count = await getApplicationsCount();
    totalPages = Math.ceil(count / limit);

    if (document.querySelector("#applicationsDiv tbody").children.length === 0 && currentPage > 1) {
      currentPage--; // go back one page if current page is empty
    }

    getApplications(currentPage, limit);
  } catch (err) {
    console.error("Error deleting application:", err);
    alert("Failed to delete application");
  }
};


document.getElementById('logoutBtn').addEventListener('click', () => {

  if (!confirm('Do you really want to log out?'))
    return

  localStorage.removeItem('token');

  window.location.href = "login.html";
});


const downloadFile = async (id) => {

  try {

    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:3000/applications/downloadResume?id=${id}`, { headers: { 'Authorization': token } });

    if (!response.data.success)
      throw new Error('Could not download resume. Try again!');


    window.location.href = response.data.download;
  }

  catch (err) {

    alert(err.message);
  }
};


const editApplication = (id) => {
  const row = document.getElementById(id);
  if (!row) return;

  document.getElementById("editAppId").value = id;
  document.getElementById("editCompany").value = row.children[0].textContent;
  document.getElementById("editJobTitle").value = row.children[1].textContent;
  document.getElementById("editDate").value = new Date(row.children[2].textContent).toISOString().split("T")[0] || "";
  document.getElementById("editStatus").value = row.children[3].textContent;
  document.getElementById("editNotes").value = row.children[4].textContent;

  const modal = new bootstrap.Modal(document.getElementById("editModal"));
  modal.show();
};



document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("editAppId").value;
  const updatedData = {
    companyName: document.getElementById("editCompany").value,
    jobTitle: document.getElementById("editJobTitle").value,
    applicationDate: document.getElementById("editDate").value,
    status: document.getElementById("editStatus").value,
    notes: document.getElementById("editNotes").value,
  };

  try {
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:3000/applications/updateApplication/${id}`, { updatedData }, {
      headers: { Authorization: token },
    });

    alert("Application updated!");
    const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    modal.hide();
    getApplications(currentPage, limit);
  } catch (err) {
    console.error("Error updating:", err);
    alert("Failed to update application");
  }
});


// Apply filters
function applyFilters() {
  const searchText = document.getElementById("searchBox").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;

  let filtered = allApplications.filter(app => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchText) ||
      app.jobTitle.toLowerCase().includes(searchText);
    const matchesStatus = status === "" || app.status === status;
    return matchesSearch && matchesStatus;
  });

  renderApplications(filtered);
}

document.getElementById("filterBtn").addEventListener("click", applyFilters);
document.getElementById("searchBox").addEventListener("input", applyFilters);





const addReminder = (id) => {
  document.getElementById("reminderAppId").value = id; // set job app ID
  const modal = new bootstrap.Modal(document.getElementById("reminderModal"));
  modal.show();
};



document.getElementById("reminderForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const jobId = document.getElementById("reminderAppId").value;
  const reminderDate = document.getElementById("reminderDate").value;
  const message = document.getElementById("reminderMessage").value;

  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:3000/reminders/addReminder", {
      jobId,
      reminderDate,
      message
    }, {
      headers: { Authorization: token }
    });

    alert("Reminder saved!");
    document.getElementById("reminderForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("reminderModal"));
    modal.hide();
  } catch (err) {
    console.error("Error saving reminder:", err);
    alert("Failed to save reminder");
  }
});







