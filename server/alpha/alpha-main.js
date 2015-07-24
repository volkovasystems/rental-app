//: This requires order.
require( "./alpha-app.js" );

require( "../database/database-connection.js" );

require( "./alpha-option.js" );

require( "./alpha-access.js" );

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

//: renter server
require( "../renter/renter-schema.js" );

require( "../renter/renter.js" );

require( "../renter/renter-access.js" );

require( "../renter/renter-api.js" );
console.log( "renter server initialized" );


require( "./alpha-server.js" );
