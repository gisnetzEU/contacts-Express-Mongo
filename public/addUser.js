const form = document.getElementById("addContact");

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 201) {
            console.log("responseText: ", xhr.responseText);
            alert('User added');
            window.location.href="index.html"
        } else {
            console.error("GetReq: Fail", xhr);
           
        }
    };
    
    const fd = new FormData( form );
    //xhr.onload = responseHandlerCB;
    xhr.open("POST", "http://localhost:3000/users", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(Object.fromEntries(fd)));
})
