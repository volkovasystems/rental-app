var _ = require( "lodash" );
var util = require( "util" );

var Worker = WORKER;

Worker( )
	.clone( )
	.once( "result",
		function onResult( error, workers ){
			if( error ){
				this.self.flush( ).result( error );

			}else if( _.isEmpty( workers ) ){
				this.self.flush( ).result( );

			}else{
				this.self.notify( workers )
			}
		} )
	.set( "sort", "-expirationDate" )
	.all( )
	.self
	.wait( )
	.execute( function ( workers ){
		var timestamp = Date.now( );

		

		async.parallel( workers.map( ( function onEachWorker( worker ){
			return ( function workerExecutor( callback ){
				this.clone( )
					.once( "result",
						function onResult( error, result ){
							if( error ){
								//: Record the error here.
								callback( );

							}else if( result ){
								callback( null, worker )

							}else{
								callback( );
							}
						} )
					.executeTask( worker );
			} ).bind( this );
			
		} ).bind( this ) ),
			( function lastly( error, results ){
				this.notify( ).result( error, results );
			} ).bind( this ) );
	} )

	/*:
		The role of this module is to load non expired workers.
	*/
	.execute( function ( workers ){
		
	} )
	
	