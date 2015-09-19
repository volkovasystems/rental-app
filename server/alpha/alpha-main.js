//: This requires order.

//: app server
require( "./alpha-app.js" );

require( "./alpha-database.js" );

require( "./alpha-option.js" );

require( "./alpha-access.js" );

require( "../access/access-schema.js" );

require( "../access/access.js" );

require( "../access/access-verify-api.js" );

require( "../access/access-api.js" );
console.log( "app server middleware initialized" );

//: user server
require( "../user/user-schema.js" );

require( "../user/user.js" );

require( "../user/user-verify-api.js" );

require( "../user/user-register-api.js" );

require( "../user/user-login-api.js" );

require( "../user/user-logout-api.js" );

require( "../user/user-api.js" );
console.log( "user server middleware initialized" );

//: renter server
//require( "../renter/renter-schema.js" );

//require( "../renter/renter.js" );

//require( "../renter/renter-api.js" );
//console.log( "renter server middleware initialized" );

//: room server
require( "../room/room-schema.js" );

require( "../room/room-item-schema.js" );

require( "../room/room-type-schema.js" );

require( "../room/room.js" );

require( "../room/room-item.js" );

require( "../room/room-type.js" );

require( "../room/room-api.js" );

require( "../room/room-item-api.js" );

require( "../room/room-type-api.js" );
console.log( "room server middleware initialized" );

console.log( "app server starting" );
require( "./alpha-server.js" );
