"use strict";

var _express = _interopRequireDefault(require("express"));

var _cookieSession = _interopRequireDefault(require("cookie-session"));

var _mongodb = require("mongodb");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.set("views", "views");
app.use(_express["default"]["static"]("views"));
app.set("view engine", "pug");
console.log("Beginning import");
console.log("Successfully imported mongodb"); // Replace the uri string with your MongoDB deployment's connection string.

var uri = "mongodb://127.0.0.1:27017/";
var client = new _mongodb.MongoClient(uri);
client.on('error', function (err) {
  console.log(err.message);
  throw new Error('Aborting execution');
});
console.log("Successfully connected to mongodb");
var database = client.db("gallery");
var galleryCollection = database.collection("artwork");
var accountInfo = database.collection("accounts"); // Create a new client and connect to MongoDB
// Database go brr. Get all the information from the get go.
// Use the session middleware
// There are additional options that are useful
// Check documentation for express-session module

app.use((0, _cookieSession["default"])({
  secret: 'some secret here',
  //cookie: {maxAge:50000},  //the cookie will expire in 50 seconds
  resave: true,
  saveUninitialized: true
})); // now we have req.session object
// app.use(function (req, res, next) {
// 	console.log(req.session);
// 	next();
// });
// some things:
// add a thing, send that to the database of

app.use(_express["default"]["static"]("public"));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.get("/admin", auth, admin); // we authorize first. If success then we show admin page 

app.post("/login", login);
app.get("/login", renderLogin); // send POST request to /login route to login

app.get("/logout", logout); // send GET request to /logout route to logout

app.get("/swapAccounts", swapAccounts);
app.post("/register", register);
app.get("/viewFollowing/:userId", viewFollowing);

function viewFollowing(req, res, next) {
  var id, data1, data2;
  return regeneratorRuntime.async(function viewFollowing$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.params.userId;

          if (!(id.length != 24)) {
            _context.next = 5;
            break;
          }

          res.status(406).send("Not a proper user ID");
          _context.next = 17;
          break;

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.params.userId)
          }).toArray());

        case 7:
          data1 = _context.sent;
          console.log(data1[0]);

          if (!(data1[0] == undefined)) {
            _context.next = 13;
            break;
          }

          res.status(400).send("Can't find anyone  in database");
          _context.next = 17;
          break;

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 15:
          data2 = _context.sent;
          res.render("following", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data2[0].notificationsCount
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
} // Essentially, we are calling itself again and again, just with updated page numbers, and thus, updated artwork


app.get("/findSearchResults", getSearchResults);

function getSearchResults(req, res, next) {
  var data1, data2, totalPages, pageValue, pageAdd, pageSub;
  return regeneratorRuntime.async(function getSearchResults$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data1 = []; // I apologize for the YandereDev coding practice, but it had to be done.

          if (!(req.query.nameOfArtist == "" && req.query.title == "" && req.query.category == "")) {
            _context2.next = 7;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(galleryCollection.find().toArray());

        case 4:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 7:
          if (!(req.query.nameOfArtist == "" && req.query.category == "")) {
            _context2.next = 13;
            break;
          }

          _context2.next = 10;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Title": req.query.title
          }).toArray());

        case 10:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 13:
          if (!(req.query.title == "" && req.query.category == "")) {
            _context2.next = 19;
            break;
          }

          _context2.next = 16;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.query.nameOfArtist
          }).toArray());

        case 16:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 19:
          if (!(req.query.nameOfArtist == "" && req.query.title == "")) {
            _context2.next = 25;
            break;
          }

          _context2.next = 22;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Category": req.query.category
          }).toArray());

        case 22:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 25:
          if (!(req.query.title == "")) {
            _context2.next = 31;
            break;
          }

          _context2.next = 28;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.query.nameOfArtist,
            "Category": req.query.category
          }).toArray());

        case 28:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 31:
          if (!(req.query.category == "")) {
            _context2.next = 37;
            break;
          }

          _context2.next = 34;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.query.nameOfArtist,
            "Title": req.query.title
          }).toArray());

        case 34:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 37:
          if (!(req.query.nameOfArtist == "")) {
            _context2.next = 43;
            break;
          }

          _context2.next = 40;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Category": req.query.category,
            "Title": req.query.title
          }).toArray());

        case 40:
          data1 = _context2.sent;
          _context2.next = 46;
          break;

        case 43:
          _context2.next = 45;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.query.nameOfArtist,
            "Category": req.query.category,
            "Title": req.query.title
          }).toArray());

        case 45:
          data1 = _context2.sent;

        case 46:
          _context2.next = 48;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 48:
          data2 = _context2.sent;
          totalPages = data1.length / 10;
          pageValue = parseInt(req.query.page);
          pageAdd = pageValue + 1;
          pageSub = pageValue - 1;
          res.render("searchResults", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data2[0].notificationsCount,
            page: req.query.page,
            totalPage: totalPages,
            nameOfArtist: req.query.nameOfArtist,
            title: req.query.title,
            category: req.query.category,
            nextPage: pageAdd,
            prevPage: pageSub
          });

        case 54:
        case "end":
          return _context2.stop();
      }
    }
  });
}

