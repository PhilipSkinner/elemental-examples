module.exports = {
    bag : {
        post : null
    },
	events : {
		load : function(event) {
		    return this.storageService.getEntity(
		        "blogpost",
		        event.id
	        ).then((post) => {
	            this.bag.post = post;
	        }).catch((err) => {
	            this.bag.error = err;
	        })
		},
	}
}