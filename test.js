const express = require('express')
const db = require('./models')

const postCrud = async function () {
    try {

        const newUser = await db.user.create({
            username: 'username2',
            email: 'email2',
            password: 'password2'
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
//             image: 'image4',
//             caption: 'caption4'
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }
// postCrud()

// const postCrud = async function () {
//     try {

//         const newPost = await db.comment.create({
//             userId: 1,
//             postId: 1,
//             content: 'comment2'
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }
// postCrud()