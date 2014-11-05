/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'new': function(req, res) {

		res.locals.flash = _.clone(req.session.flash);
		res.view();
		req.session.flash = {};
	},

	'create': function(req, res) {
		User.create(req.body).exec(function(err, result){
			if(err) {
				//TODO handle error
				req.session.flash = {
					err: "Unable to create account!"
				}

				return res.redirect('/user/new');
			}

			res.redirect('/user/show/' + result.id);
			//return res.redirect('/');
		})
	},

	'show': function(req, res, next) {
		User.findOne(req.param('id'), function foundUser(err, user) {
			if(err) return next(err);
			if(!user) return next();
			res.view({
				user: user
			});
		})
	},

	'index': function(req, res) {
		User.find(function foundUsers(err, users) {
			if(err) sails.log("Err:" + err);
			res.view({users: users});
		})
	},

	'set': function(req, res) {

		var id = req.body['id'];
		var availableTimes = req.body['availableTimes'];

		sails.log("set called with id:" + id + ", availableTimes:" + availableTimes);

		User.findOne(id, function foundUser(err, user) {
			if(err) return res.send(400, {error: "Error encountered"});
			if(!user) return res.send(400, {error: "User not found"});
			
			sails.log("user/set user found");
			user.availableTimes = availableTimes;
			user.save(function(error){
				if(error) {
					res.send(400, {error: error});
				} else {
					sails.log("save successful");
					res.send(user);
				}
			})
		})
	}
};

