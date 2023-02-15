const express = require('express')
const db = require('../models')
const router = express.Router()
const bcrypt = require('bcrypt')
const authLockedRoute = require('./authLockedRoute')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        // check if user exists already
        const findUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })

        // don't allow emails to register twice
        if (findUser) return res.status(400).json({ msg: 'email exists already' })

        // hash password
        const password = req.body.password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        console.log(hashedPassword)
        // create new user

        const newUser = await db.user.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })


        // create jwt payload
        const payload = {
            username: req.body.username,
            email: req.body.email,
            id: newUser.id
        }

        // sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET)
        // console.log(token)
        res.json({ token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'server error' })
    }
})

router.post('/login', async (req, res) => {
    try {
        // try to find user in the db
        const foundUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })

        const noLoginMessage = 'Incorrect username or password'

        // if the user is not found in the db, return and sent a status of 400 with a message
        if (!foundUser) return res.status(400).json({ msg: noLoginMessage })

        // check the password from the req body against the password in the database
        const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)

        // if provided password does not match, return an send a status of 400 with a message
        if (!matchPasswords) return res.status(400).json({ msg: noLoginMessage })

        // create jwt payload
        const payload = {
            username: foundUser.username,
            email: foundUser.email,
            id: foundUser.id
        }

        // sign jwt and send back
        const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

        res.json({ token })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'server error' })
    }
})

router.get('/auth-locked', authLockedRoute, (req, res) => {
    // we know that if we made it here, hte res.locals contains an authorized user
    res.json({ msg: 'welcome to the private route!' })
})

module.exports = router