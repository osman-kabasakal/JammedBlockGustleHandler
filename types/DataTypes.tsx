import { ImageSourcePropType } from "react-native";

export interface SeviyeData{
    id:string;
    title:string;
    description:string;
    image:ImageSourcePropType
}

export interface OyunData{
    gameId:string,
    screen:ImageSourcePropType;
    BlockPositions:BlockPosition[];
    JammedPosition:number
}

export interface BlockPosition{
    id:string,
    x:number,
    y:number,
    length:number,
    type:"horizantal"|"vertical"
}

export type SeviyeyeGoreOyunData<T extends SeviyeData>={
    [key in T["id"]]:OyunData[]
}