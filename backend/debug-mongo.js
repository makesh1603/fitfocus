const MongoStore = require('connect-mongo');
console.log('Type of MongoStore:', typeof MongoStore);
console.log('MongoStore keys:', Object.keys(MongoStore));
if (typeof MongoStore === 'function') {
    console.log('MongoStore prototype:', Object.keys(MongoStore.prototype));
}
console.log('MongoStore.create type:', typeof MongoStore.create);
console.log('MongoStore.default type:', typeof MongoStore.default);
