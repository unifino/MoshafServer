
// export interface Architecture {
//     id                  : number                ,
//     QFav                : number[]              ,
//     HFav                : number[]              ,
//     Bound               : [ string, string ][]  ,
// }


export interface Architecture {
    id      : number    ,
    patch   : string    ,
}

export interface cloud_response {
    status: number,
    answer: Architecture[] | "string"
}
