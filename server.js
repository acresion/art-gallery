
import express from 'express';
import session from 'cookie-session';
const app = express();
app.set("views", "views");
app.use(express.static("views"));
app.set("view engine", "pug");
console.log("Beginning import");
import { MongoClient, ObjectId } from "mongodb";
console.log("Successfully imported mongodb");

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(uri);
client.on('error', function(err){
	console.log(err.message);
	throw new Error('Aborting execution');
});
console.log("Successfully connected to mongodb");
const database = client.db("gallery");
const galleryCollection = database.collection("artwork");
const accountInfo = database.collection("accounts");

// Create a new client and connect to MongoDB
// Database go brr. Get all the information from the get go.


// Use the session middleware
// There are additional options that are useful
// Check documentation for express-session module
app.use(session({
	secret: 'some secret here',
	//cookie: {maxAge:50000},  //the cookie will expire in 50 seconds
	resave: true,
	saveUninitialized: true
}));  // now we have req.session object

// app.use(function (req, res, next) {
// 	console.log(req.session);
// 	next();
// });

// some things:
// add a thing, send that to the database of


app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/admin", auth, admin); // we authorize first. If success then we show admin page 
app.post("/login", login);
app.get("/login", renderLogin);      // send POST request to /login route to login
app.get("/logout", logout);     // send GET request to /logout route to logout
app.get("/swapAccounts", swapAccounts)
app.post("/register", register);
app.get("/viewFollowing/:userId", viewFollowing);
async function  viewFollowing(req, res, next) {
	let id = req.params.userId;
	if(id.length != 24){
		res.status(406).send("Not a proper user ID");
	}
	else{
		const data1 = await  accountInfo.find({"_id":new ObjectId(req.params.userId)}).toArray();
		console.log(data1[0]);
		if(data1[0] == undefined){
			res.status(400).send("Can't find anyone  in database");
		}
		else{
			const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
			res.render("following", {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data2[0].notificationsCount});
		}
	}
	
}
// Essentially, we are calling itself again and again, just with updated page numbers, and thus, updated artwork
app.get("/findSearchResults", getSearchResults);
async function  getSearchResults(req, res, next) {
	let data1 = [];
	// I apologize for the YandereDev coding practice, but it had to be done.
	if(req.query.nameOfArtist == "" &&  req.query.title == "" &&  req.query.category == ""){
		data1 = await galleryCollection.find().toArray();
	}
	else if(req.query.nameOfArtist == "" &&  req.query.category == ""){
		data1 = await galleryCollection.find({"Title":req.query.title}).toArray();
	}
	else if(req.query.title == "" &&  req.query.category == ""){
		data1 = await galleryCollection.find({"Artist":req.query.nameOfArtist}).toArray();
	}
	else if(req.query.nameOfArtist == "" &&  req.query.title == ""){
		data1 = await galleryCollection.find({"Category":req.query.category}).toArray();
	}
	else if(req.query.title == ""){
		data1 = await galleryCollection.find({"Artist":req.query.nameOfArtist, "Category":req.query.category}).toArray();
	}
	else if(req.query.category == ""){
		data1 = await galleryCollection.find({"Artist":req.query.nameOfArtist, "Title":req.query.title}).toArray();
	}
	else if(req.query.nameOfArtist == ""){
		data1 = await galleryCollection.find({"Category":req.query.category, "Title":req.query.title}).toArray();
	}
	else{
		data1 = await galleryCollection.find({"Artist":req.query.nameOfArtist, "Category":req.query.category, "Title":req.query.title}).toArray();
	}
	const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	let totalPages = data1.length / 10 ;
	let pageValue = parseInt(req.query.page);
	let pageAdd = pageValue + 1;
	let pageSub = pageValue - 1;
	res.render("searchResults",  {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data2[0].notificationsCount, page : req.query.page, totalPage:totalPages, nameOfArtist : req.query.nameOfArtist, title:req.query.title, category:req.query.category,nextPage:pageAdd, prevPage:pageSub })
}
app.post("/findSearchResults", findSearchResults);
async function  findSearchResults(req, res, next) {
	let data1 = [];
	// I apologize for the YandereDev coding practice, but it had to be done.
	if(req.body.nameOfArtist == "" &&  req.body.title == "" &&  req.body.category == ""){
		data1 = await galleryCollection.find().toArray();
	}
	else if(req.body.nameOfArtist == "" &&  req.body.category == ""){
		data1 = await galleryCollection.find({"Title":req.body.title}).toArray();
	}
	else if(req.body.title == "" &&  req.body.category == ""){
		data1 = await galleryCollection.find({"Artist":req.body.nameOfArtist}).toArray();
	}
	else if(req.body.nameOfArtist == "" &&  req.body.title == ""){
		data1 = await galleryCollection.find({"Category":req.body.category}).toArray();
	}
	else if(req.body.title == ""){
		data1 = await galleryCollection.find({"Artist":req.body.nameOfArtist, "Category":req.body.category}).toArray();
	}
	else if(req.body.category == ""){
		data1 = await galleryCollection.find({"Artist":req.body.nameOfArtist, "Title":req.body.title}).toArray();
	}
	else if(req.body.nameOfArtist == ""){
		data1 = await galleryCollection.find({"Category":req.body.category, "Title":req.body.title}).toArray();
	}
	else{
		data1 = await galleryCollection.find({"Artist":req.body.nameOfArtist, "Category":req.body.category, "Title":req.body.title}).toArray();
	}
	const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	console.log(data1);
	let totalPages = data1.length / 10 ;
	let pageValue = parseInt(req.query.page);
	let pageAdd = pageValue + 1;
	let pageSub = pageValue - 1;
	res.render("searchResults",  {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data2[0].notificationsCount, page : req.query.page, totalPage:totalPages, nameOfArtist : req.body.nameOfArtist, title:req.body.title, category:req.body.category, nextPage:pageAdd, prevPage:pageSub })
}
// Here, we force it to call itself again and again.
app.get("/searchMedium/:medium", searchMedium);
async function  searchMedium(req, res, next) {
	const data1 = await galleryCollection.find({"Medium":req.params.medium}).toArray();
	const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	let pageValue = parseInt(req.query.page);
	let pageAdd = pageValue + 1;
	let pageSub = pageValue - 1;
	res.render("searchMedium",  {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data2[0].notificationsCount, page :  req.query.page, nextPage:pageAdd, prevPage:pageSub, medium:req.params.medium})
}
// Here, we force it to call itself again and again.
app.get("/searchCategory/:category", searchCategory);
async function  searchCategory(req, res, next) {
	const data1 = await galleryCollection.find({"Category":req.params.category}).toArray();
	const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	let pageValue = parseInt(req.query.page);
	let pageAdd = pageValue + 1;
	let pageSub = pageValue - 1;
	res.render("searchCategory",  {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data2[0].notificationsCount, page :  req.query.page, nextPage:pageAdd, prevPage:pageSub, category:req.params.category})
}