app.post("/findSearchResults", findSearchResults);

function findSearchResults(req, res, next) {
  var data1, data2, totalPages, pageValue, pageAdd, pageSub;
  return regeneratorRuntime.async(function findSearchResults$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          data1 = []; // I apologize for the YandereDev coding practice, but it had to be done.

          if (!(req.body.nameOfArtist == "" && req.body.title == "" && req.body.category == "")) {
            _context3.next = 7;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(galleryCollection.find().toArray());

        case 4:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 7:
          if (!(req.body.nameOfArtist == "" && req.body.category == "")) {
            _context3.next = 13;
            break;
          }

          _context3.next = 10;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Title": req.body.title
          }).toArray());

        case 10:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 13:
          if (!(req.body.title == "" && req.body.category == "")) {
            _context3.next = 19;
            break;
          }

          _context3.next = 16;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.body.nameOfArtist
          }).toArray());

        case 16:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 19:
          if (!(req.body.nameOfArtist == "" && req.body.title == "")) {
            _context3.next = 25;
            break;
          }

          _context3.next = 22;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Category": req.body.category
          }).toArray());

        case 22:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 25:
          if (!(req.body.title == "")) {
            _context3.next = 31;
            break;
          }

          _context3.next = 28;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.body.nameOfArtist,
            "Category": req.body.category
          }).toArray());

        case 28:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 31:
          if (!(req.body.category == "")) {
            _context3.next = 37;
            break;
          }

          _context3.next = 34;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.body.nameOfArtist,
            "Title": req.body.title
          }).toArray());

        case 34:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 37:
          if (!(req.body.nameOfArtist == "")) {
            _context3.next = 43;
            break;
          }

          _context3.next = 40;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Category": req.body.category,
            "Title": req.body.title
          }).toArray());

        case 40:
          data1 = _context3.sent;
          _context3.next = 46;
          break;

        case 43:
          _context3.next = 45;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Artist": req.body.nameOfArtist,
            "Category": req.body.category,
            "Title": req.body.title
          }).toArray());

        case 45:
          data1 = _context3.sent;

        case 46:
          _context3.next = 48;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 48:
          data2 = _context3.sent;
          console.log(data1);
          totalPages = data1.length / 10;
          pageValue = parseInt(req.query.page);
          pageAdd = pageValue + 1;
          pageSub = pageValue - 1;
          res.render("searchResults", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data2[0].notificationsCount,
            page: req.query.page,
            totalPage: totalPages,
            nameOfArtist: req.body.nameOfArtist,
            title: req.body.title,
            category: req.body.category,
            nextPage: pageAdd,
            prevPage: pageSub
          });

        case 55:
        case "end":
          return _context3.stop();
      }
    }
  });
} // Here, we force it to call itself again and again.


app.get("/searchMedium/:medium", searchMedium);

function searchMedium(req, res, next) {
  var data1, data2, pageValue, pageAdd, pageSub;
  return regeneratorRuntime.async(function searchMedium$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Medium": req.params.medium
          }).toArray());

        case 2:
          data1 = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 5:
          data2 = _context4.sent;
          pageValue = parseInt(req.query.page);
          pageAdd = pageValue + 1;
          pageSub = pageValue - 1;
          res.render("searchMedium", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data2[0].notificationsCount,
            page: req.query.page,
            nextPage: pageAdd,
            prevPage: pageSub,
            medium: req.params.medium
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
} // Here, we force it to call itself again and again.


app.get("/searchCategory/:category", searchCategory);

function searchCategory(req, res, next) {
  var data1, data2, pageValue, pageAdd, pageSub;
  return regeneratorRuntime.async(function searchCategory$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Category": req.params.category
          }).toArray());

        case 2:
          data1 = _context5.sent;
          _context5.next = 5;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 5:
          data2 = _context5.sent;
          pageValue = parseInt(req.query.page);
          pageAdd = pageValue + 1;
          pageSub = pageValue - 1;
          res.render("searchCategory", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data2[0].notificationsCount,
            page: req.query.page,
            nextPage: pageAdd,
            prevPage: pageSub,
            category: req.params.category
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  });
} // Similar to viewFollowing.


app.get("/viewFollowers/:userId", viewFollowers);

