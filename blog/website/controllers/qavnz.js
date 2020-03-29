module.exports = {
    bag : {
      posts : [],
      err : ''
    },
	events : {
		load : function(event) {
		    return this.storageService.getList(
		        "blogpost",
		        1,
		        10
	        ).then((results) => {
	            console.log(results);
	            this.bag.posts = results;
	        }).catch((err) => {
	            console.log(err);
	            this.bag.err = err;
	        })
		},
	}
}