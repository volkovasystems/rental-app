var Page = function Page( component ){
    if( this instanceof Page ){
        this.component = component;

        Page.list.push( this );

    }else{
        return new Page( component );
    }
};

Page.list = [ ];

Page.prototype.hideAllPages = function hideAllPages( ){
    _( Page.list )
        .each( function onEachPage( page ){
            page.hide( );
        } );

    return this;
};

Page.prototype.showOnlyThisPage = function showOnlyThisPage( ){
    this.hideAllPages( );

    this.component.show( );

    return this;
};
