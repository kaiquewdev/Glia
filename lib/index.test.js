var should = require('should'),
    glia = require('./'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn;

suite('Glia', function () {
    suite('db', function () {
        var db = glia.db('./case'); 

        test('instance', function ( done ) {
            db.connected().should.be.true;
            done();
        });    

        test('insert', function ( done ) {
            db.insert({ a: 1 });

            db._data.should.have.lengthOf( 1 );
            done();
        });

        test('save', function ( done ) {
            db.save(function ( err, status ) {
                status.should.be.true;
                done();
            });
        });

        test('find', function ( done ) {
            db.insert({ a: 2 }, function ( data ) {
                db.save(function ( err, status ) { 
                    db.find({ _id: data['_id'] }).should.eql( data );
                    db.find({ a: 1 }).should.have.lengthOf( 1 );
                    done();
                });
            });
        });

        test('close', function ( done ) {
            db.close();
            db._open.should.be.false;
            done();
        });
    });
});
