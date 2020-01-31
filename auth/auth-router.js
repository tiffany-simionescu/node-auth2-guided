const router = require('express').Router();
// Keep track of people logged in
// const tokens = {};
const bcrypt = require('bcryptjs');
const restricted = require('../auth/restricted-middleware');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res, next) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      next(error);
    });
});

router.post('/login', (req, res, next) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // const token = Math.random();
        // tokens[token] = user;
        // console.log(tokens);

        // stores the user data in the current session,
        // so it persists between requests
        req.session.user = user;

        res.status(200).json({
          // token: token,
          message: `Welcome ${user.username}!`,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      next(error);
    });
});

router.get('/protected', restricted(), async (req, res, next) => {
  try {
    console.log(req.headers);
    // const { token } = req.headers;

    // if (!token || !tokens[token]) {
    //   return res.status(403).json({
    //     message: "You are not authorized!"
    //   })
    // }

    // if (!req.session || !req.session.user) {
    //   return res.status(403).json({
    //         message: "You are not authorized!"
    //   }) 
    // }
    res.json({
      message: "You are authorized!"
    })
  } catch (err) {
    next(err);
  }
})

router.get('/logout', restricted(), (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      next(err)
    } else {
      res.json({
        message: "You are logged out."
      })
    }
  })
})

module.exports = router;
