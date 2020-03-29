module.exports = {
    bag : {
      title : "",
      blurb : "",
      content : "",
      authorName : "",
      authorEmail : ""
    },
	events : {
		load : function(event) {
		    
		},
		addPost : function(event) {
	        return this.storageService.createEntity(
	            "blogpost",
	            {
	                title : event.bag.title,
	                blurb : event.bag.blurb,
	                content : event.bag.content,
	                date : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
	                author : {
	                    name : event.bag.authorName,
	                    email : event.bag.authorEmail
	                },
	                comments : []
	            }
            ).then(() => {
                this.bag.complete = true;
            }).catch((err) => {
                console.log(err);
                this.bag.error = err;
            })
		},
	}
}