const express = require('express')
const db = require('../models')
const router = express.Router()

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
router.get('/', async (req, res) => {
    try {
        const posts = await db.post.find({
            include: [db.user]
        })
        res.json(posts)
    } catch (err) {
        console.warn(err)
    }
})

// GET /posts
router.get('/:id', async (req, res) => {
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

// POST /posts
router.post('/', async (req, res) => {
    try {
        const createPost = await db.post.create({
            // depends on auth
            userId: req.body.userId,
            image: req.body.image,
            caption: req.body.caption
        })
        res.json(createPost)
    } catch (err) {
        console.warm(err)
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