function viewFollowers(req, res, next) {
  var id, data1, data2;
  return regeneratorRuntime.async(function viewFollowers$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.params.userId;

          if (!(id.length != 24)) {
            _context6.next = 5;
            break;
          }

          res.status(406).send("Not a proper user ID");
          _context6.next = 17;
          break;

        case 5:
          _context6.next = 7;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.params.userId)
          }).toArray());

        case 7:
          data1 = _context6.sent;
          console.log(data1[0]);

          if (!(data1[0] == undefined)) {
            _context6.next = 13;
            break;
          }

          res.status(400).send("Can't find anyone  in database");
          _context6.next = 17;
          break;

        case 13:
          _context6.next = 15;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 15:
          data2 = _context6.sent;
          res.render("followers", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data2[0].notificationsCount
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  });
}

app.get("/artwork/:userId", renderArtwork);

function renderArtwork(req, res, next) {
  var data1, name, data2, data3;
  return regeneratorRuntime.async(function renderArtwork$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          console.log(req.params);
          _context7.next = 3;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Title": req.params.userId
          }).toArray());

        case 3:
          data1 = _context7.sent;

          if (!(data1.length != 1)) {
            _context7.next = 8;
            break;
          }

          res.status(400).send("Can't find artwork.");
          _context7.next = 17;
          break;

        case 8:
          name = data1[0].Artist;
          _context7.next = 11;
          return regeneratorRuntime.awrap(accountInfo.find({
            "username": name
          }).toArray());

        case 11:
          data2 = _context7.sent;
          _context7.next = 14;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 14:
          data3 = _context7.sent;
          console.log(data2);
          res.render("artProfile", {
            database: data1,
            accountId: data2,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data3[0].notificationsCount
          });

        case 17:
        case "end":
          return _context7.stop();
      }
    }
  });
}

app.put("/enroll/:title/:user", enroll);

function enroll(req, res, next) {
  var data1, data2, veri, i, j, notification;
  return regeneratorRuntime.async(function enroll$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.params.user)
          }).toArray());

        case 2:
          data1 = _context8.sent;
          _context8.next = 5;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 5:
          data2 = _context8.sent;
          veri = false;

          for (i in data1[0].workshops) {
            if (data1[0].workshops[i].title == req.params.title) {
              for (j in data1[0].workshops[i].enrolled) {
                if (data1[0].workshops[i].enrolled[j]._id == req.session._id) {
                  veri = true;
                }
              }
            }
          }

          if (!veri) {
            _context8.next = 12;
            break;
          }

          res.status(400).send("Can't follow the account more than once");
          _context8.next = 21;
          break;

        case 12:
          _context8.next = 14;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.params.user),
            "workshops.title": req.params.title
          }, {
            $push: {
              "workshops.$.enrolled": {
                "_id": data2[0]._id,
                "name": data2[0].username
              }
            }
          }));

        case 14:
          data2[0].notificationsCount++;
          notification = "You have signed up for " + data1[0].username + "'s workshop, " + req.params.title;
          _context8.next = 18;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $push: {
              "inbox": notification
            }
          }));

        case 18:
          _context8.next = 20;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "notificationsCount": data2[0].notificationsCount
            }
          }));

        case 20:
          res.status(200).send("Enroll success");

        case 21:
        case "end":
          return _context8.stop();
      }
    }
  });
}

app.post("/leaveReview/:id", listReview);

function listReview(req, res, next) {
  var reviewString, data1, data2;
  return regeneratorRuntime.async(function listReview$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          reviewString = req.body.review;
          _context9.next = 3;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "_id": new _mongodb.ObjectId(req.params.id)
          }).toArray());

        case 3:
          data1 = _context9.sent;
          _context9.next = 6;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 6:
          data2 = _context9.sent;

          if (!(data1[0] == undefined)) {
            _context9.next = 11;
            break;
          }

          res.status(400).send("Can't leave a review to something that does not exist");
          _context9.next = 16;
          break;

        case 11:
          _context9.next = 13;
          return regeneratorRuntime.awrap(galleryCollection.updateOne({
            "_id": new _mongodb.ObjectId(req.params.id)
          }, {
            $push: {
              "Reviews": {
                "name": data2[0].username,
                "review": reviewString
              }
            }
          }));

        case 13:
          _context9.next = 15;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $push: {
              "artWorkReviewed": {
                "artWorkTitle": data1[0].Title,
                "review": reviewString
              }
            }
          }));

        case 15:
          res.redirect('back');

        case 16:
        case "end":
          return _context9.stop();
      }
    }
  });
}

app.put("/followAccount/:userId", followAccount);

