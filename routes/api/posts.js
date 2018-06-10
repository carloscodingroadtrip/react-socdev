const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
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

//@route    DELETE api/posts/:id
//@desc     DELETE post
//@access   Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					//check for post owner
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ noauthorized: 'User not authorized' });
					}

					//Delete the post
					post
						.remove()
						.then(() => res.status(200).json({ success: true }))
						.catch(err => res.status(404).json(err));
				})
				.catch(err => res.status(404).json(err));
		})
		.catch(err => res.status(404).json({ postnofound: 'No post found' }));
});

module.exports = router;
