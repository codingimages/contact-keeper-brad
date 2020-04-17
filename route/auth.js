const express = require("express")
const router = express.Router()

const { check, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("config")
const auth = require("../middleware/auth")


// import user model schema
const User = require("../models/User")

// @route GET api/auth
// @desc  Get logged in user
// @access Private

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})

// @route POST api/auth
// @desc  Auth user and get token in user
// @access Public

router.post("/", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password id required").exists()
],

    async (req, res) => {
        // validate login fields
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        // destructure from body
        const { email, password } = req.body;

        // find user
        try {
            let user = await User.findOne({ email })

            // user validation
            if (!user) {
                return res.status(400).json({ message: "Invalid Credentials" })
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: "Invalid Credentials" })
            }

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
            console.error(error.message)
            res.status(500).send("Server Error")
        }
    })


module.exports = router;