function followAccount(req, res, next) {
  var followedAccountId, data1, data2, veri, i;
  return regeneratorRuntime.async(function followAccount$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          followedAccountId = req.params.userId;
          console.log(followedAccountId); // the following account

          _context10.next = 4;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 4:
          data1 = _context10.sent;
          _context10.next = 7;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(followedAccountId)
          }).toArray());

        case 7:
          data2 = _context10.sent;
          // we have a check here first to ensure that you don't follow the same account more than once.
          console.log("Following account" + data1);
          console.log("Followed account: " + data2);
          veri = false;

          for (i in data1[0].following) {
            if (data1[0].following[i].username == data2[0].username) {
              veri = true;
            }
          }

          console.log(data1[0].following);

          if (!veri) {
            _context10.next = 17;
            break;
          }

          res.status(400).send("You can't follow this account more than once.");
          _context10.next = 29;
          break;

        case 17:
          console.log("All Clear.");
          data1[0].followingCount++;
          data2[0].followersCount++;
          _context10.next = 22;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(followedAccountId)
          }, {
            $push: {
              "followers": {
                "_id": data1[0]._id,
                "username": data1[0].username
              }
            }
          }));

        case 22:
          _context10.next = 24;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $push: {
              "following": {
                "_id": data2[0]._id,
                "username": data2[0].username
              }
            }
          }));

        case 24:
          _context10.next = 26;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "followingCount": data1[0].followingCount
            }
          }));

        case 26:
          _context10.next = 28;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(followedAccountId)
          }, {
            $set: {
              "followersCount": data2[0].followersCount
            }
          }));

        case 28:
          res.status(200).send();

        case 29:
        case "end":
          return _context10.stop();
      }
    }
  });
}

app.put("/likeImage/:userId", likeImage);

function likeImage(req, res, next) {
  var followedAccountId, data1, data2, veri, i;
  return regeneratorRuntime.async(function likeImage$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          followedAccountId = req.params.userId;
          console.log(followedAccountId); // the  account who like this

          _context11.next = 4;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 4:
          data1 = _context11.sent;
          _context11.next = 7;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "_id": new _mongodb.ObjectId(followedAccountId)
          }).toArray());

        case 7:
          data2 = _context11.sent;
          // we have a check here first to ensure that you don't follow the same account more than once.
          console.log(data1);
          console.log(data2);
          veri = false;

          for (i in data1[0].artWorkLiked) {
            if (data1[0].artWorkLiked[i].title == data2[0].Title) {
              veri = true;
            }
          }

          if (!veri) {
            _context11.next = 16;
            break;
          }

          res.status(400).send("You can't like this image more than once.");
          _context11.next = 23;
          break;

        case 16:
          console.log("All Clear.");
          data2[0].Likes++;
          _context11.next = 20;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $push: {
              "artWorkLiked": {
                "_id": data2[0]._id,
                "title": data2[0].Title
              }
            }
          }));

        case 20:
          _context11.next = 22;
          return regeneratorRuntime.awrap(galleryCollection.updateOne({
            "_id": new _mongodb.ObjectId(followedAccountId)
          }, {
            $set: {
              "Likes": data2[0].Likes
            }
          }));

        case 22:
          res.status(200).send();

        case 23:
        case "end":
          return _context11.stop();
      }
    }
  });
}

app.get("/viewLikedandReviewed", viewLikedAndReviewed);

function viewLikedAndReviewed(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function viewLikedAndReviewed$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context12.sent;
          res.render("artist", {
            database: data1[0],
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data1[0].notificationsCount
          });

        case 4:
        case "end":
          return _context12.stop();
      }
    }
  });
}

app.get("/searchArtwork", searchArtwork);

function searchArtwork(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function searchArtwork$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context13.sent;
          res.render("search", {
            database: data1,
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data1[0].notificationsCount
          });

        case 4:
        case "end":
          return _context13.stop();
      }
    }
  });
}

app.get("/profile/:id", renderProfile);

function renderProfile(req, res, next) {
  var id, data1, data2;
  return regeneratorRuntime.async(function renderProfile$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          id = req.params.id;

          if (!(id.length != 24)) {
            _context14.next = 5;
            break;
          }

          res.status(400).send("Faulty request");
          _context14.next = 12;
          break;

        case 5:
          _context14.next = 7;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(id)
          }).toArray());

        case 7:
          data1 = _context14.sent;
          _context14.next = 10;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 10:
          data2 = _context14.sent;

          if (data1[0] == undefined) {
            res.status(404).send("We could not locate the profile");
          } else {
            console.log(data1);
            res.render("profile", {
              database: data1,
              id: req.session._id,
              userId: data1[0]._id,
              accountType: req.session.accountType,
              admin: req.session.admin,
              notificationCount: data2[0].notificationsCount
            });
          }

        case 12:
        case "end":
          return _context14.stop();
      }
    }
  });
}

