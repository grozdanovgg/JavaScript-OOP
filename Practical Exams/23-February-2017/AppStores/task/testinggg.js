let getID = (function() {
    let id = 0;

    return function() {
        id += 1;
        return id;
    };
}());

const VALIDATOR = {
    isNameValid(name) {
        if (typeof name !== 'string' ||
            name.length < 1 ||
            name.length > 24 ||
            !(/^[a-zA-Z1-9 ]*$/.test(name))) {
            throw 'Name must be with length between 1 and 24 latin letters, numbers and whitespace'
        }
    },
    isDescriptionValid(description) {
        if (typeof description !== 'string') {
            throw 'Description must be valid string'
        }
    },
    isVersionValid(version) {
        if (typeof version !== 'number' || version < 0) {
            throw 'Expect positive number'
        }
    },
    isVersionSequential(version) {
        if (version < this.version) {
            throw 'The new version is not above the old one'
        }
    },
    isRatingValid(rating) {
        if (typeof rating !== 'number' || rating < 1 || rating > 10) {
            throw 'Expect number between 1 and 10'
        }
    },
    isApp(app) {
        if (!(app instanceof App)) {
            throw 'App must be a valid instance of the App class'
        }
    },
    isHostNameValid(hostname) {
        if (typeof hostname !== 'string' ||
            hostname.length < 1 ||
            hostname.length > 32) {
            throw 'String must be with length between 1 and 24 latin letters, numbers and whitespace'
        }
    }
}

class App {
    constructor(name, description, version, rating) {
        this.name = name;
        this.description = description;
        this.version = version;
        this.rating = rating;
        this._id = getID();
    }
    set name(name) {
        VALIDATOR.isNameValid(name);
        this._name = name;
    }
    get name() {
        return this._name;
    }
    set description(description) {
        VALIDATOR.isDescriptionValid(description);
        this._description = description;
    }
    get description() {
        return this._description;
    }
    set version(version) {
        VALIDATOR.isVersionValid(version);
        this._version = version;
    }
    get version() {
        return this._version;
    }
    set rating(rating) {
        VALIDATOR.isRatingValid(rating);
        this._rating = rating;
    }
    get rating() {
        return this._rating;
    }
    get id() {
        return this._id;
    }

    release(input) {
        if (typeof input === 'number') {
            VALIDATOR.isVersionSequential(input);
            this.version = input;
        } else {
            VALIDATOR.isVersionSequential(input.version);
            if (input.description) {
                VALIDATOR.isDescriptionValid(input.description)
                this.description = input.description;
            }
            if (input.rating) {
                VALIDATOR.isRatingValid(input.rating);
                this.rating = input.rating;
            }
        }
    }
}

class Store extends App {
    constructor(name, description, version, rating) {
        super(name, description, version, rating);
        this._apps = [];
    }
    get apps() {
        return this._apps;
    }


    uploadApp(app) {
        VALIDATOR.isApp(app);
        if (this.apps.find(x => x.name === app.name)) {
            for (let x of this.apps) {
                if (x.name === app.name) {
                    if (x.version <= app.version) {
                        x.version = app.version;
                    } else {
                        throw `The new version ${app.name} - ${app.version} is not bigger than the old one$ ${x.version}`;
                    }
                }
            }

        } else {
            this.apps.push(app);
        }
        return this;
    }
    takedownApp(name) {
        let index = this.apps.findIndex(x => x.name === name);
        if (index >= 0) {
            this._apps.splice(index, 1);
        } else {
            throw 'The app with the given name does not exist in the store';
        }
        return this;
    }
    search(pattern) {
        let arr = [],
            result = [];
        arr = this._apps.filter(x => x.name.search(pattern) !== -1);
        for (let item of arr) {
            result.push(item)
        }

        result.sort(function(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        })
        return result;
    }
    listMostRecentApps(count) {
        let arr = this._apps,
            result = [];
        if (typeof count === 'number') {
            for (let i = (arr.length - 1); i >= (arr.length - 1 - count); i -= 1) {
                result.push(arr[i]);
            }
        } else {
            for (let i = (arr.length - 1); i >= (arr.length - 11); i -= 1) {
                result.push(arr[i]);
            }
        }
        return result.sort(function(a, b) {
            return b.id - a.id;
        });
    }
    listMostPopularApps(count) {
        let arr = this._apps,
            result = [];

        if (typeof count === 'number') {
            for (let i = (arr.length - 1); i >= (arr.length - 1 - count); i -= 1) {
                result.push(arr[i]);
            }
        } else {
            for (let i = (arr.length - 1); i >= (arr.length - 11); i -= 1) {
                result.push(arr[i]);
            }
        }
        return result.sort(function(a, b) {
            return b.rating - a.rating;
        });
    }
}

