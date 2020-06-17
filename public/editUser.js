const getQueryStringParams = query => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                let [key, value] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {}
            )
        : {}
};

const fetchContact = (id) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("responseText: ", xhr.responseText);
                const user = JSON.parse(xhr.responseText);
                showUser(user);
            } else {
                console.error("GetReq: Fail", xhr);
            }
        }
    };
    //xhr.onload = responseHandlerCB;
    xhr.open("GET", "http://localhost:3000/users/" + encodeURI(id), true);
    xhr.send();
}

const showUser = (user) => {
    form.elements.firstname.value = user.firstname;
    form.elements.lastname.value = user.lastname;
    form.elements.email.value = user.email;
    form.elements.phone.value = user.phone;
}


const form = document.getElementById("editContact");

const queryParams = getQueryStringParams(window.location.search);
const id = queryParams['id'];

fetchContact(id);

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("responseText: ", xhr.responseText);
                alert('User modified');
                window.location.href = "index.html"
            } else {
                console.error("GetReq: Fail", xhr);
            }
        }
    };

    const fd = new FormData(form);
    //xhr.onload = responseHandlerCB;
    xhr.open("PUT", "http://localhost:3000/users/" + id, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(Object.fromEntries(fd)));
})