// Similar to viewFollowing.
app.get("/viewFollowers/:userId", viewFollowers);
async function  viewFollowers(req, res, next) {
	let id = req.params.userId;
	if(id.length != 24){
		res.status(406).send("Not a proper user ID");
	}
	else{
		const data1 = await  accountInfo.find({"_id":new ObjectId(req.params.userId)}).toArray();
		console.log(data1[0]);
		if(data1[0] == undefined){
			res.status(400).send("Can't find anyone  in database");
		}
		else{
			const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
			res.render("followers", {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin,notificationCount:data2[0].notificationsCount });
		}

	}
}
app.get("/artwork/:userId", renderArtwork);
async function  renderArtwork(req, res, next) {
	console.log(req.params);
	const data1 = await  galleryCollection.find({"Title":req.params.userId}).toArray();
	if(data1.length != 1){
		res.status(400).send("Can't find artwork.");
	}
	else{
		let name = data1[0].Artist;
		const data2 = await accountInfo.find({"username":name}).toArray();
		const data3 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
		console.log(data2);
		res.render("artProfile", {database:data1,accountId:data2, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin,notificationCount: data3[0].notificationsCount });
	}
	
}
app.put("/enroll/:title/:user", enroll);
async function  enroll(req, res, next) {
	//user who has workshop
	const data1 = await accountInfo.find({"_id":new ObjectId(req.params.user)}).toArray();
	//user that is enrolling
	const data2 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	let veri = false;
	for(let i in data1[0].workshops){
		if(data1[0].workshops[i].title == req.params.title){
			for(let j in data1[0].workshops[i].enrolled){
				if(data1[0].workshops[i].enrolled[j]._id  == req.session._id){
					veri = true;
				}
			}
		}
	}
	if(veri){
		res.status(400).send("Can't follow the account more than once");

	}
	else{
		await accountInfo.updateOne({"_id":new ObjectId(req.params.user), "workshops.title":req.params.title},{$push: {"workshops.$.enrolled":{ "_id":data2[0]._id,"name": data2[0].username}}}); 
    	data2[0].notificationsCount++;
		let notification = "You have signed up for " + data1[0].username + "'s workshop, " + req.params.title;
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$push: {"inbox":notification}}); 
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"notificationsCount":data2[0].notificationsCount}}); 
		res.status(200).send("Enroll success");
	}
	






}

