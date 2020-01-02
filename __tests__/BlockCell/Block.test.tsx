
import React from 'react';
import renderer from 'react-test-renderer';
import GamePanHandlerInstance from "../../src/lib/helpers/GamePanHandlerInstance";
import { BlockProps } from "../../src/lib/helpers/CreateBlock";
import { Oyunlar } from "../../src/lib/datas/SeviyelereGoreOyunlar";
import BlockMembers from '../../src/lib/helpers/BlockMembers';
import { BlockPosition } from '../../types/DataTypes';



describe('console', () => {
    it('pan handler', () => {
      let oyun=Oyunlar.seviye_1[0];

let staticOpt = {
    worldOpt: {
      parentRectangle: {
          width:360,
          height:360,
          x:0,
          y:0,

      },
      step: {
        x: 360 / 6,
        y: 360 / 6
      }
    }
  };
  let panHandler=BlockMembers.getInstance(staticOpt.worldOpt);

  let blockOpt: BlockProps = {
    finishCb:()=>{},
    blockMember:panHandler,
    isJammed: true,
    jammedLength: 2,
    objeOpt: {
      length: 2,
      type: "horizantal",
      x: 0,
      y: 2
    },
    ...staticOpt
  };
panHandler.registerCell({x:0*60,y:2*60},blockOpt.objeOpt);
let engel={...blockOpt};
engel.isJammed=false;
engel.objeOpt={
  length:3,
  type:"vertical",
  x:3,
  y:0
}
panHandler.registerCell({x:3*60,y:0},engel.objeOpt);
let verticalEngel:BlockPosition={
  length:2,
  type:"horizantal",
  x:3,
  y:3
}

panHandler.registerCell({x:3*60,y:3*60},verticalEngel);
panHandler.control();
      // expect(panHandler.cells[2][1]).toBe(false);
      // expect(panHandler.cells[2][2]).toBe(false);
      // expect(panHandler.cells[0][3]).toBe(false);
      // expect(panHandler.cells[1][3]).toBe(false);
      // expect(panHandler.cells[2][3]).toBe(false);
      // expect(panHandler.cells[3][0]).toBe(true);
      // expect(panHandler.cells[3][1]).toBe(true);
      // expect(panHandler.cells[3][2]).toBe(true);
      // expect(panHandler.cells[3][3]).toBe(false);
      // expect(panHandler.cells[3][4]).toBe(false);
      // expect(panHandler.cells[3][5]).toBe(false);

      expect(panHandler.isDragable({x:3*60,y:0.2*60},engel.objeOpt,{horDirection:undefined,verDirectin:"down"})).toBe(false);
      expect(panHandler.isDragable({x:2.1*60,y:3*60},verticalEngel,{horDirection:"right",verDirectin:undefined})).toBe(false);
    });
  });