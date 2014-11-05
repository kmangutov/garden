/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	'login': function(req, res) {
		res.locals.flash = _.clone(req.session.flash);
		res.view();
		req.session.flash = {};
	},

	'authenticate': function(req, res) {

		var email = req.body['email'];
		var password = req.body['password'];

		if(email == "admin" && password == "admin") {
			req.session.admin = true;
			req.session.loggedIn = true;
			req.session.email = "admin";
			res.send("admin");
			//return res.redirect('/main/home');
		}
		else {
			var foundUser = [];

			User.findByEmail(email).exec(function(err, usr) {
				if(err) {
					res.send(500, {error: "DB Error"});
				} else {
					foundUser = usr;

					if(usr.length > 0 && usr[0]["password"] == password) {
						sails.log("within: found");
						sails.log("user: " + JSON.stringify(usr));
						req.session.user = usr;

									req.session.admin = false;
									req.session.loggedIn = true;
									req.session.email = usr[0]["email"];

						res.send(usr);
						//res.view("/main/home");
					}
					else {
						sails.log("within: not found")

						req.session.admin = false;
						req.session.loggedIn = false;
						req.session.email = "";

						res.send(400, {error: "Account doesn't exist"});
						//res.view("/main/login");
					}
					/*sails.log("in findByEmail " + JSON.stringify(usr));
					if(usr.length > 0) {
						req.session.admin = false;
						req.session.loggedIn = true;
						req.session.email = email;	
						sails.log("exists!");
						return res.view('/main/home');
						//res.send('/main/home')
					} else {
						req.session.loggedIn = false;
						req.session.admin = false;
						req.session.email = undefined;
						sails.log("doesn't exist!");
						
						req.session.flash = {
							err: "Account doesn't exist"
						}

						return res.view('/main/login');
						//res.send(404, {error: 'User not found'});
					}*/
				}
			})
		}

		//return res.redirect('/main/home');
	},

	'home': function(req, res) {

		//if(req.session.loggedIn != true)
		//	return res.redirect('/');

		return res.view();
		//return res.view({email: req.session.email});
	}
};

