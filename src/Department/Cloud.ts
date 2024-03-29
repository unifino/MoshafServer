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

type Result_2 = {
    rowCount: number,
    rows: [ { id: number, ver: number } ],
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

export function CloudVersion (): Promise<number> {

    return new Promise ( (rs, rx) => {

        const qry = `SELECT * FROM cloud`;

        client.query( qry, ( err, r: Result_2 ) =>
            err ? rx(err) : rs( r.rows[0].ver )
        );

    } );

}

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

        // .. check integrity!
        if ( !data || data === "null" || data === "[]" ) rx( "No Valid Data to register" );

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

export function CloudOptimizer (): Promise<{}> {

    let newCloud: c.earthRaw[] = [];
    let odd: string[] = [];
    let dub: c.earthRaw[] = [];
    let t: number;
    let s: number = 0;

    return new Promise ( (rs, rx) => {

        CloudReport( [] ).then( cloud => {

            // .. loop on rows
            for ( let row of cloud ) {

                // .. loop on patch-items
                for ( let x of row.patch ) {

                    // .. counter
                    s++;

                    // .. remove corresponded data for "Fav-" or Report
                    if ( x[0] === "Fav-" ) {
                        t = newCloud.findIndex( x => x[0] === "Fav+" && x[1] === x[1] );
                        ~t ? newCloud.splice( t, 1 ) : odd.push( x.toString() );
                    }
                    // .. remove corresponded data for "Unbound" or Report
                    else if ( x[0] === "Unbound" ) {
                        t = newCloud.findIndex( x => x[0] === "Bound" && x[1] === x[1] );
                        ~t ? newCloud.splice( t, 1 ) : odd.push( x.toString() );
                    }
                    // .. add to Cloud or report
                    else {
                        newCloud.find( o => o.toString() === x.toString() ) ?
                            dub.push(x) : newCloud.push(x);
                    }

                }

            }

            // .. report
            rs( {
                odd,
                "size": newCloud.length,
                "diff": s - newCloud.length,
                dub,
                newCloud,
            } );

        } )
        .catch ( err => rx( "EC09: " + err ) )

    } );

}

// -- ======================================================================================