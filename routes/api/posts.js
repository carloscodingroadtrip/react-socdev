const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load models
const Post = require('../../models/Post');
//Bring Validation
const validatePostInput = require('../../validation/post');

//@route    GET api/posts/test
//@desc     Test post route
//@access   Public
router.get('/test', (req, res) => {
	res.json({
		msg: 'posts page',
	});
});

//@route    POST api/posts
//@desc     Create post
//@access   Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const { errors, isValid } = validatePostInput(req.body);

	//Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id,
	});

	newPost.save().then(post => res.json(post));
});

//@route    GET api/posts
//@desc     Get post
//@access   Public
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.status(200).json(posts))
		.catch(err => res.status(404).json({ nopostsfound: 'No posts were found' }));
});

//@route    GET api/posts/:id
//@desc     Get a single post by Id
//@access   Public
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.status(200).json(post))
		.catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

module.exports = router;
