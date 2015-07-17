//: This requires order.
require( "./all-app.js" );

require( "./database-connection.js" );

require( "./all-option.js" );

require( "./all-access.js" );

//: app server
require( "./access-schema.js" );

require( "./access.js" );

require( "./access-verify-api.js" );

require( "./access-api.js" );
console.log( "app server initialized" );

//: user server
require( "./user-schema.js" );

require( "./user.js" );

require( "./user-verify-api.js" );

require( "./user-register-api.js" );

require( "./user-login-api.js" );

require( "./user-social-login-api.js" );

require( "./user-logout-api.js" );

require( "./user-api.js" );
console.log( "user server initialized" );

//: social server
require( "./social-schema.js" );

require( "./social.js" );

require( "./social-account-login-api.js" );

require( "./social-api.js" );
console.log( "social server initialized" );

//: vehicle server
require( "./vehicle-model-schema.js" );

require( "./vehicle-schema.js" );

require( "./vehicle-model.js" );

require( "./vehicle.js" );

require( "./vehicle-model-count-api.js" );

require( "./vehicle-model-search-api.js" );

require( "./vehicle-colors-api.js" );

require( "./vehicle-model-api.js" );

require( "./vehicle-api.js" );
console.log( "vehicle server initialized" );

//: place server
require( "./amenity-schema.js" );

require( "./place-schema.js" );

require( "./amenity.js" );

require( "./place.js" );

require( "./amenity-search-api.js" );

require( "./place-search-api.js" );

require( "./place-preview-api.js" );

require( "./place-parks-slots-api.js" );

require( "./amenity-api.js" );

require( "./place-api.js" );
console.log( "place server initialized" );

//: park server
require( "./park-schema.js" );

require( "./park.js" );

require( "./park-count-api.js" );

require( "./park-place-api.js" );

require( "./park-api.js" );
console.log( "park server initialized" );

//: slot server
require( "./slot-schema.js" );

require( "./slot.js" );

require( "./slot-status-api.js" );

require( "./slot-count-api.js" );

require( "./slot-place-reserve-api.js" );

require( "./slot-place-api.js" );

require( "./slot-api.js" );
console.log( "slot server initialized" );

//: price server
require( "./currency-schema.js" );

require( "./price-category-schema.js" );

require( "./price-schema.js" );

require( "./currency.js" );

require( "./price-category.js" );

require( "./price.js" );

require( "./currency-search-api.js" );

require( "./price-category-search-api.js" );

require( "./currency-api.js" );

require( "./price-pay-option-api.js" );

require( "./price-category-api.js" );

require( "./price-api.js" );
console.log( "price server initialized" );

//: reserve server
require( "./reserve-state-schema.js" );

require( "./reserve-schema.js" );

require( "./reserve-state.js" );

require( "./reserve.js" );

require( "./reserve-transaction-api.js" );

require( "./reserve-state-api.js" );

require( "./reserve-slot-api.js" );

require( "./reserve-api.js" );
console.log( "reserve server initialized" );

require( "./all-server.js" );