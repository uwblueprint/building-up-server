const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config/config');

const accessTokenSecret = ACCESS_TOKEN_SECRET;
const refreshTokenSecret = REFRESH_TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
  try {
    const accessToken = req.cookies['access-token'];
    if (!accessToken) {
      // eslint-disable-next-line no-console
      console.log('Missing access token');
    }
    const accessData = jwt.verify(accessToken, accessTokenSecret);
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

        const refreshData = jwt.verify(refreshToken, refreshTokenSecret);
        const newAccessToken = jwt.sign({ userId: refreshData.userId }, accessTokenSecret, {
          expiresIn: '1h',
        });
        res.cookie('access-token', newAccessToken);
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

exports.authenticateToken = authenticateToken;
