module.exports = {
	bag : {
		value : 0,
		pets : [],
		error : " ",
		name : " "
	},
	events : {
		load : function(event) {
		    var state = this.sessionState.retrieveSession();

			if (state && state.value) {
				this.bag.value = state.value;
			} else {
			    this.bag.value = 0;
			}
			
			return this.storageService.getList("pets", 1, 10, this.sessionState.getAccessToken()).then((pets) => {
			    this.bag.pets = pets;
			}).catch((err) => {
			    this.bag.error = err;
			});
		},
		postback : function(event) {
		    return this.storageService.createEntity("pets", {
		        name : event.bag.name
		    }, this.sessionState.getAccessToken()).then(() => {
		       return this.storageService.getList("pets", 1, 10, this.sessionState.getAccessToken()).then((pets) => {
			        this.bag.pets = pets;
			    }).catch((err) => {
			        this.bag.error = err;
			    }); 
		    }).catch((err) => {
		        this.bag.error = err;
		    });
		},
		increment : function(event) {
			this.bag.value++;

			this.sessionState.saveSession(this.bag);
		}
	}
};