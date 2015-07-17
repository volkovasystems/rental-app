//: @administrator-mode:
var ViewUsers = React.createClass( {
	"statics": {
		"load": function load( ){
			$( "[view-users]" ).ready( function onReady( ){
				var viewUsersElement = $( "[view-users]" );

				var viewUsersComponent = <ViewUsers component={ viewUsersElement } />

				React.render( viewUsersComponent, viewUsersElement[ 0 ] );
			} );
		}
	},

	"onClose": function onClose( ){
		PubSub.publish( "close-view-users" );
	},

	"showViewUsers": function showViewUsers( ){
		$( "[data-page]", this.props.component )
			.removeClass( "hidden" )
			.addClass( "shown" );
	},

	"hideViewUsers": function hideViewUsers( ){
		$( "[data-page]", this.props.component )
			.addClass( "hidden" )
			.removeClass( "shown" );
	},

	"clearViewUsersData": function clearViewUsersData( ){
		this.setState( this.getInitialState( ) );
	},

	"onEachUser": function onEachUser( user ){
		for( var key in user ){
			if( _.isEmpty( user[ key ] ) &&
				typeof user[ key ] != "object" &&
				typeof user[ key ] != "number" )
			{
				user[ key ] = "Not Available";
			}
		}

		var fullName = [ user.firstName, user.lastName ].join( " " );

		var birthDate = moment( user.birthDate ).format( "MMMM DD, YYYY" ).toString( )
		
		return; //: @template: template/view-user.html
	},

	"getDefaultProps": function getDefaultProps( ){
		return {
			"component": null
		};
	},

	"getInitialState": function getInitialState( ){
		return {
			"users": [ ]
		};
	},

	"render": function onRender( ){
		return; //: @template: template/view-users.html
	},

	"componentDidUpdate": function componentDidUpdate( prevProps, prevState ){
		
	},

	"componentDidMount": function componentDidMount( ){
		PubSub.subscribe( "close-view-users",
			( function onCloseViewUsers( ){
				this.hideViewUsers( );
			} ).bind( this ) );		

		PubSub.subscribe( "show-view-users",
			( function onShowViewUsers( ){
				this.showViewUsers( );
			} ).bind( this ) );

		PubSub.subscribe( "set-view-users",
			( function onSetViewUsers( users ){
				this.setState( {
					"users": users
				} );
			} ).bind( this ) );

		this.hideViewUsers( );
	}
} );

ViewUsers.load( );
//: @end-administrator-mode