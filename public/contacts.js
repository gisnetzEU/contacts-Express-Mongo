refreshButtonClickHandler();
document.getElementById('contacts-refresh').onclick = refreshButtonClickHandler;

////////////// event handlers /////////////////
/**
 * effectue un "rechargement" de la table des contacts
 */
function refreshButtonClickHandler () {
    //deleteContactsFromTable();
    fetchContacts();
}

/**
 * supprime le contact correspondant au click
 * @param {MouseEvent} event est l'événement
 */
function deleteButtonClickHandler (event) {
    deleteContactsFromTable();
    var id = event.target.parentElement.parentElement.children[0].innerText;
    deleteContact(id);
}

////////////// communication avec le serveur /////////////////
/**
/* effectue la requête HTTP pour récupérer les contacts
**/
function fetchContacts () {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var contacts = JSON.parse(xhr.responseText);
            displayError(false);
            injectContactsInTable(contacts);
        } else if (xhr.readyState === 4) {
            console.log(xhr.status);
            displayError(true);
        }
    };
    xhr.open('GET', 'http://localhost:3000/users', true);
    xhr.send();
}

/**
 * supprime le contact de la database et recharge la table
 * @param {string} id  est l'identifiant du contact
 */
function deleteContact (id) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            fetchContacts();
        } else if (xhr.readyState === 4) {
            console.log(xhr.status);
        }
    };
    xhr.open('DELETE', 'http://localhost:3000/users/' + id, true);
    xhr.send();
}

////////////// manipulation du DOM /////////////////
/**
/* supprime les contacts qui se trouvent dans la table
**/
function deleteContactsFromTable () {
    document.querySelector('#contacts tbody').innerHTML = '';
}

/**
/* injecte la liste des contacts dans un le tbody
 * @param {*} contacts est la liste des contacts
 */
function injectContactsInTable (contacts) {
    var contactTable = document.getElementById('contacts');
    contacts.forEach(c => {
        var tr = document.createElement('tr');
        
        var td = document.createElement('td');
        td.innerText = c._id;
        tr.append(td);
        
        td = document.createElement('td');
        td.innerText = c.firstname;
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.innerText = c.lastname;
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.innerText = c.email;
        tr.appendChild(td);
        
        td = document.createElement('td');
        td.innerText = c.phone;
        tr.appendChild(td);
        
        var button = document.createElement('button');
        button.innerText = '+';
        td = document.createElement('td');
        td.appendChild(button);
        tr.appendChild(td);
        
        button = document.createElement('button');
        button.innerText = '-';
        td = document.createElement('td');
        td.onclick = deleteButtonClickHandler
        td.appendChild(button);
        tr.appendChild(td);
        contactTable.querySelector('tbody').appendChild(tr);

        
    });
}

/**
 * affiche ou cache le message d'erreur
 * @param {boolean} show est le status l'affiche, true=>affiche, false=>cache
 */
function displayError (show) {
    var error = document.getElementById('error');
    error.style.display = show ? 'block' : 'none';
}