app.get("/addNewArt", function _callee(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function _callee$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context15.sent;
          res.render("addNewArt", {
            id: req.session._id,
            accountType: req.session.accountType,
            admin: req.session.admin,
            notificationCount: data1[0].notificationsCount
          });

        case 4:
        case "end":
          return _context15.stop();
      }
    }
  });
});
app.post("/addNewArt", addArt);

function addArt(req, res, next) {
  var data1, artistName, title, category, description, medium, url, year, dataObject, galleryInfo, veri, i, addedObjecttoArtist, _i, follower, notification;

  return regeneratorRuntime.async(function addArt$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context16.sent;
          artistName = data1[0].username;
          title = req.body.title;
          category = req.body.category;
          description = req.body.description;
          medium = req.body.medium;
          url = req.body.url;
          year = req.body.year;
          _context16.next = 12;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 12:
          dataObject = _context16.sent;

          if (!(dataObject[0].artMade.length <= 0)) {
            _context16.next = 18;
            break;
          }

          data1[0].accountType = "artist";
          req.session.accountType = "artist";
          _context16.next = 18;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "accountType": "artist"
            }
          }));

        case 18:
          _context16.next = 20;
          return regeneratorRuntime.awrap(galleryCollection.find({}).toArray());

        case 20:
          galleryInfo = _context16.sent;
          veri = false;

          for (i in galleryInfo) {
            if (galleryInfo[i].Title == title) {
              veri = true;
            }
          }

          if (!veri) {
            _context16.next = 27;
            break;
          }

          res.status(406).send("Can't add an artwork, as it has a duplicate name.");
          _context16.next = 48;
          break;

        case 27:
          addedObjecttoArtist = {
            "Title": title,
            "Artist": artistName,
            "Year": year,
            "Category": category,
            "Medium": medium,
            "Description": description,
            "Poster": url
          };
          _context16.next = 30;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $push: {
              "artMade": addedObjecttoArtist
            }
          }));

        case 30:
          _context16.next = 32;
          return regeneratorRuntime.awrap(galleryCollection.insertOne({
            "Title": title,
            "Artist": artistName,
            "Year": year,
            "Category": category,
            "Medium": medium,
            "Description": description,
            "Poster": url,
            "Likes": 0,
            "Reviews": []
          }));

        case 32:
          _context16.t0 = regeneratorRuntime.keys(data1[0].followers);

        case 33:
          if ((_context16.t1 = _context16.t0()).done) {
            _context16.next = 47;
            break;
          }

          _i = _context16.t1.value;
          _context16.next = 37;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": data1[0].followers[_i]._id
          }).toArray());

        case 37:
          follower = _context16.sent;
          console.log(follower);
          follower[0].notificationsCount++;
          notification = artistName + " has added a new artwork. ";
          _context16.next = 43;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": data1[0].followers[_i]._id
          }, {
            $push: {
              "inbox": notification
            }
          }));

        case 43:
          _context16.next = 45;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": data1[0].followers[_i]._id
          }, {
            $set: {
              "notificationsCount": follower[0].notificationsCount
            }
          }));

        case 45:
          _context16.next = 33;
          break;

        case 47:
          res.redirect("/login");

        case 48:
        case "end":
          return _context16.stop();
      }
    }
  });
}

app.get("/inbox", inbox);

function inbox(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function inbox$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context17.sent;
          data1[0].notificationsCount = 0;
          _context17.next = 6;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "notificationsCount": data1[0].notificationsCount
            }
          }));

        case 6:
          res.status(200).render("notifications", {
            database: data1[0],
            name: data1[0].username,
            accountType: data1[0].accountType,
            admin: data1[0].admin,
            id: data1[0]._id,
            notificationCount: data1[0].notificationsCount
          });

        case 7:
        case "end":
          return _context17.stop();
      }
    }
  });
}

app["delete"]("/unfollowAccount/:accountId", unfollowAccount);

function unfollowAccount(req, res, next) {
  var data1, data2;
  return regeneratorRuntime.async(function unfollowAccount$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context18.sent;
          console.log(data1);
          _context18.next = 6;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.params.accountId)
          }).toArray());

        case 6:
          data2 = _context18.sent;
          data1[0].followingCount--;
          data2[0].followersCount--;
          _context18.next = 11;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $pull: {
              "following": {
                "_id": data2[0]._id,
                "username": data2[0].username
              }
            }
          }));

        case 11:
          _context18.next = 13;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.params.accountId)
          }, {
            $pull: {
              "followers": {
                "_id": data1[0]._id,
                "username": data1[0].username
              }
            }
          }));

        case 13:
          _context18.next = 15;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "followingCount": data1[0].followingCount
            }
          }));

        case 15:
          _context18.next = 17;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.params.accountId)
          }, {
            $set: {
              "followersCount": data2[0].followersCount
            }
          }));

        case 17:
          console.log("it worked");
          res.status(200).send("It worked");

        case 19:
        case "end":
          return _context18.stop();
      }
    }
  });
}

