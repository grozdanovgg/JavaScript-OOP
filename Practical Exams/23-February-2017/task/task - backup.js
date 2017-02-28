function solve() {
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
        isVersionSequential(version, currentVersion) {
            if (version <= currentVersion) {
                throw Error('The new version is not above the old one')
            } else {}

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
                throw 'String must be with length between 1 and 32 symbols'
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
                VALIDATOR.isVersionValid(input);
                VALIDATOR.isVersionSequential(input, this.version);
                this.version = input;
            } else if (input.version) {
                if (input.version) {
                    VALIDATOR.isVersionValid(input.version);
                    VALIDATOR.isVersionSequential(input.version, this.version);
                    this.version = input.version;
                }
                if (input.description) {
                    VALIDATOR.isDescriptionValid(input.description, this.version);
                    this.description = input.description;
                }
                if (input.rating) {
                    VALIDATOR.isRatingValid(input.rating);
                    this.rating = input.rating;
                }
            } else {
                throw 'Input version not a number';
            }
            return this;
        }
    }

    class Store extends App {
        constructor(...input) {
            super(...input);
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
                            x.rating = app.rating;
                            x.description = app.description;
                        } else {
                            throw "Some error";
                        }
                    }
                }
            } else {
                let appToUpload = {
                    name: app.name,
                    description: app.description,
                    version: app.rating
                };
                this.apps.push(appToUpload);
            };
            return this;
        }
        takedownApp(name) {
            // console.log(name);
            let index = this.apps.findIndex(x => x.name === name);
            if (index >= 0) {
                this._apps.splice(index, 1);
            } else {
                throw 'The app with the given name does not exist in the store';
            }
            return this;
        }
        search(pattern) {
            pattern = pattern.toLowerCase();

            let arr = [],
                result = [];
            arr = this._apps.filter(x => x.name.toLowerCase().search(pattern) !== -1);

            for (let item of arr) {
                result.push(item);
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
                for (let i = (arr.length - 1); i > (arr.length - 1 - count); i -= 1) {
                    if (arr[i]) {
                        result.push(arr[i]);
                    }
                }
            } else {
                for (let i = (arr.length - 1); i > (arr.length - 11); i -= 1) {
                    if (arr[i]) {
                        result.push(arr[i]);
                    }
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
                    if (arr[i]) {
                        result.push(arr[i]);
                    }
                }
            } else {
                for (let i = (arr.length - 1); i >= (arr.length - 11); i -= 1) {
                    if (arr[i]) {
                        result.push(arr[i]);
                    }
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

            pattern = pattern.toLowerCase();
            stores = this.apps.filter(x => x instanceof Store);

            for (let store of stores) {
                for (let app of store.apps) {
                    if (app.name.toLowerCase().search(pattern) !== -1) {

                        let index = result.findIndex(x => x.name === app.name);
                        if (index === -1) {
                            result.push(app);
                        } else {
                            if (result[index].version < app.version) {
                                result[index] = app;
                            }
                        }
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

            let index = this.apps.findIndex(x => x.name === name);
            if (index !== -1) {
                return this;
            }

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

            this.apps.push(appToInstall);

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
            let result = [];
            result = this.apps.sort(function(a, b) {
                if (a.name < b.name)
                    return -1;
                if (a.name > b.name)
                    return 1;
                return 0;
            });
            return result;
        }
        update() {
            let stores = this.apps.filter(x => x instanceof Store),
                tempArr = [];

            for (let store of stores) {
                for (let appFromStore of store.apps) {
                    for (let app of this.apps) {
                        if (appFromStore.name === app.name) {
                            if (appFromStore.version > app.version) {
                                app.description = appFromStore.description;
                                app.version = appFromStore.version;
                                app.rating = appFromStore.rating;
                            }
                        }
                    }
                }
            }

            return this;
        }
    }

    return {
        createApp(name, description, version, rating) {
            return new App(name, description, version, rating);
        },
        createStore(name, description, version, rating) {
            return new Store(name, description, version, rating);
        },
        createDevice(hostname, apps) {
            return new Device(hostname, apps);
        }
    };
}

// Submit the code above this line in bgcoder.com
module.exports = solve;