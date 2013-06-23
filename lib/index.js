(function () {
    'use strict';
    var root = this,
        // modules
        fs = require('fs'),
        path = require('path'),
        bson = require('bson'),
        // internal methods
        DB = null;

    DB = function ( dir ) {
        var self = this;

        self.file = path.join( __dirname, ( dir || './' ), 'db.glia' );
        self.storage = fs.createReadStream( self.file );
        self._open = true;
        self._data = [];
        self._buffer = new Buffer( JSON.stringify( self._data ) );
        

        self.storage.on('data', function ( err, chunk ) {
            if ( chunk )
                self._data = JSON.parse( chunk.toString('utf-8') );
                self._buffer = new Buffer( JSON.stringify( self._data ) );
        });

        self.connected = function () {
            return self._open;    
        };

        self.insert = function ( data ) {
            if ( !self._open ) return self;

            data['_id'] = bson.ObjectId();
            self._data.push( data );

            return self;
        };

        self.save = function ( cb ) {
            var cb = cb || function () {};

            if ( !self._open ) {
                err = 'Connection are closed.';
                flag = false;
                cb( err, flag );
                return self;
            }

            self._buffer = new Buffer( JSON.stringify( self._data ) ); 

            fs.writeFile( self.file, self._buffer, function ( err, flag ) {
                flag = ( !err ) ? true : false;
                cb( err, flag ); 
            });

            return self;
        };

        self.find = function ( query, cb ) {
            var cb = cb || function () {};    
        };

        self.close = function () {
            self._open = false;

            return self;
        };

        return self;
    };

    root.db = function ( dir ) {
        return new DB( dir );
    };
}).call( this );
