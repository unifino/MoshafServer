import * as express                     from "express"
import * as cloud                       from "./Department/Cloud";
import * as u                           from './types/user'

// -- ========================================================================= INIT =======

const PORT = process.env.PORT || 5000;
const app = express();
let bodyParser = require( 'body-parser' );

// -- ======================================================================== SETUP =======

app.use( bodyParser.json( { limit: '50mb' } ) );
app.use( bodyParser.urlencoded( {
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
} ) );

// -- ============================================================ List of BeautyBGs =======

app.get( '/handshake', ( req: express.Request, res: express.Response ) => {

    // // .. requests
    // const actionHeader = req.query.h as u.ActionHeader;
    // const action = req.query.a as u.ActionHeader;
    // const data = req.query.d as string;
    // const alreadySyncedItemIDsString = req.query.i as string;
    // const alreadySyncedItemIDs = alreadySyncedItemIDsString.split( "," ) as string[];

    // switch ( actionHeader ) {

    //     // .. download Mode
    //     case "download":
    //         cloud.CloudReport( alreadySyncedItemIDs )
    //         .then( result => res.json( { status: 200, answer: result } ) )
    //         .catch( err => res.json( { status: 400, answer: "ERR 02 : " + err } ) );
    //         break;

    //     // .. upload Mode
    //     case "upload":

    //         break;

    //     // .. unknown Mode
    //     default: res.json( { status: 400, answer: "ERR 01" } ); break;

    // }
    res.json( { status: 200, answer: "OK" } )
} );

// -- ============================================================ Listening on Port =======

app.listen( PORT, () => console.info( `running on ${ PORT } ...` ) ); 

// -- ========================================================================= FINE =======