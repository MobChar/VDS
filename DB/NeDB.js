var Datastore = require('nedb');
var dbObject = {};
dbObject.playback = new Datastore({ filename: 'DB/playback.db', autoload: true });
dbObject.channel = new Datastore({ filename: 'DB/channel.db', autoload: true });
dbObject.tag = new Datastore({ filename: 'DB/tag.db', autoload: true });
dbObject.user = new Datastore({ filename: 'DB/user.db', autoload: true });
dbObject.comment = new Datastore({ filename: 'DB/comment.db', autoload: true });
dbObject.subscribe = new Datastore({ filename: 'DB/subscribe.db', autoload: true });

module.exports = dbObject;