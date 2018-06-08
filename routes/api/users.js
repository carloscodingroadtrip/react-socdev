const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//load User model
const User = require('../../models/User');

//@route    GET api/users/test
//@desc     Test users route
//@access   Public
router.get('/test', (req, res) => {
    res.json({
        msg: 'users page'
    });
});

//@route    POST api/users/register
//@desc     Register user
//@access   Public
router.post('/register', (req, res) => {
    //Check Validation
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    };

    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                errors.email = 'Email already exists.'
                return res.status(400).json(errors);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm', //default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password + 'egf', salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
        .catch(err => console.log(err));
});


//@route    POST api/users/login
//@desc     Login user / returning JWT Token
//@access   Public
router.post('/login', (req, res) => {
    //Check Validation
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    };
    const email = req.body.email;
    const password = req.body.password;
    //find user by email
    User.findOne({
        email
    }).then(user => {
        // check for user
        if (!user) {
            errors.email = 'User not found';
            return res.status(404).json(errors);
        }
        //check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    //next time will send the token back
                    // res.json({msg: 'success'});

                    //create jwt payload
                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    };

                    //Implementing JWT token
                    //Sign the token  jwt(payload, ex)
                    jwt.sign(
                        payload,
                        keys.secretOrKey, {
                            expiresIn: 3600
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                            });

                        });
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(400).json(errors);
                }
            });
    });
});

//@route    GET api/users/current
//@desc     Return current user after validating the token
//@access   Private
router.get('/current', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    // res.json({msg: 'success'});
    //Now we can access the user on the req and we can send that as JSON
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
    });
});

module.exports = router;