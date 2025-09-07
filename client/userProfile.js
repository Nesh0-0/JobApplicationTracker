// Fetch user details
async function fetchUserDetails() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "login.html";
      return;
    }

    const res = await axios.get("http://localhost:3000/users/profile", {
      headers: { Authorization: token }
    });

    const user = res.data.details;

    // Display values
    document.getElementById("username").textContent = user.username || "N/A";
    document.getElementById("email").textContent = user.email || "N/A";
    document.getElementById("phone").textContent = user.phone || "N/A";

    // Pre-fill modal inputs
    document.getElementById("editUsername").value = user.username || "";
    document.getElementById("editEmail").value = user.email || "";
    document.getElementById("editPhone").value = user.phone || "";
  } catch (err) {
    console.error("Error fetching user details:", err);
  }
}

// Update user details
document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");
    const updatedUser = {
      username: document.getElementById("editUsername").value,
      email: document.getElementById("editEmail").value,
      phone: document.getElementById("editPhone").value
    };

    await axios.put("http://localhost:3000/users/updateProfile", {updatedUser}, {
      headers: { Authorization: token }
    });

    // Refresh UI
    fetchUserDetails();

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
    modal.hide();
  } catch (err) {
    console.error("Error updating profile:", err);
    alert("Failed to update profile.");
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
  window.location.href = "login.html";
});

// Initial load
fetchUserDetails();
