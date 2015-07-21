/*:
	The Composite class let's you do method composition (mixins)
*/
var Composite = function Composite( blueprint ){
	if( this instanceof blueprint ){
		this.blueprint = blueprint;

	}else{
		return new blueprint( );
	}
};

Composite.prototype.compose = function compose( blueprint ){
	var properties = this.blueprint.prototype;

	for( var property in properties ){
		if( typeof properties[ property ] == "function" ){
			properties[ property ].compositeOf = blueprint.name;
		}

		blueprint.prototype[ property ] = properties[ property ];
	}

	this.boundBlueprint = blueprint;

	return this;
};

Composite.prototype.configure = function configure( options ){
	options = options || { };
	
	for( var option in options ){
		this.boundBlueprint.prototype[ option ] = options[ option ];	
	}

	return this;
};

global.Composite = Composite