app["delete"]("/removeLike/:title", removeLike);

function removeLike(req, res, next) {
  var title, data1, data2;
  return regeneratorRuntime.async(function removeLike$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          title = req.params.title; // the  account who like this

          _context19.next = 3;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 3:
          data1 = _context19.sent;
          _context19.next = 6;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Title": title
          }).toArray());

        case 6:
          data2 = _context19.sent;
          // we have a check here first to ensure that you don't follow the same account more than once.
          console.log(data1);
          console.log(data2);
          data2[0].Likes--;
          _context19.next = 12;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $pull: {
              "artWorkLiked": {
                "_id": new _mongodb.ObjectId(data2[0]._id),
                "title": data2[0].Title
              }
            }
          }));

        case 12:
          _context19.next = 14;
          return regeneratorRuntime.awrap(galleryCollection.updateOne({
            "Title": title
          }, {
            $set: {
              "Likes": data2[0].Likes
            }
          }));

        case 14:
          res.status(200).send("We did it");

        case 15:
        case "end":
          return _context19.stop();
      }
    }
  });
}

app["delete"]("/removeReview/:title/:user", removeReview);

function removeReview(req, res, next) {
  var data1, data2;
  return regeneratorRuntime.async(function removeReview$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context20.sent;
          _context20.next = 5;
          return regeneratorRuntime.awrap(galleryCollection.find({
            "Title": req.params.title
          }).toArray());

        case 5:
          data2 = _context20.sent;

          if (!(data2.length != 1)) {
            _context20.next = 10;
            break;
          }

          res.status(400).send("Can't find the artwork in here");
          _context20.next = 15;
          break;

        case 10:
          _context20.next = 12;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $pull: {
              "artWorkReviewed": {
                "artWorkTitle": req.params.title,
                "review": req.params.user
              }
            }
          }));

        case 12:
          _context20.next = 14;
          return regeneratorRuntime.awrap(galleryCollection.updateOne({
            "Title": req.params.title
          }, {
            $pull: {
              "Reviews": {
                "name": data1[0].username,
                "review": req.params.user
              }
            }
          }));

        case 14:
          res.status(200).send("We did it");

        case 15:
        case "end":
          return _context20.stop();
      }
    }
  });
}

app.get("/viewEnrolled/:title/:user", viewEnrolled);

function viewEnrolled(req, res, next) {
  var data1, count, i, data2;
  return regeneratorRuntime.async(function viewEnrolled$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.params.user)
          }).toArray());

        case 2:
          data1 = _context21.sent;
          count = 0;
          _context21.t0 = regeneratorRuntime.keys(data1[0].workshops);

        case 5:
          if ((_context21.t1 = _context21.t0()).done) {
            _context21.next = 12;
            break;
          }

          i = _context21.t1.value;

          if (!(data1[0].workshops[i].title == req.params.title)) {
            _context21.next = 9;
            break;
          }

          return _context21.abrupt("break", 12);

        case 9:
          count += 1;
          _context21.next = 5;
          break;

        case 12:
          _context21.next = 14;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 14:
          data2 = _context21.sent;
          res.status(200).render("workshop", {
            database: data1[0].workshops[count],
            accountType: data2[0].accountType,
            admin: data2[0].admin,
            id: data2[0]._id,
            notificationCount: data2[0].notificationsCount
          });

        case 16:
        case "end":
          return _context21.stop();
      }
    }
  });
} //authorization function


function auth(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function auth$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context22.sent;

          if (!(!req.session.loggedin || !data1[0].admin)) {
            _context22.next = 6;
            break;
          }

          res.status(401).send("Unauthorized");
          return _context22.abrupt("return");

        case 6:
          next();

        case 7:
        case "end":
          return _context22.stop();
      }
    }
  });
}

function renderLogin(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function renderLogin$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context23.sent;
          res.status(200).render("login", {
            name: data1[0].username,
            accountType: data1[0].accountType,
            admin: data1[0].admin,
            id: data1[0]._id,
            notificationCount: data1[0].notificationsCount
          });

        case 4:
        case "end":
          return _context23.stop();
      }
    }
  });
}

