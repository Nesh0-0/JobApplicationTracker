


const getGroups = async () => {

    try {

        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/groups/getAllGroups', { headers: { Authorization: token } });
        // console.log(response.data);
        const groups = response.data.details;
        console.log(groups);
        groups.forEach(group => {
            const btn = document.createElement("a");
            console.log(group.groupName);
            btn.href = `groupChat.html?groupId=${group.id}&groupName=${encodeURIComponent(group.groupName)}`;
            btn.className = "list-group-item list-group-item-action";
            btn.textContent = group.groupName;
            groupList.appendChild(btn);
        });
    }

    catch (err) {

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