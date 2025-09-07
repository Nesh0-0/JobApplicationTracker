async function loadStats() {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/stats/getStats', { headers: { Authorization: token } });
        const data = res.data;

        // Update top stats
        document.getElementById("totalApplications").innerText = data.totalApplications;
        document.getElementById("interviews").innerText = data.interviews;
        document.getElementById("offers").innerText = data.offers;
        document.getElementById("rejections").innerText = data.rejection;

        // Applications per Month (convert response to chart format)
        // const months = data.appsPerMonth.map(item => item.month);
        // const monthCounts = data.appsPerMonth.map(item => item.count);

        // new Chart(document.getElementById("applicationsChart"), {
        //   type: "line",
        //   data: {
        //     labels: months,
        //     datasets: [{
        //       label: "Applications",
        //       data: monthCounts,
        //       borderColor: "blue",
        //       fill: false
        //     }]
        //   }
        // });

        // Applications by Company
        const companies = data.appsByCompany.map(item => item.companyName);
        const companyCounts = data.appsByCompany.map(item => item.count);

        new Chart(document.getElementById("companyChart"), {
            type: "pie",
            data: {
                labels: companies,
                datasets: [{
                    data: companyCounts,
                    backgroundColor: ["#4285F4", "#FF9900", "#737373", "#a841f4", "#17a2b8", "#f54291"]
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false
            }
        });

        // Reminders
        new Chart(document.getElementById("reminderChart"), {
            type: "doughnut",
            data: {
                labels: ["Pending", "Sent"],
                datasets: [{
                    data: [data.reminders.pending, data.reminders.sent],
                    backgroundColor: ["#ffc107", "#28a745"]
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false
            }
        });

    } catch (err) {
        console.error("Error loading stats:", err);
    }
}

// Load stats when page is ready
document.addEventListener("DOMContentLoaded", loadStats);


document.getElementById('logoutBtn').addEventListener('click', () => {

  if (!confirm('Do you really want to log out?'))
    return

  localStorage.removeItem('token');

  window.location.href = "login.html";
});