class Device {
    constructor(hostname, apps) {
        this.hostname = hostname;
        this.apps = apps;
    }
    set hostname(hostname) {
        VALIDATOR.isHostNameValid(hostname);
        this._hostname = hostname;
    }
    get hostname() {
        return this._hostname;
    }
    set apps(apps) {
        for (let app of apps) {
            VALIDATOR.isApp(app);
        }
        this._apps = apps;
    }
    get apps() {
        return this._apps;
    }
    search(pattern) {
        let result = [],
            stores = [];


        //v 1.0
        // result = this.apps.filter(x => x instanceof Store)
        //     .forEach(store => store.apps.filter(app => app.name.search(pattern) !== -1))
        //     .sort(function(a, b) {
        //         if (a.name < b.name)
        //             return -1;
        //         if (a.name > b.name)
        //             return 1;
        //         return 0;
        //     });
        // return result;

        //v 2.0
        stores = this.apps.filter(x => x instanceof Store);

        for (let store of stores) {
            for (let app of store.apps) {
                if (app.name.search(pattern) > -1) {
                    result.push(app);
                }
            }
        }
        result.sort(function(a, b) {
            if (a.name < b.name)
                return -1;
            if (a.name > b.name)
                return 1;
            return 0;
        });
        return result;
    }
    install(name) {
        let stores = [],
            appsArr = [],
            appsList = [],
            result = [],
            appToInstall;

        stores = this.apps.filter(x => x instanceof Store);
        stores.forEach(store => appsArr.push(store.apps));

        for (let item of appsArr) {
            item.forEach(x => appsList.push(x))
        }
        result = appsList.filter(x => x.name === name);


        if (result.length === 0) {

            throw 'App name is not available in installed stores'
        }

        result = result.sort(function(a, b) {
            if (a.version < b.version)
                return 1;
            if (a.version > b.version)
                return -1;
            return 0;
        });
        appToInstall = result[0];
        console.log(this.apps);
        console.log('xxx');

        this.apps.push(appToInstall);
        console.log(this.apps);

        // if (result.length === 0) {
        //     throw 'Name is not available in installed stores'
        // }
        // if (apps.findIndex(x => x.name === result[0].name) = -1) {
        //     this._apps.push(result[0]);
        // }
        return this;
    }
    uninstall(name) {
        let index = this.apps.findIndex(app => app.name === name);
        if (index >= 0) {
            this._apps.splice(index, 1);
        } else {
            throw 'The app with the given name does not exist in the store';
        }
        return this;
    }
    listInstalled() {
        // v 1.0
        // let result = [];
        // result = this.apps.sort(function(a, b) {
        //     if (a.version < b.version)
        //         return -1;
        //     if (a.version > b.version)
        //         return 1;
        //     return 0;
        // });
        // return result;

        // v 2.0
        let result = [];
        result = this.apps.sort(function(a, b) {
            if (a.version < b.version)
                return 1;
            if (a.version > b.version)
                return -1;
            return 0;
        });
        return result;
    }
    update() {
        let stores = this.apps.filter(x => x instanceof Store),
            deviceApps = this.apps,
            tempArr = [];

        for (let store of stores) {
            for (let appFromStore of store.apps) {
                for (let app of deviceApps) {
                    if (appFromStore.name === app.name) {
                        if (appFromStore.version > app.version) {
                            app = appFromStore;
                            // app.version = appFromStore.version;
                            // install(apppFromStorep)
                        }
                    }
                }
            }
        }
    }
}


let app1a = new App("App1", "Descrion tralala", 5, 3);
let app1b = new App("App1", "Descrion tralala", 6, 3);
let app1c = new App("App1", "Descrion tralala", 4, 3);
let app2 = new App("App2", "Descripo2 tralala", 1, 2);
let app3 = new App("App3", "Descripo2 tralala", 1, 2);
let app4 = new App("App4", "Descrip2 tralala", 1, 2);
let store1 = new Store("Store1", "Descpon tralala", 4, 7)
let store2 = new Store("Store2", "Descposdfgn tralala", 3, 5)
store1.uploadApp(app1a);
store1.uploadApp(app1b);
store1.uploadApp(app2);
store2.uploadApp(app1b);
store2.uploadApp(app3);
store2.uploadApp(app4);

let appsArray = [app4, store1, store2];

let iphone = new Device("hostname1", appsArray)

// console.log(iphone.listInstalled);
// console.log(iphone.listInstalled());
iphone.listInstalled();


iphone.update();
iphone.install("App1");


// console.log(app1);

store1.uploadApp(app1a);
store1.uploadApp(app2);
store2.uploadApp(app3);
store2.uploadApp(app4);
// console.log(store1);
// console.log(store2);