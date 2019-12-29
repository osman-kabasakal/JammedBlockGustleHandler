import { SeviyeyeGoreOyunData, SeviyeData, OyunData } from "../../../types/DataTypes";
import {Seviyeler} from "./SeviyeData";
export var Oyunlar= {
    seviye_1:[
        {
            // screen:require("../../../assets/block_screen.jpg")
            screen:require("../../../assets/block_screen.jpg"),
            BlockPositions:[
                {
                    x:0,
                    y:0,
                    length:3,
                    type:"horizantal"
                },
                {
                    x:2,
                    y:1,
                    length:3,
                    type:"vertical"
                },
                {
                    x:0,
                    y:5,
                    length:3,
                    type:"horizantal"
                },
                {
                    x:0,
                    y:3,
                    length:2,
                    type:"vertical"
                },
                {
                    x:5,
                    y:0,
                    length:3,
                    type:"vertical"
                },
                {
                    x:4,
                    y:3,
                    length:2,
                    type:"horizantal"
                },
                {
                    x:4,
                    y:4,
                    length:2,
                    type:"vertical"
                },
            ],
            JammedPosition:0
        } as OyunData,
        {
            screen:{
                uri:"../../../assets/block_screen.jpg"
            } ,
            BlockPositions:[
                {
                    x:3,
                    y:0,
                    length:2,
                    type:"horizantal"
                }
            ],
            JammedPosition:1
        },
        {
            screen:{
                uri:"../../../assets/block_screen.jpg"
            } ,
            BlockPositions:[
                {
                    x:3,
                    y:0,
                    length:2,
                    type:"horizantal"
                }
            ],
            JammedPosition:1
        },
        {
            screen:{
                uri:"../../../assets/block_screen.jpg"
            } ,
            BlockPositions:[
                {
                    x:3,
                    y:0,
                    length:2,
                    type:"horizantal"
                }
            ],
            JammedPosition:1
        },
        {
            screen:{
                uri:"../../../assets/block_screen.jpg"
            } ,
            BlockPositions:[
                {
                    x:3,
                    y:0,
                    length:2,
                    type:"horizantal"
                }
            ],
            JammedPosition:1
        }
    ],
    seviye_2:[
        {
            screen:{
                uri:"../../../assets/block_screen.jpg"
            } ,
            BlockPositions:[
                {
                    x:2,
                    y:0,
                    length:2,
                    type:"vertical"

                }
            ],
            JammedPosition:1
        }
    ],
    seviye_3:[
        {
            screen:{
                uri:"../../../assets/block_screen.jpg"
            } ,
            BlockPositions:[
                {
                    x:1,
                    y:0,
                    length:2,
                    type:"vertical"
                }
            ],
            JammedPosition:1
        }
    ],

}