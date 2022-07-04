module.exports = {
    bag : {
      lists : [],
      error : '',
      name : '',
      adding : false,
      openList : '',
      newListItem : '',
      isAuthenticated : true
    },
    events : {
        load : function(event) {
            let sessionState = this.sessionState.retrieveSession() || {};
            if (sessionState.adding) {
                this.bag.adding = true;
            }
            if (sessionState.openList) {
                this.bag.openList = sessionState.openList;
            }

            return this.storageService.getList(
                "todoList",
                1,
                10,
                {
                    "$.subject" : this.sessionState.getSubject()
                }
            ).then((result) => {
                this.bag.lists = result;

                this.bag.lists.forEach((list) => {
                    list.entries = list.entries.sort((a, b) => {
                        return a.title > b.title ? 1 : -1;
                    });
                });
            }).catch((err) => {
                this.bag.error = err;
            });
        },
        removeList : function(event) {
            return this.storageService.deleteEntity(
                "todoList",
                event.id
            ).catch((err) => {
                this.bag.error = err;
            });
        },
        hideForm : function() {
            this.bag.adding = false;
            let sessionState = this.sessionState.retrieveSession() || {};
            sessionState.adding = this.bag.adding;
            this.sessionState.saveSession(sessionState);
        },
        showForm : function() {
            this.bag.adding = true;
            let sessionState = this.sessionState.retrieveSession() || {};
            sessionState.adding = this.bag.adding;
            this.sessionState.saveSession(sessionState);
        },
        openList : function(event) {
            this.bag.openList = event.id;
            let sessionState = this.sessionState.retrieveSession() || {};
            sessionState.openList = this.bag.openList;
            this.sessionState.saveSession(sessionState);
        },
        addListOption : function(event) {
            this.bag.openList = event.bag.openList;
            //get the entry
            return this.storageService.getEntity("todoList", this.bag.openList)
                .then((list) => {
                    list.entries = list.entries || [];

                    list.entries.push({
                        title : event.bag.newListItem,
                        completed : false
                    });

                    return this.storageService.updateEntity("todoList", this.bag.openList, list);
                }).catch((err) => {
                    this.bag.error = err;
                });
        },
        addEntry : function(event) {
            return this.storageService.createEntity("todoList", {
                subject : this.sessionState.getSubject(),
                name : event.bag.name
            }).then(() => {
                this.bag.adding = false;
                let sessionState = this.sessionState.retrieveSession() || {};
                sessionState.adding = this.bag.adding;
                this.sessionState.saveSession(sessionState);
            })
        },
        removeListOption : function(event) {
            this.bag.openList = event.id;
            //get the entry
            return this.storageService.getEntity("todoList", this.bag.openList)
                .then((list) => {
                    list.entries = list.entries || [];

                    list.entries = list.entries.reduce((sum, entry) => {
                        if (entry.id !== event.entry_id) {
                            sum.push(entry);
                        }

                        return sum;
                    }, []);

                    return this.storageService.updateEntity("todoList", this.bag.openList, list);
                }).catch((err) => {
                    this.bag.error = err;
                });
        },
        markAsCompleted : function(event) {
            this.bag.openList = event.id;
            //get the entry
            return this.storageService.getEntity("todoList", this.bag.openList)
                .then((list) => {
                    list.entries = list.entries || [];

                    list.entries.forEach((entry) => {
                        if (entry.id === event.entry_id) {
                            entry.completed = true;
                        }
                    });

                    return this.storageService.updateEntity("todoList", this.bag.openList, list);
                }).catch((err) => {
                    this.bag.error = err;
                });
        },
        logout : function(event) {
            this.authClientProvider.logoutUser("/todo/loggedout");
        }
    }
};