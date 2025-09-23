// const socket = io("http://localhost:3000");



const getGroups = async () => {
    try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1])); 
        const userId = user.id;

        const response = await axios.get('http://localhost:3000/groups/getAllGroups', { 
            headers: { Authorization: token } 
        });

        const groups = response.data.details;
        groupList.innerHTML = ""; // clear previous

        groups.forEach(group => {
            const div = document.createElement("div");
            div.className = "list-group-item d-flex justify-content-between align-items-center";

            const link = document.createElement("a");
            link.href = `groupChat.html?groupId=${group.id}&groupName=${encodeURIComponent(group.groupName)}`;
            link.textContent = group.groupName;
            div.appendChild(link);

            // If the logged-in user is the creator, show delete button
            console.log(group.userId, userId);
            if (group.userId === userId) {
                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";
                deleteBtn.className = "btn btn-sm btn-danger";
                deleteBtn.addEventListener("click", async () => {
                    if (confirm(`Delete group "${group.groupName}"?`)) {
                        try {
                            const res = await axios.delete(`http://localhost:3000/groups/deleteGroup/${group.id}`, { 
                                headers: { Authorization: token } 
                            });
                            if (res.data.success) {
                                alert("Group deleted successfully!");
                                getGroups(); // reload groups
                                // socket.emit('deleteGroup', groupId);
                            } else {
                                alert("Could not delete group!");
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    }
                });
                div.appendChild(deleteBtn);
            }

            groupList.appendChild(div);
        });
    } catch (err) {
        console.log(err);
    }
};



const createGroup = async (event) => {

    event.preventDefault();
    const token = localStorage.getItem('token');
    const groupName = event.target.groupName.value;
    const response = await axios.post('http://localhost:3000/groups/createGroup', { groupName }, { headers: { Authorization: token } });
    if (!response.data.success)
        alert('Could not create group!')
    else
        alert('Group created successfully!');
        window.location.reload();
}

window.addEventListener('load', getGroups);


document.getElementById('logoutBtn').addEventListener('click', () => {

  if (!confirm('Do you really want to log out?'))
    return

  localStorage.removeItem('token');

  window.location.href = "login.html";
});


// socket.on('groupDeleted', () => {
//     window.location.reload();
// });