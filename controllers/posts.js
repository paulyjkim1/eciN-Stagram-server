const express = require('express')
const db = require('../models')
const router = express.Router()
const multer = require('multer')
const cors = require('cors')
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
router.post('/', upload.single('image'), async (req, res) => {
    console.log(req.body)
    const userId = req.body.userId
    const caption = req.body.caption
    console.log(`this is reqbody console.log ${userId}`)
    console.log(caption)
    // console.log(userId)
    // console.log(caption)
    try {
        const result = await cloudinary.uploader.upload(req.file.path)
        cloudinary.image(`${req.file.path}`)
        const imageUrl = result.secure_url

        const createPost = await db.post.create({
            userId: userId,
            caption: caption,
            image: imageUrl
        })
        res.json(createPost)
    } catch (err) {
        console.warn(err)
    }
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