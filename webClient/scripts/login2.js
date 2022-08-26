let logger2 = null;

$(() => {
  logger2 = createLogger("#log");
  setupReisterUser();
});

function setupReisterUser() {
    $("#btnLogin").on("click",login());
}

async function login(){
    let luser = getLoginCred();
    logger2.log(JSON.stringify(luser));
    try{
        let req = await fetchData('POST','api/auth/login',{'Content-Type': 'application/json'}, JSON.stringify(luser));
  
        sessionStorage.setItem('refreshToken', req.response);

        req = await fetchData('GET', '/api/auth/accessToken', {
            authorization: req.response}, null);

        sessionStorage.setItem('accessToken', req.response);
        location.assign('/postmessage.html');

        
    }catch(err){
        logger2.log(err.response);
    }
}

function getLoginCred(){
    return{
        username: $('#loginUsername').val(),
        password: $('#loginPassword').val()}
};