app.post("/leaveReview/:id", listReview);
async function  listReview(req, res, next) {
	let reviewString = req.body.review;
	const data1 = await  galleryCollection.find({"_id":new ObjectId(req.params.id)}).toArray();
	const data2 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	if(data1[0] == undefined){
		res.status(400).send("Can't leave a review to something that does not exist")
	}
	else{
		await galleryCollection.updateOne({"_id":new ObjectId(req.params.id)},{$push: {"Reviews":{ "name":data2[0].username,"review": reviewString}}}); 
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$push: {"artWorkReviewed":{ "artWorkTitle":data1[0].Title,"review": reviewString}}}); 
		res.redirect('back');
	}

}


app.put("/followAccount/:userId", followAccount);
async function  followAccount(req, res, next) {
	let followedAccountId = req.params.userId;
	console.log(followedAccountId);
	// the following account
	const data1 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	// the followed account
	const data2 = await  accountInfo.find({"_id":new ObjectId(followedAccountId)}).toArray();
	// we have a check here first to ensure that you don't follow the same account more than once.
	console.log("Following account" + data1);
	console.log("Followed account: " + data2);
	let veri = false;
	for(let i in data1[0].following){
		if(data1[0].following[i].username == data2[0].username){
			veri = true;
		}
	}
	console.log(data1[0].following)
	if(veri){
		res.status(400).send("You can't follow this account more than once.")
	}
	else{
		console.log("All Clear.")
		data1[0].followingCount++;
		data2[0].followersCount++;
		await accountInfo.updateOne({"_id":new ObjectId(followedAccountId)},{$push: {"followers":{ "_id":data1[0]._id,"username": data1[0].username}}}); 
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$push: {"following":{ "_id":data2[0]._id,"username": data2[0].username}}});
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"followingCount":data1[0].followingCount}}); 
		await accountInfo.updateOne({"_id":new ObjectId(followedAccountId)},{$set: {"followersCount":data2[0].followersCount}}); 
		res.status(200).send();
	}
}
app.put("/likeImage/:userId", likeImage);
async function  likeImage(req, res, next) {
	let followedAccountId = req.params.userId;
	console.log(followedAccountId);
	// the  account who like this
 	const data1 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	// the artqork account
	const data2 = await  galleryCollection.find({"_id":new ObjectId(followedAccountId)}).toArray();
	// we have a check here first to ensure that you don't follow the same account more than once.
	console.log( data1);
	console.log( data2);
	let veri = false;
	for(let i in data1[0].artWorkLiked){
		if(data1[0].artWorkLiked[i].title == data2[0].Title){
			veri = true;
		}
	}
	if(veri){
		res.status(400).send("You can't like this image more than once.")
	}
	else{
		console.log("All Clear.")
		data2[0].Likes++;
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$push: {"artWorkLiked":{ "_id":data2[0]._id,"title": data2[0].Title}}}); 
		await galleryCollection.updateOne({"_id":new ObjectId(followedAccountId)},{$set: {"Likes":data2[0].Likes}}); 
		res.status(200).send();
	}
}
app.get("/viewLikedandReviewed", viewLikedAndReviewed);
async function  viewLikedAndReviewed(req, res, next) {
	const data1 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	res.render("artist",{database:data1[0], id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data1[0].notificationsCount});
}
app.get("/searchArtwork", searchArtwork);
async function  searchArtwork(req, res, next) {
	const data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	res.render("search",  {database:data1, id: req.session._id, accountType:req.session.accountType, admin:req.session.admin,notificationCount:data1[0].notificationsCount });
}
app.get("/profile/:id", renderProfile);
async function  renderProfile(req, res, next) {
	let id = req.params.id;
	if(id.length != 24){
		res.status(400).send("Faulty request");
	}
	else{
		const data1 =  await accountInfo.find({"_id":new ObjectId(id)}).toArray() ;
		const data2 =  await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray() ;
		if(data1[0] == undefined){
			res.status(404).send("We could not locate the profile");
		}
		else{
			console.log(data1);
			res.render("profile", {database:data1, id: req.session._id, userId: data1[0]._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data2[0].notificationsCount});
		}
	}
	
	
}

