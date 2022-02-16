import * as fs                          from "fs";
import { Pool, Client }                 from 'pg';
import * as c                           from '../types/cloud'


// -- ======================================================================================

type Result = {
    rowCount: number,
    rows: c.Architecture[],
    // command: ,
    // oid: ,
    // fields: ,
    // _parsers: ,
    // _types: ,
    // RowCtor: ,
    // rowAsArray:
};

const client = new Pool( {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
} );

// const client = new Client( {
//     user: 'nifo',
//     host: 'localhost',
//     database: 'nifo',
//     password: 'asd',
//     port: 5432,
// } );

client.connect();
// const client = await client.connect();
// client.release();

// -- ======================================================================================

export function CloudReport ( filter: string[] ): Promise<c.Architecture[]> {

    return new Promise ( (rs, rx) => {

        const qry = `SELECT * FROM cloud`;

        client.query( qry, ( err, r: Result ) =>
            err ? rx(err) : rs( optimizer ( r.rows, filter ) )
        );

    } );

}

// -- ======================================================================================

export function CloudWriter ( data: string ) {

    return new Promise ( (rs, rx) => {

        isDuplicate( data )
        .then( async isDuplicated => {

            // .. a duplicated data has been found
            if ( isDuplicated ) rs( "Duplicate Data" );

            // .. there is no duplicated data found
            else {
                let qry = `INSERT INTO cloud ( patch ) VALUES ( '${ data }' ) RETURNING *;`;
                try {

                    const result = await client.query( qry );

                    // ! better way to confirm??
                    if ( result.rowCount ) rs( "registered" );
                    else rx( "Unable to Register!" );

                }
                catch (err) { rx( "EC05: " + qry ) }
            }

        } )
        .catch( err => rx( "EC08: " + err ) );

    } );

}

// -- ======================================================================================

function optimizer ( rows: c.Architecture[], filter: string[] ) {

    return rows.filter( x => !filter.includes( x.id.toString() ) )

}

// -- ======================================================================================

function isDuplicate ( data: string ): Promise<boolean> {

    return new Promise ( async (rs, rx) => {

        let qry = `Select * from cloud where`;

        try {

            const qry = `SELECT * FROM cloud`;
            client.query( qry, ( err, r: Result ) => {
                // .. there is a Problem Here
                if ( err ) rx( "EC07: " + err );
                // .. checking duplication
                else {
                    r.rows.find( x => JSON.stringify( x.patch ) === data ) ?
                        rs( true ) : rs( false );
                }
            } );

        }
        catch (err) { rx( "EC06: " + qry ) }

    } );

}

// -- ======================================================================================