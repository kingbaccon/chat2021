

let cuser;
let logger = null;

$(() => {
    logger = createLogger("#log");
    setup();
});

async function setup() {
    try {
        if (location.href.endsWith('login.html')) {
            let id = sessionStorage.getItem('ruserId');
            if (id) {
                let newUser = await myFetch('GET', `/api/users/${id}`, id, { 'Content-Type': 'application/json' });
                $('#loginUsername').val(JSON.parse(newUser.responseText).username);
                $('#loginPassword').val(JSON.parse(newUser.responseText).password);
            }
        }

        $("#btnRegister").on("click", () => registerNewUser());
        $("#btnCancel").on("click", () => getBackToDefault());
        $("#btnLogin").on("click", () => login());
        $("#btnCreate").on("click", () => createMessage());
        $("#btnGoToAllMessaages").on("click", () => goToAllMessages());
        $("#btnGetMyMessaages").on("click", () => getMyMessages());
        $("#btnGetAllMessaages").on("click", () => getAllMessages());
        $("#btnGetOtherMessages").on("click", () => getOtherMessages());
        $("#btnfindThisTag").on("click", () => searchTag());

        

    } catch (err) {
        logger.log(err.response)
    }
}
async function searchTag(){
    //Ich musste noch im router und im controller die richtige funktion einfügen(die in der Angabe)
    try {
        let searchTag = $('#findByThisTag').val();
        let aToken = sessionStorage.getItem('accessToken');
        let req = await myFetch('GET', `api/messages/?tag=${searchTag}`, null, {
            'authorization': aToken,
            'Content-Type': 'application/json'
        });
        logger.log(`Data: ${req.response}`);
        CreateTableFromJSON(JSON.parse(req.response));
    } catch (err) {
        logger.log(err.response);
    }
}

function goToAllMessages() {

    location.assign('/getallMessages.html');

}
async function getMyMessages() {
    try {
        let aToken = sessionStorage.getItem('accessToken');
        let req = await myFetch('GET', `api/messages/?userId=${sessionStorage.getItem('userid')}`, null, {
            'authorization': aToken,
            'Content-Type': 'application/json'
        });
        logger.log(`Data: ${req.response}`);
        CreateTableFromJSON(JSON.parse(req.response));
    } catch (err) {
        logger.log(err.response);
    }
}
async function getAllMessages() {
    try {
        let aToken = sessionStorage.getItem('accessToken');
        let req = await myFetch('GET', 'api/messages', null, {
            'authorization': aToken,
            'Content-Type': 'application/json'
        });
        logger.log(`Data: ${req.response}`);
        CreateTableFromJSON(JSON.parse(req.response));
    } catch (err) {
        logger.log(err.response);
    }
}
async function getOtherMessages() {
    try {
        let aToken = sessionStorage.getItem('accessToken');
        let req = await myFetch('GET', `api/messages/?notuserId=${sessionStorage.getItem('userid')}`, null, {
            'authorization': aToken,
            'Content-Type': 'application/json'
        });
        logger.log(`Data: ${req.response}`);
        CreateTableFromJSON(JSON.parse(req.response));
    } catch (err) {
        logger.log(err.response);
    }
}

function CreateTableFromJSON(me) {
    var col = [];
    for (var i = 0; i < me.length; i++) {
        for (var key in me[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < me.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = me[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}

async function createMessage() {
    try {
        let nmessage = getMessage();
        

        nmessage.userId = sessionStorage.getItem('userid')
        let aToken = sessionStorage.getItem('accessToken');
        let req = await myFetch('POST', 'api/messages', JSON.stringify(nmessage), {
            'authorization': aToken,
            'Content-Type': 'application/json'
        });
        logger.log(`Data: ${req.response}`);
    } catch (err) {
        logger.log(err.response);
    }

}

async function login() {
    let luser = getLoginCred();
    logger.log(JSON.stringify(luser));
    try {
        let req = await myFetch('POST', 'api/auth/login', JSON.stringify(luser), { 'Content-Type': 'application/json' });
        sessionStorage.setItem('refreshToken', req.response);
        cuser = luser;
        req = await myFetch('GET', '/api/auth/accessToken', null, {
            authorization: req.response
        });
        sessionStorage.setItem('accessToken', req.response);
       
        luser = await myFetch('GET', `/api/users/?username=${luser.username}`, null, { 'Content-Type': 'application/json' });
        luser = JSON.parse(luser.response);
        
        sessionStorage.setItem('userid', luser[0]._id);

        await myFetch('PATCH', `/api/users/${luser[0]._id}`, JSON.stringify({ state: "online" }), { 'Content-Type': 'application/json' });

        location.assign('/postmessage.html');

    } catch (err) {
        logger.log(err.response);
    }
}

async function registerNewUser() {
    let user = getUserData();
    logger.log(JSON.stringify(user));
    try {
        let req = await myFetch('POST', '/api/users', JSON.stringify(user), { 'Content-Type': 'application/json' })
        let id = JSON.parse(req.responseText);
        id = id._id;
        sessionStorage.setItem('ruserId', id);
        location.assign('/login.html');
    } catch (err) {
        logger.log(err.response);
    }

}


function getLoginCred() {
    return {
        username: $('#loginUsername').val(),
        password: $('#loginPassword').val()
    }
};




function getUserData() {
    return {
        firstname: $('#firstname').val() || '',
        lastname: $('#lastname').val() || '',
        username: $('#username').val(),
        password: $('#password').val() || '',
        state: "offline",
        age: Number($('#age').val()),
        gender: $('#gender').val(),
    };

}


function getMessage() {
    return {
        subject: $('#subject').val(),
        msgText: $('#msgText').val(),
        tag: $('#tag').val()
    };
}


function myFetch(method, url, data, header) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status <= 299) {
                    resolve(this);
                } else {
                    reject(this);
                }
            }
        };

        request.open(method, url, true);
        for (const h in header) {
            request.setRequestHeader(h, header[h]);
        }

        request.send(data);
    });
}
function getBackToDefault() {
    location.assign('/default.html');
}