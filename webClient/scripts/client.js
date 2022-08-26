let logger = null;

$(() => {
  logger = createLogger("#log");
  setup();
});

function setup() {
  $("#btn01").on("click", () => promisfiedGetData("ok"));
  $("#btn02").on("click", () => promisfiedGetData("fail1"));
  $("#btn03").on("click", () => promisfiedGetData("fail2"));
  $("#btn04").on("click", () => promisfiedGetData("fail3"));
  $("#btn00").on("click", promisfiedGetDataWithAccessToken);
  $("#btn06").on("click", clearTokens);
  $("#btnRPage").on("click",() => goToRegister());
  $("#btnLPage").on("click",() => goToLogin());

}


function promisfiedGetData(type) {
  logger.log(`---------------------------------------`);

  let credentials = {
    username: $("#username").val(),
    password: $("#password").val(),
  };

  if (type === "fail3") credentials.password = "not correct anymore";
  fetchData(
    $("#mehthod1").val(),
    $("#loginEndpoint").val(),
    { "Content-type": "application/json" },
    JSON.stringify(credentials)
  )
    .then((response) => {
      let refreshToken = response.responseText;
      logger.success(`received refreshToken: ${refreshToken}`);

      if (type === "fail1") refreshToken += 100000;
      storeToken("refreshToken", refreshToken);

      return fetchData( $("#mehthod2").val(), $("#accessTokenEndpoint").val(), { authorization: refreshToken });
    })
    .then((response) => {
      let accessToken = response.responseText;
      logger.success(`received accessToken: ${accessToken}`);

      if (type === "fail2") accessToken += 100000;
      storeToken("accessToken", accessToken);

      return fetchData($("#mehthod3").val(), $("#dataEndpoint").val(), { authorization: accessToken });
    })
    .then((response) => {
      let data = response.responseText;
      logger.success(`received data: ${data}`);
    })
    .catch((err) => {
      logger.error(err ? err.responseText : 'no error info here');
    });
}

function fetchData(method, url, headers, data) {
  return new Promise((resolve, reject) => {
    try {
      const httpRequest = new XMLHttpRequest();
      httpRequest.onreadystatechange = function () {
        try {
          if (this.readyState == 4) {
            if (this.status >= 200 && this.status <= 299) {
              resolve(this);
            } else {
              reject(this);
            }
          }
        } catch (err) {
          console.error("an unexpected error has occured", err);
          reject(err);
        }
      };
      httpRequest.open(method, url, true);
      for (let key in headers) {
        httpRequest.setRequestHeader(key, headers[key]);
      }
      httpRequest.send(data);
    } catch (err) {
      console.error("an unexpected error has occured", err);
      reject(err);
    }
  });
}

async function promisfiedGetDataWithAccessToken() {
  try{
    let aToken = getToken("accessToken");
    let response = await fetchData($("#mehthod3").val(), $("#dataEndpoint").val(), { authorization: aToken })
    let data = response.responseText
    logger.success(`received data: ${data}`);
  }
  catch(err){
    logger.error(err ? err.responseText : 'no error info here');
  }
}

function storeToken(tokenType, token) {
  sessionStorage.setItem(tokenType, token);
}

function getToken(tokenType) {
  return sessionStorage.getItem(tokenType);
}

function clearTokens() {
  logger.log(`accessToken and refreshToken removed from sessionStorage`);
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}


function goToRegister(){
  location.assign('/register-user.html');
}
function goToLogin(){
  location.assign('/login.html');
}
