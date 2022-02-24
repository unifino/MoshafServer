
// export interface Architecture {
//     id                  : number                ,
//     QFav                : number[]              ,
//     HFav                : number[]              ,
//     Bound               : [ string, string ][]  ,
// }


export interface Architecture {
    id      : number        ,
    patch   : earthRaw[]    ,
}

export interface cloud_response {
    status: number,
    answer: Architecture[] | "string"
}


// -- =====================================================================================

export type earthActions =
      "BugReport"
    | "Fav+"
    | "Fav-"
    | "Bound"
    | "Unbound"
    | "Comment"
    // | "Uncomment"
    ;

export type Source = "Q" | "H" | "N" | "T" | "C";
export type earthParcel = [ Source, number, string? ];
export type earthValue = earthParcel | [ earthParcel, earthParcel ];

export type earthRaw = [ earthActions, earthValue ];

// -- =====================================================================================
