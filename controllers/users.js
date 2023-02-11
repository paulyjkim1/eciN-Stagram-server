const express = require('express')
const db = require('../models')
const router = express.Router()
const bcrypt = require('bcrypt')

router.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                username: req.body.username,
                email: req.body.email,
            }
        })

        if (!created) {
            return res.status(400).json({ msg: 'This user exists already' })
        }

        else {
            const hashed = bcrypt.hashSync(req.body.password, 12)
            newUser.password = hashed
            await newUser.save()
        }
    } catch (err) {
        console.log(err)
    }

})

module.exports = router