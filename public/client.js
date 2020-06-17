var contacts = document.getElementById("contacts");
var btnContactsRefresh = document.getElementById("contacts-refresh");
var contentHTML = document.getElementById("content");

refreshButtonHandler();
btnContactsRefresh.onclick = refreshButtonHandler;

function refreshButtonHandler() {
    // console.log("1) HTTP Fetch localhost:3000/users ");
    // fetchContacts();
    // console.log("2) Injectr la liste des users dans le DOM");

    //deleteteContactsFromTable();
    fetchContacts();
}

//fait la requete HTTP GET localhost:3000/users
function fetchContacts() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("responseText: ", xhr.responseText);
            var users = JSON.parse(xhr.responseText);
            showResults(users);
        } else {
            console.error("GetReq: Fail", xhr);
        }
    };
    //xhr.onload = responseHandlerCB;
    xhr.open("GET", "http://localhost:3000/users", true);
    xhr.send();
}

const showResults = (users) => {
    let html = `
    
    <table class="table table-hover">
    <thead>
        <tr>
          <th>Id</th>
          <th>Prénom</th>
          <th>Nom</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Edit </th>
          <th>Delete </th>
        </tr>
    </thead>
    <tbody>
      <tr>    
`;

    users.forEach(function (user, i) {
        html += `     

        <td>${user._id}</td>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td> <button onclick="editButtonClickHandler('${user._id}')">+</button> </td>
        <td> <button onclick="deleteButtonClickHandler('${user._id}')">-</button> </td>
      </tr>

        
      `;
    });
    contentHTML.innerHTML = html;
};

function editButtonClickHandler(id) {
    window.location.href = 'editUser.html?id=' + encodeURI(id);
}

function deleteButtonClickHandler(id) {
    deleteContactsFromTable();
    deleteContacts(id);
}

function deleteContacts(id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            fetchContacts();
        } else if (xhr.readyState === 4) {
            console.log(xhr.status);
        }
    };
    //xhr.onload = responseHandlerCB;
    xhr.open("DELETE", "http://localhost:3000/users/" + id, true);
    xhr.send();
}

/**
/* supprime les contacts qui se trouvent dans la table
**/
function deleteContactsFromTable() {
    contentHTML.innerHTML = '';
}
