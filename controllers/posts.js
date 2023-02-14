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
        const postDet = await db.post.findByPk(req.params.id)
        const findComment = await db.comment.findAll({
            where: { postId: req.params.id }
        })
        res.json(postDet)
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
        console.warm(err)
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
        console.warm(err)
    }
})

// DELETE /post
router.delete('/:id/comments/:idx', async (req, res) => {
    try {
        const deleteComment = await db.comment.findByPk(req.params.idx)
        deleteComment.destroy()
    } catch (err) {
        console.warm(err)
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
    const userId = req.body.userId
    const caption = req.body.caption

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
        console.warm(err)
    }
})
// --------
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Data.now() + '-' + file.originalname)
//     }
// })

// // // array to send multi file in the end
// const upload = multer({storage}).single('file')

// router.post('/', async (req, res) => {
//     upload( req, res, (err) => {
//         if (err) {
//             return res.status(500).json(err)
//         }
//         return res.status(200).send(req.files)
//     })
// })
// --------

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