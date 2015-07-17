var PageTraversalMixin = {
	"open": function open( ){
		this.clearState( );

		this.show( );

		PubSub.publish( [ this.name, "open" ].join( "-" ) );
	},

	"close": function close( ){
		this.clearState( );

		this.hide( );

		PubSub.publish( [ this.name, "close" ].join( "-" ) );
	},

	"cancel": function cancel( ){
		this.close( );

		PubSub.publish( [ this.name, "cancel" ].join( "-" ) );
	},

	"show": function show( ){
		this.showPage( );

		PubSub.publish( [ this.name, "show" ].join( "-" ) );
	},

	"hide": function hide( ){
		this.hidePage( );

		PubSub.publish( [ this.name, "hide" ].join( "-" ) );
	}
};