function register(req, res, next) {
  var username, password, newAccount, verificationIfUnique, data2;
  return regeneratorRuntime.async(function register$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          username = req.body.username;
          password = req.body.password;
          newAccount = {
            "username": username,
            "password": password,
            "admin": "false",
            "accountType": "patron",
            "followersCount": 0,
            "followingCount": 0,
            "notificationsCount": 0,
            "following": [],
            "followers": [],
            "artWorkLiked": [],
            "artWorkReviewed": [],
            "artMade": [],
            "inbox": [],
            "workshops": []
          };
          _context24.next = 5;
          return regeneratorRuntime.awrap(accountInfo.find({
            "username": username
          }).toArray());

        case 5:
          verificationIfUnique = _context24.sent;

          if (!(verificationIfUnique.length != 0)) {
            _context24.next = 10;
            break;
          }

          res.status(401).send("Username is already taken");
          _context24.next = 21;
          break;

        case 10:
          _context24.next = 12;
          return regeneratorRuntime.awrap(accountInfo.insertOne(newAccount));

        case 12:
          _context24.next = 14;
          return regeneratorRuntime.awrap(accountInfo.find({
            "username": username
          }).toArray());

        case 14:
          data2 = _context24.sent;
          req.session.loggedin = true;
          req.session._id = data2[0]._id;
          req.session.username = username; //we keep track of what user this session belongs to'

          req.session.accountType = data2[0].accountType;
          req.session.admin = data2[0].admin;
          res.redirect("/login");

        case 21:
        case "end":
          return _context24.stop();
      }
    }
  });
}

function swapAccounts(req, res, next) {
  var data1, artMade;
  return regeneratorRuntime.async(function swapAccounts$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          console.log("swapping accountType");
          console.log(req.session._id);
          _context25.next = 4;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 4:
          data1 = _context25.sent;
          console.log(data1);
          artMade = data1[0].artMade.length;

          if (!(artMade == 0)) {
            _context25.next = 11;
            break;
          }

          res.redirect("/addNewArt");
          _context25.next = 23;
          break;

        case 11:
          if (!(data1[0].accountType == "patron")) {
            _context25.next = 18;
            break;
          }

          data1[0].accountType = "artist";
          req.session.accountType = "artist";
          _context25.next = 16;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "accountType": "artist"
            }
          }));

        case 16:
          _context25.next = 22;
          break;

        case 18:
          data1[0].accountType = "patron";
          req.session.accountType = "patron";
          _context25.next = 22;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $set: {
              "accountType": "patron"
            }
          }));

        case 22:
          res.redirect("/login");

        case 23:
        case "end":
          return _context25.stop();
      }
    }
  });
}

app.get("/", function _callee2(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function _callee2$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          _context26.next = 2;
          return regeneratorRuntime.awrap(galleryCollection.find({}).limit(5).toArray());

        case 2:
          data1 = _context26.sent;
          console.log(data1);
          console.log("Welcome to the art gallery. Enjoy your time here");
          res.render("welcome", {
            database: data1
          });

        case 6:
        case "end":
          return _context26.stop();
      }
    }
  });
});
app.get("/addWorkshop", function _callee3(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function _callee3$(_context27) {
    while (1) {
      switch (_context27.prev = _context27.next) {
        case 0:
          _context27.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context27.sent;
          console.log(data1);
          res.render("workshops", {
            database: data1,
            accountType: req.session.accountType,
            admin: req.session.admin,
            id: req.session._id,
            notificationCount: data1[0].notificationsCount
          });

        case 5:
        case "end":
          return _context27.stop();
      }
    }
  });
});
app.post("/addWorkshop", function _callee4(req, res, next) {
  var data1, newTitle, veri, i, newAddedObject, _i2, follower, notification;

  return regeneratorRuntime.async(function _callee4$(_context28) {
    while (1) {
      switch (_context28.prev = _context28.next) {
        case 0:
          _context28.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 2:
          data1 = _context28.sent;
          newTitle = req.body.workshopTitle;
          veri = false;

          for (i in data1[0].workshops) {
            if (data1[0].workshops[i].title == newTitle) {
              veri = true;
            }
          }

          if (!veri) {
            _context28.next = 10;
            break;
          }

          res.status(406).send("The name for the workshop is unfortunately taken. Please try a different name or wait for this workshop to conclude");
          _context28.next = 29;
          break;

        case 10:
          newAddedObject = {
            "title": newTitle,
            "enrolled": []
          };
          _context28.next = 13;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": new _mongodb.ObjectId(req.session._id)
          }, {
            $push: {
              "workshops": newAddedObject
            }
          }));

        case 13:
          _context28.t0 = regeneratorRuntime.keys(data1[0].followers);

        case 14:
          if ((_context28.t1 = _context28.t0()).done) {
            _context28.next = 28;
            break;
          }

          _i2 = _context28.t1.value;
          _context28.next = 18;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": data1[0].followers[_i2]._id
          }).toArray());

        case 18:
          follower = _context28.sent;
          console.log(follower);
          follower[0].notificationsCount++;
          notification = data1[0].username + " has added a new workshop. ";
          _context28.next = 24;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": data1[0].followers[_i2]._id
          }, {
            $push: {
              "inbox": notification
            }
          }));

        case 24:
          _context28.next = 26;
          return regeneratorRuntime.awrap(accountInfo.updateOne({
            "_id": data1[0].followers[_i2]._id
          }, {
            $set: {
              "notificationsCount": follower[0].notificationsCount
            }
          }));

        case 26:
          _context28.next = 14;
          break;

        case 28:
          res.redirect("/login");

        case 29:
        case "end":
          return _context28.stop();
      }
    }
  });
});
app.get("/viewers", function _callee5(req, res, next) {
  var data1;
  return regeneratorRuntime.async(function _callee5$(_context29) {
    while (1) {
      switch (_context29.prev = _context29.next) {
        case 0:
          _context29.next = 2;
          return regeneratorRuntime.awrap(accountInfo.find({}).toArray());

        case 2:
          data1 = _context29.sent;
          res.render("viewers", {
            database: data1,
            accountType: req.session.accountType,
            admin: req.session.admin,
            id: req.session._id,
            notificationCount: req.session.notificationCount
          });

        case 4:
        case "end":
          return _context29.stop();
      }
    }
  });
});
app.get("/loginScreen", function (req, res, next) {
  res.render("loginScreen");
});
app.get("/register", function (req, res, next) {
  res.render("register");
});

