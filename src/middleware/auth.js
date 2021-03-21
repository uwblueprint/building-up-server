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
      //Generate a refresh token
      try {
        const refreshToken = req.cookies['refresh-token'];
        if (!refreshToken) {
          console.log('Missing refresh token');
          return res.status(404).json({ error: 'Missing refresh token' });
        }

        const refreshData = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const newAccessToken = createNewAccessToken(refreshData.userId);

        addAccessTokenCookie(res, newAccessToken);
        req.userId = refreshData.userId;
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(error);
    }
  }

  next();
};

const addAccessTokenCookie = (res, accessToken) => {
  res.cookie('access-token', accessToken);
};

const addRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refresh-token', refreshToken);
};

const clearAccessTokenCookie = res => {
  res.clearCookie('access-token');
};

const clearRefreshTokenCookie = res => {
  res.clearCookie('refresh-token');
};

exports.authenticateToken = authenticateToken;
exports.createNewAccessToken = createNewAccessToken;
exports.createNewRefreshToken = createNewRefreshToken;
exports.addAccessTokenCookie = addAccessTokenCookie;
exports.addRefreshTokenCookie = addRefreshTokenCookie;
exports.clearAccessTokenCookie = clearAccessTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
