const express = require('express')
const db = require('./models')

// const postCrud = async function () {
//     try {

//         const newUser = await db.user.create({
//             username: 'username',
//             email: 'email',
//             password: 'password'
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }
// postCrud()
const postCrud = async function () {
    try {

        const newPost = await db.post.create({
            userId: 1,
            image: 'image2',
            caption: 'caption2'
        })
    } catch (err) {
        console.log(err)
    }
}
postCrud()