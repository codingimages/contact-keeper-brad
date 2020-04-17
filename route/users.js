const express = require("express")
const router = express.Router()
const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")


// import user model schema
const User = require("../models/User")

// @route POST api/users
// @desc  Register a user
// @access Public

router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please emter a password with 6 or more characters")
        .isLength({ min: 6 })],

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            // check if user exists
            if (user) {
                res.status(400).json({ msg: "User Already Exists" })
            }

            //using model we created
            user = new User({
                name,
                email,
                password
            });

            // encripting passowrd with bcrypt
            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            // save the user to mongodb
            await user.save();

            // create payload with user id, to send in jwt
            const payload = {
                user: {
                    id: user.id
                }
            }

            // generate a token
            jwt.sign(payload, config.get("jwtSecret"), {
                expiresIn: 360000,

            }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })


        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error")
        }
    })

module.exports = router;