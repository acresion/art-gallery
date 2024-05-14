function sendFollower(userId){
    let xtthp = new XMLHttpRequest();
    console.log("We are not sure what the server is on");
    xtthp.onreadystatechange = function() { // onreadystatechange is an event 
		//We will update the view (webpage) when the server has responded successfully and the response from the server is OK (200)
			if (this.readyState == 4 && this.status == 200) {
                alert("You have successfully followed this account");
                window.location.reload();
            }
    }
    xtthp.open("PUT", `/followAccount/${userId}`);
    xtthp.send();
}
function addLike(userId){
    let xtthp = new XMLHttpRequest();
    console.log("We are not sure what the server is on");
    xtthp.onreadystatechange = function() { // onreadystatechange is an event 
		//We will update the view (webpage) when the server has responded successfully and the response from the server is OK (200)
			if (this.readyState == 4 && this.status == 200) {
                alert("You have successfully liked this image");
                window.location.reload();
            }
    }
    xtthp.open("PUT", `/likeImage/${userId}`);
    xtthp.send();
}
function unfollowAccount(userId){
    let xtthp = new XMLHttpRequest();
    console.log("We are not sure what the server is on");
    xtthp.onreadystatechange = function() { // onreadystatechange is an event 
		//We will update the view (webpage) when the server has responded successfully and the response from the server is OK (200)
			if (this.readyState == 4 && this.status == 200) {
                alert("You have successfully unfollowed the account");
                window.location.reload();
            }
    }
    console.log(userId);
    xtthp.open("DELETE", `/unfollowAccount/${userId}`);
    xtthp.send();
}
function removeLike(title){
    let xtthp = new XMLHttpRequest();
    console.log("We are not sure what the server is on");
    xtthp.onreadystatechange = function() { // onreadystatechange is an event 
		//We will update the view (webpage) when the server has responded successfully and the response from the server is OK (200)
			if (this.readyState == 4 && this.status == 200) {
                alert("You have successfully unliked the artwork");
                window.location.reload();
            }
    }
    xtthp.open("DELETE", `/removeLike/${title}`);
    xtthp.send();
}
function removeReview(title, user){
    let xtthp = new XMLHttpRequest();
    console.log("We are not sure what the server is on");
    xtthp.onreadystatechange = function() { // onreadystatechange is an event 
		//We will update the view (webpage) when the server has responded successfully and the response from the server is OK (200)
			if (this.readyState == 4 && this.status == 200) {
                alert("You have successfully removed the review");
                window.location.reload();
            }
    }
    xtthp.open("DELETE", `/removeReview/${title}/${user}`);
    xtthp.send();
}
function enroll(title, user){
    let xtthp = new XMLHttpRequest();
    console.log("We are not sure what the server is on");
    xtthp.onreadystatechange = function() { // onreadystatechange is an event 
		//We will update the view (webpage) when the server has responded successfully and the response from the server is OK (200)
			if (this.readyState == 4 && this.status == 200) {
                alert("You have successfully enrolled in the workshop");
                window.location.reload();
            }
    }
    xtthp.open("PUT", `/enroll/${title}/${user}`);
    xtthp.send();
}