app.get("/addNewArt", async function(req, res, next) {
	let data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
    res.render("addNewArt",{id: req.session._id, accountType:req.session.accountType, admin:req.session.admin, notificationCount:data1[0].notificationsCount});
  });

app.post("/addNewArt", addArt);
async function  addArt(req, res, next) {
	let data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	let artistName = data1[0].username;
	let title = req.body.title;
	let category = req.body.category;
	let description = req.body.description
	let medium = req.body.medium
	let url = req.body.url;
	let year = req.body.year;
	const dataObject = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	if(dataObject[0].artMade.length <= 0){
		data1[0].accountType = "artist";
		req.session.accountType = "artist";
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"accountType":"artist"}});
	}
	// We need to do a check here to ensure that the title does not repeat.
	const galleryInfo = await galleryCollection.find({}).toArray();
	let veri = false;
	for(let i in galleryInfo){
		if(galleryInfo[i].Title ==  title){
			veri = true;
		}		
	}
	if(veri){
		res.status(406).send("Can't add an artwork, as it has a duplicate name.")
	}
	else{
		let addedObjecttoArtist = {"Title": title, "Artist":artistName, "Year":year, "Category":category, "Medium":medium, "Description":description, "Poster":url};
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$push: {"artMade":addedObjecttoArtist}}); 
		await galleryCollection.insertOne( {"Title": title, "Artist":artistName, "Year":year, "Category":category,"Medium":medium, "Description":description, "Poster":url, "Likes":0, "Reviews":[]});
		for(let i in data1[0].followers){
			const follower = await accountInfo.find({"_id":data1[0].followers[i]._id}).toArray();
			console.log(follower);
			follower[0].notificationsCount++;
			let notification = artistName + " has added a new artwork. "; 
			await accountInfo.updateOne({"_id":data1[0].followers[i]._id},{$push: {"inbox":notification}}); 
			await accountInfo.updateOne({"_id":data1[0].followers[i]._id},{$set: {"notificationsCount":follower[0].notificationsCount}}); 


		}
		res.redirect("/login");
	}
	
}
app.get("/inbox", inbox);
async function inbox(req, res, next){
	const data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	data1[0].notificationsCount  = 0;
	await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"notificationsCount":data1[0].notificationsCount}}); 
	res.status(200).render("notifications", {database: data1[0], name: data1[0].username, accountType: data1[0].accountType, admin: data1[0].admin, id: data1[0]._id , notificationCount:data1[0].notificationsCount});
}
app.delete("/unfollowAccount/:accountId", unfollowAccount);
async function  unfollowAccount(req, res, next) {
	let data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	console.log(data1);
	let data2 = await accountInfo.find({"_id":new ObjectId(req.params.accountId)}).toArray();
	data1[0].followingCount--;
	data2[0].followersCount--;
	await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$pull: {"following":{"_id": data2[0]._id, "username":data2[0].username}}}); 
	await accountInfo.updateOne({"_id":new ObjectId(req.params.accountId)},{$pull: {"followers":{"_id":data1[0]._id, "username":data1[0].username}}}); 
	await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"followingCount":data1[0].followingCount}}); 
	await accountInfo.updateOne({"_id":new ObjectId(req.params.accountId)},{$set: {"followersCount":data2[0].followersCount}}); 
	console.log("it worked");
	res.status(200).send("It worked");
}
app.delete("/removeLike/:title", removeLike);
async function  removeLike(req, res, next) {
	let title = req.params.title;
	// the  account who like this
 	const data1 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	// the artqork account
	const data2 = await  galleryCollection.find({"Title":title }).toArray();
	// we have a check here first to ensure that you don't follow the same account more than once.
	console.log( data1);
	console.log( data2);

	data2[0].Likes--;
	await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$pull:{"artWorkLiked": {"_id":new ObjectId(data2[0]._id), "title":data2[0].Title}}}); 
	await galleryCollection.updateOne({"Title":title},{$set: {"Likes":data2[0].Likes}}); 

	res.status(200).send("We did it");
}
app.delete("/removeReview/:title/:user", removeReview);
async function  removeReview(req, res, next) {
	// the  account who like this
 	const data1 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	const data2 = await galleryCollection.find({"Title":req.params.title}).toArray();
	if(data2.length != 1){
		res.status(400).send("Can't find the artwork in here");
	}
	else{
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$pull:{"artWorkReviewed": {"artWorkTitle":req.params.title, "review":req.params.user}}}); 
		await galleryCollection.updateOne({"Title":req.params.title},{$pull:{"Reviews": {"name":data1[0].username, "review":req.params.user}}}); 
		res.status(200).send("We did it");

	}
	


}
app.get("/viewEnrolled/:title/:user", viewEnrolled);
async function  viewEnrolled(req, res, next) {
	// the  account who like this
 	const data1 = await  accountInfo.find({"_id":new ObjectId(req.params.user)}).toArray();
	let count = 0;
	for(let i in data1[0].workshops){
		if( data1[0].workshops[i].title == req.params.title){
			break;
		}
		count+= 1;

	}
	const data2 = await  accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	res.status(200).render("workshop", {database: data1[0].workshops[count], accountType: data2[0].accountType, admin: data2[0].admin, id: data2[0]._id , notificationCount:data2[0].notificationsCount});

	


}
//authorization function
async function auth(req, res, next) {
	//check if there a loggedin property set for the session, and
	//if they have admin rights
	const data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	if (!req.session.loggedin || !data1[0].admin) {
		res.status(401).send("Unauthorized");
		return;
	}
	next();
}
async function renderLogin(req, res, next){
	const data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	res.status(200).render("login", {name: data1[0].username, accountType: data1[0].accountType, admin: data1[0].admin, id: data1[0]._id , notificationCount:data1[0].notificationsCount});
}

