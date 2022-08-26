let logger1 = null;

$(() => {
  logger1 = createLogger("#log");
  setupReisterUser();
});

function setupReisterUser() {
  $("#btnRegister").on("click", registerNewUser);
}


async function registerNewUser() {
  let user = getUserData();
  logger1.log(JSON.stringify(user));
  try {
    let req = await fetchData('POST','/api/users',  { 'content-Type': 'application/json' }, JSON.stringify(user));
    logger1.log(JSON.stringify(req));
    // let id = JSON.parse(req.responseText);
    // id = id._id;
    // sessionStorage.setItem('userId', id);
    // location.assign('/login.html');
  } catch (err) {
    logger1.error(err.response);
  }

}

function getUserData() {
  return {
    firstname: $('#firstname').val(),
    lastname: $('#lastname').val(),
    username: $('#username').val(),
    password: $('#password').val(),
    state: "offline",
    age: Number($('#age').val()),
    gender: $('#gender').val(),
  };

}

