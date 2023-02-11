const express = require('express')
const db = require('./models')

const postCrud = async function () {
    try {

        const newUser = await db.user.create({
            username: 'username',
            email: 'email',
            password: 'password'
        })
    } catch (err) {
        console.log(err)
    }
}
postCrud()