async function register(req, res, next){
	let username = req.body.username;
	let password = req.body.password;
	let newAccount = {"username":username, "password":password, "admin":"false", "accountType":"patron","followersCount":0,
	"followingCount":0,
	"notificationsCount":0,
	"following":[],
	"followers":[],
	"artWorkLiked":[],
	"artWorkReviewed":[],
	"artMade":[],
	"inbox":[],
	"workshops":[]};
	let verificationIfUnique = await accountInfo.find({"username":username}).toArray();
	if(verificationIfUnique.length != 0){
		res.status(401).send("Username is already taken");
	}
	else{
		await accountInfo.insertOne(newAccount);
		const data2 = await accountInfo.find({"username":username}).toArray();
		req.session.loggedin = true;
		req.session._id = data2[0]._id;
		req.session.username = username; //we keep track of what user this session belongs to'
		req.session.accountType = data2[0].accountType;
		req.session.admin = data2[0].admin;
		res.redirect("/login");

	}
	
}
async function swapAccounts(req, res, next) {
	console.log("swapping accountType");
	console.log(req.session._id);
	const data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	console.log(data1);
	let artMade = data1[0].artMade.length;
	if(artMade == 0){
		res.redirect("/addNewArt");
	}
	else{
		if(data1[0].accountType == "patron"){
			data1[0].accountType = "artist";
			req.session.accountType = "artist";
			await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"accountType":"artist"}});
		}
		else{
			data1[0].accountType = "patron";
			req.session.accountType = "patron";
			await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$set: {"accountType":"patron"}});
		}
		res.redirect("/login");
	}
	
 	
}
app.get("/", async function(req, res, next){
	const data1 = await galleryCollection.find({}).limit(5).toArray();
	console.log(data1);
	console.log("Welcome to the art gallery. Enjoy your time here");
	res.render("welcome", {database:data1});
})
app.get("/addWorkshop", async function(req, res, next){
	const data1 = 	await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	console.log(data1);
	res.render("workshops", {database:data1, accountType:req.session.accountType, admin:req.session.admin, id: req.session._id, notificationCount: data1[0].notificationsCount});
})
app.post("/addWorkshop", async function(req, res, next){
	let data1 = await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
	let newTitle = req.body.workshopTitle;
	let veri = false;
	for(let i in data1[0].workshops){
		if(data1[0].workshops[i].title == newTitle){
			veri = true;
		}
	}
	if(veri){
		res.status(406).send("The name for the workshop is unfortunately taken. Please try a different name or wait for this workshop to conclude")

	}
	else{
		let newAddedObject = { "title" : newTitle, "enrolled": []}
		await accountInfo.updateOne({"_id":new ObjectId(req.session._id)},{$push: {"workshops":newAddedObject}}); 
		for(let i in data1[0].followers){
			const follower = await accountInfo.find({"_id":data1[0].followers[i]._id}).toArray();
			console.log(follower);
			follower[0].notificationsCount++;
			let notification = data1[0].username + " has added a new workshop. "; 
			await accountInfo.updateOne({"_id":data1[0].followers[i]._id},{$push: {"inbox":notification}}); 
			await accountInfo.updateOne({"_id":data1[0].followers[i]._id},{$set: {"notificationsCount":follower[0].notificationsCount}}); 
		}
		res.redirect("/login");
	}
	})
