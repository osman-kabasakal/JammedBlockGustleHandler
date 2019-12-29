import { ImageSourcePropType } from "react-native";

export interface SeviyeData{
    id:string;
    title:string;
    description:string;
    image:ImageSourcePropType
}

export interface OyunData{
    screen:ImageSourcePropType;
    BlockPositions:BlockPosition[];
    JammedPosition:number
}

export interface BlockPosition{
    x:number,
    y:number,
    length:number,
    type:"horizantal"|"vertical"
}

export type SeviyeyeGoreOyunData<T extends SeviyeData>={
    [key in T["id"]]:OyunData[]
}