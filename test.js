const express = require('express')
const db = require('./models')

// const postCrud = async function () {
//     try {

//         const newUser = await db.user.create({
//             username: 'username2',
//             email: 'email2',
//             password: 'password2'
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }
// postCrud()

const postCrud = async function () {
    try {

        const newPost = await db.post.create({
            userId: 2,
            image: 'image7',
            caption: 'caption7'
        })
    } catch (err) {
        console.log(err)
    }
}
postCrud()
// const postCrud = async function () {
//     try {

//         const newPost = await db.post.create({
//             userId: 1,
//             image: 'image2',
//             caption: 'caption2'
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }
// postCrud()