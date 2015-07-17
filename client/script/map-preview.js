var MapPreview = React.createClass( {
	"mixins": [
		StateChangeMixin,
		ClearStateMixin
	],

	"constructStaticMapURL": function constructStaticMapURL( latitude, longitude ){
		var queryString = [
			[ "center", [ latitude, longitude ].join( "," ) 
			].join( "=" ),

			[ "zoom", 15 ].join( "=" ),

			[ "size", [ 640, 640 ].join( "x" ) ].join( "=" ),

			[ "markers", 
				[
					[
						[ "color", "blue" ].join( ":" ),
						[ "label", "P" ].join( ":" )
					].join( "|" ),
					[ latitude, longitude ].join( "," )
				].join( "|" )
			].join( "=" ),

			[ "key", GOOGLE_API_KEY ].join( "=" )
		].join( "&" );

		var staticMapURL = [
			"https://maps.googleapis.com/maps/api/staticmap",
			URI.encodeReserved( queryString )
		].join( "?" );

		return staticMapURL;
	},

	"updateMapPreview": function updateMapPreview( ){
		var staticMapURL = this.constructStaticMapURL( this.state.latitude, this.state.longitude );

		this.staticMapURL = staticMapURL;

		$( this.getDOMNode( ) ).css( {
			"background-image": "url(@staticMapURL)".replace( "@staticMapURL", staticMapURL ),
			"background-repeat": "no-repeat",
			"background-origin": "content-box",
			"background-position": "center"
		} );
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"latitude": DEFAULT_LATITUDE,
			"longitude": DEFAULT_LONGITUDE
		};
	},

	"render": function render( ){
		return; //: @template: template/map-preview.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		if( !_.isEqual( prevProps, this.props ) ){
			this.updateMapPreview( );
		}
	},

	"componentDidMount": function componentDidMount( ){
		this.updateMapPreview( );
	}
} );