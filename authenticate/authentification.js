const express = require("express");
const router = express.Router();

const AppError = require("../errors/app-error");
const { handleAsyncError } = require("../errors/error-handler");

let userController = require("../users/user-controller");

const refreshTokens = [];
const accessTokens = {};

router.post(
  "/login",
  handleAsyncError(async (req, res, next) => {
    let user = await checkCredentials(req.body);
    let rToken = generateRefreshToken(user);
    res.status(200).send(rToken);
  })
);

router.get(
  "/accessToken",
  handleAsyncError(async (req, res, next) => {
    let sentRefreshToken = req.headers["authorization"];

    if (Object.keys(accessTokens).includes(sentRefreshToken)) {
      accessTokens[sentRefreshToken] = Math.floor(Math.random() * 1000) + 10000;
      res.status(200).send(accessTokens[sentRefreshToken].toString());
    } else {
      throw new AppError(401, "unauthorized")
    }
  })
);

function authenticate(req, res, next) {
  if (res.headersSent) {
    next();
    return;
  }

  let accessToken = req.headers["authorization"];
  if (!accessToken) throw new AppError(401, "access denied");

  let lowerCasedAccessToken = accessToken.toLowerCase();
  if (lowerCasedAccessToken.startsWith("bearer "))
    accessToken = accessToken.slice(7, accessToken.length);

  if (Object.values(accessTokens).includes(Number(accessToken))) {
    next();
  } else {
    throw new AppError(401, "unauthorized")
  }
}

async function checkCredentials(credentials) {
  let users = await userController.getFiltered(credentials);
  if (users.length == 0) throw new AppError(401, "access denied");

  return users[0];
}

function generateRefreshToken(user) {
  let rToken = refreshTokens.find((t) => t.username === user.username);
  if (!rToken) {
    rToken = { username: user.username };
    refreshTokens.push(rToken);
  }
  rToken.token = Math.floor(Math.random() * 10000);
  accessTokens[rToken.token] = null;

  return rToken.token.toString();
}

module.exports = { authenticate, authRouter: router };