function admin(req, res, next) {
  res.status(200).send("Welcome to the admin page, " + req.session.username);
  return;
} //If the username and password match somebody in our database,
// then create a new session ID and save it in the database.
//That session ID will be associated with the requesting user.


function login(req, res, next) {
  var _data, username, password, data1;

  return regeneratorRuntime.async(function login$(_context30) {
    while (1) {
      switch (_context30.prev = _context30.next) {
        case 0:
          if (!req.session.loggedin) {
            _context30.next = 6;
            break;
          }

          _context30.next = 3;
          return regeneratorRuntime.awrap(accountInfo.find({
            "_id": new _mongodb.ObjectId(req.session._id)
          }).toArray());

        case 3:
          _data = _context30.sent;
          res.status(200).render("login", {
            name: req.session.username,
            accountType: req.session.accountType,
            admin: req.session.admin,
            id: req.session._id,
            notificationCount: _data[0].notificationsCount
          });
          return _context30.abrupt("return");

        case 6:
          username = req.body.username;
          password = req.body.password;
          _context30.next = 10;
          return regeneratorRuntime.awrap(accountInfo.find({
            "username": username
          }).toArray());

        case 10:
          data1 = _context30.sent;
          console.log(data1.length);
          console.log("Logging in with credentials:");
          console.log("Username: " + req.body.username);
          console.log("Password: " + req.body.password); //does the user exist?

          if (!(data1.length == 0)) {
            _context30.next = 18;
            break;
          }

          res.status(401).send("Unauthorized. Please try again."); //you can also send 404 and specify "User not found"

          return _context30.abrupt("return");

        case 18:
          //the user exists. Lets authenticate them
          if (data1[0].password === req.body.password) {
            req.session.loggedin = true; // now that particular user session has loggedin value, and it is set to true 
            //We set the username associated with this session
            //On future requests, we KNOW who the user is
            //We can look up their information specifically
            //We can authorize based on who they are

            req.session.username = username; //we keep track of what user this session belongs to'

            req.session.accountType = data1[0].accountType;
            req.session.admin = data1[0].admin;
            req.session._id = data1[0]._id;
            console.log(req.session._id);
            res.status(200).render("login", {
              name: username,
              accountType: data1[0].accountType,
              admin: data1[0].admin,
              id: data1[0]._id,
              notificationCount: data1[0].notificationsCount
            });
          } else {
            res.status(401).send("Not authorized. Invalid password.");
          }

        case 19:
        case "end":
          return _context30.stop();
      }
    }
  });
}

function logout(req, res, next) {
  return regeneratorRuntime.async(function logout$(_context31) {
    while (1) {
      switch (_context31.prev = _context31.next) {
        case 0:
          if (req.session.loggedin) {
            req.session.loggedin = false;
            req.session.username = undefined;
            req.session.accountType = undefined;
            req.session.admin = undefined;
            res.redirect("/");
          } else {
            res.status(200).send("You cannot log out because you aren't logged in.");
          }

        case 1:
        case "end":
          return _context31.stop();
      }
    }
  });
}

app.listen(3000);
console.log("Server listening on port 3000");