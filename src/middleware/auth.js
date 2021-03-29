const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config/config');

const createNewRefreshToken = userID => {
  return jwt.sign({ userId: userID }, REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

const createNewAccessToken = userID => {
  return jwt.sign({ userId: userID }, ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

const cookieOptions = {
  httpOnly: true,
  sameSite: 'None',
  secure: true,
};

const addAccessTokenCookie = (res, accessToken) => {
  res.cookie('access-token', accessToken, cookieOptions);
};

const addRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refresh-token', refreshToken, cookieOptions);
};

const clearAccessTokenCookie = res => {
  res.clearCookie('access-token', cookieOptions);
};

const clearRefreshTokenCookie = res => {
  res.clearCookie('refresh-token', cookieOptions);
};

const authenticateToken = (req, res, next) => {
  try {
    const accessToken = req.cookies['access-token'];
    if (!accessToken) {
      // eslint-disable-next-line no-console
      console.log('Missing access token');
    }
    const accessData = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    req.userId = accessData.userId;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Generate a refresh token
      try {
        const refreshToken = req.cookies['refresh-token'];
        if (!refreshToken) {
          // eslint-disable-next-line no-console
          console.log('Missing refresh token');
        }

        const refreshData = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const newAccessToken = createNewAccessToken(refreshData.userId);

        addAccessTokenCookie(res, newAccessToken);
        req.userId = refreshData.userId;
      } catch (error2) {
        // eslint-disable-next-line no-console
        console.log(error2);
      }
    } else {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  next();
};

exports.authenticateToken = authenticateToken;
exports.createNewAccessToken = createNewAccessToken;
exports.createNewRefreshToken = createNewRefreshToken;
exports.addAccessTokenCookie = addAccessTokenCookie;
exports.addRefreshTokenCookie = addRefreshTokenCookie;
exports.clearAccessTokenCookie = clearAccessTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