app.get("/viewers", async function(req, res, next){
	const data1 = await accountInfo.find({}).toArray();
	res.render("viewers", {database:data1, accountType:req.session.accountType, admin:req.session.admin, id: req.session._id, notificationCount: req.session.notificationCount});
})
app.get("/loginScreen", (req, res, next) => {
    res.render("loginScreen");
  });
  app.get("/register", (req, res, next) => {
    res.render("register");
  });
function admin(req, res, next) {
	res.status(200).send("Welcome to the admin page, " + req.session.username);
	return;
}

//If the username and password match somebody in our database,
// then create a new session ID and save it in the database.
//That session ID will be associated with the requesting user.
async function login(req, res, next) {
	if (req.session.loggedin) {
		const data1= await accountInfo.find({"_id":new ObjectId(req.session._id)}).toArray();
		res.status(200).render("login", {name: req.session.username, accountType: req.session.accountType, admin:req.session.admin, id: req.session._id, notificationCount: data1[0].notificationsCount});
		return;
	}

	let username = req.body.username;
	let password = req.body.password;
	const data1 = await accountInfo.find({"username":username}).toArray();
	console.log(data1.length);


	console.log("Logging in with credentials:");
	console.log("Username: " + req.body.username);
	console.log("Password: " + req.body.password);

	//does the user exist?
	if (data1.length == 0) {
		res.status(401).send("Unauthorized. Please try again."); //you can also send 404 and specify "User not found"
		return;
	}
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
		req.session._id= data1[0]._id;
		console.log(req.session._id);
		res.status(200).render("login", {name: username, accountType: data1[0].accountType, admin:data1[0].admin, id:data1[0]._id, notificationCount: data1[0].notificationsCount});
	} else {
		res.status(401).send("Not authorized. Invalid password.");
	}
}

async function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		req.session.accountType = undefined;
		req.session.admin = undefined;
		res.redirect("/");
	} else {
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}

app.listen(3000);
console.log("Server listening on port 3000");
