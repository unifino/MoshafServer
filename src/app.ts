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

// -- ===================================================================== Download =======

app.get( '/download', ( req: express.Request, res: express.Response ) => {

    // .. requests
    const alreadySyncedItemIDsString = req.query.i as string;
    const alreadySyncedItemIDs = alreadySyncedItemIDsString.split( "," ) as string[];

    cloud.CloudReport( alreadySyncedItemIDs )
    .then( result => res.json( { status: 200, answer: result } ) )
    .catch( err => res.json( { status: 400, answer: "ERR 02 : " + err } ) );

} );

// -- ======================================================================= Upload =======

app.post( '/upload', ( req: express.Request, res: express.Response ) => {

    // .. requests
    let data = req.query.d as string;
    cloud.CloudWriter( data )
    .then( result => res.json( { status: 200, answer: result } ) )
    .catch( err => res.json( { status: 400, answer: "ERR 02 : " + data } ) );

} );

// -- ============================================================ Listening on Port =======

app.listen( PORT, () => console.info( `running on ${ PORT } ...` ) ); 

// -- ========================================================================= FINE =======