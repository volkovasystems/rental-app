//: This requires order.
require( "./all-app.js" );

require( "../database/database-connection.js" );

require( "./all-option.js" );

require( "./all-access.js" );

//: app server
require( "../access/access-schema.js" );

require( "../access/access.js" );

require( "../access/access-verify-api.js" );

require( "../access/access-api.js" );
console.log( "app server initialized" );

//: user server
require( "../user/user-schema.js" );

require( "../user/user.js" );

require( "../user/user-verify-api.js" );

require( "../user/user-register-api.js" );

require( "../user/user-login-api.js" );

require( "../user/user-logout-api.js" );

require( "../user/user-api.js" );
console.log( "user server initialized" );


require( "./all-server.js" );