var EventWrapper = function EventWrapper( name, value ){
    if( this instanceof EventWrapper ){
        this.target = {
            "name": name,
            "value": value
        };

    }else{
        return new EventWrapper( name, value );
    }
};
