const express = require('express')
const db = require('../models')
const router = express.Router()
const multer = require('multer')
const { unlinkSync } = require('fs')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const upload = multer({dest:'uploads/'})

// GET /posts
router.get('/:id/comments', async (req, res) => {
    try {
        // const postDet = await db.post.findByPk(req.params.id)
        const findComment = await db.comment.findAll({
            where: { postId: req.params.id },
            include:[db.user, db.post]
        })
        res.json(findComment)
    } catch (err) {
        console.warn(err)
    }
})

// POST /post
router.post('/:id/comments', async (req, res) => {
    try {
        const createComment = await db.comment.create({
            // userId will be hidden input
            userId: req.body.userId,
            postId: req.body.postId,
            content: req.body.content
        })
    } catch (err) {
        console.warn(err)
    }
})

// PUT /post
router.put('/:id/comments/:idx', async (req, res) => {
    try {
        const editComment = await db.comment.findByPk(req.params.idx)
        await editComment.update({
            content: req.body.content
        })
    } catch (err) {
        console.warn(err)
    }
})

// DELETE /post
router.delete('/:id/comments/:idx', async (req, res) => {
    try {
        const deleteComment = await db.comment.findByPk(req.params.idx)
        deleteComment.destroy()
    } catch (err) {
        console.warn(err)
    }
})

// GET /posts
router.get('/:id', async (req, res) => {
    try {
        const foundUser = await db.user.findOne({
            where: {id: req.params.id},
            include: [db.post]
        })

        res.json(foundUser)
    } catch (err) {
        console.warn(err)
    }
})


// POST /posts
router.post('/images', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ msg: 'no file uploaded!' })
    console.log(req.body)
    // const cloudImageData = await cloudinary.uploader.upload(req.file.path)
    // // console.log(cloudImageData)
    // const cloudinaryUrl = `https://res.cloudinary.com/dfmyqdv8d/image/upload/v1593119998/${cloudImageData.public_id}.png;`
    // unlinkSync(req.file.path)
    // try {
    //     const uploadPost = await db.post.create({
    //         image: cloudinaryUrl
    //     })
    // } catch (err) {
    //     console.log(err)
    // }
})

// DELETE /posts
router.delete('/:id', async (req, res) => {
    try {
        const deletePost = await db.post.findByPk(req.params.id)
        deletePost.destroy()
    } catch (err) {
        console.warm(err)
    }
})
module.exports = router