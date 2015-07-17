var Component = function Component( name ){
	if( this instanceof Component ){
		this.name = name;

		this.className = S( [ "-", name ].join( "" ) ).camelize( ).toString( );

	}else{
		return new Component( name );
	}
};

Component.prototype.load = function load( selector, blueprint ){
	$( selector ).ready( ( function onReady( ){
		var element = $( selector );

		var reactElement = React.createElement( blueprint, {
			"element": element,
			"name": this.name
		} );

		var reactComponent = React.render( reactElement, element[ 0 ] );

		reactComponent.name = this.name;

		Object.defineProperty( window, this.className,
			{
				"enumerable": false,
				"configurable": false,
				"writable": false,
				"value": reactComponent
			} );
	} ).bind( this ) );
};
