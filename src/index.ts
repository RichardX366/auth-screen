import { RequestHandler } from 'express';

const authScreen =
  (password: string): RequestHandler =>
  (req, res, next) => {
    setTimeout(() => {
      if (req.path === '/' && req.method === 'GET') {
        if (req.signedCookies?.auth === password) next();
        else res.sendFile(__dirname + '/../files/login.html');
      } else if (req.path === '/__auth-screen.css' && req.method === 'GET') {
        res.sendFile(__dirname + '/../files/__auth-screen.css');
      } else if (req.path === '/password' && req.method === 'POST') {
        if (req.body.password === password) {
          res.cookie('auth', password, {
            httpOnly: true,
            secure: true,
            signed: true,
          });
          res.send('success');
        } else res.send('Incorrect password!');
      } else {
        if (
          req.signedCookies?.auth === password ||
          req.body.password === password
        ) {
          next();
        } else res.status(401).send('Unauthorized');
      }
    }, 75 + Math.random() * 50);
  };
export default authScreen;
