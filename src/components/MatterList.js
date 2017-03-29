// @flow
import React from 'react';
import {observer, inject} from 'mobx-react';
import type {Position} from '../state/matterList';

export const Matter = observer(({item}) => (
  <div
    className="matter"
    style={{
      left: item.pos.x + 'px',
      top: item.pos.y + 'px',
      width: item.size + 'px',
      height: item.size + 'px',
    }}
  />
));

export default inject('ui')(observer(({ui}) => (
  <div
    className="matter-list"
    onMouseDown={(e) => onMouseDown(ui, e)}
    onMouseUp={(e) => onMouseUp(ui, e)}
    onMouseMove={(e) => onMouseMove(ui, e)}
    onContextMenu={(e) => e.preventDefault()}
    onKeyDown={(e) => onKeyDown(ui, e)}
    onWheel={(e) => onWheel(ui, e)}
  >
    {ui.matterUI.map(item => <Matter item={item} key={item.matter.key}/>)}
  </div>
)));

const onWheel = (ui, e) => {
  ui.changeScale(e.deltaY * 0.1);
}
const moveKey = 2;
const onKeyDown = (ui, e) => {
  if (e.key === 'z') return ui.decreaseScale();
  if (e.key === 'x') return ui.increaseScale();
  const keyShiftMap: Array<[string, Position]> = [
    ['ArrowLeft', {x: 1, y: 0}],
    ['ArrowRight', {x: -1, y: 0}],
    ['ArrowUp', {x: 0, y: 1}],
    ['ArrowDown', {x: 0, y: -1}],
  ];
  keyShiftMap.forEach(([key, shift]) => {
    if (e.key === key) ui.moveShift(shift);
  });

  if (e.key === moveKey) {
    ui.cameraMode.move = true;
  }
}

const onMouseDown = (ui, e) => {
  if (e.button === moveKey) {
    ui.cameraMode.move = true;
    ui.cameraMode.from = {x: e.clientX, y: e.clientY};
  } else if (e.button === 0) {
    ui.setLastMouseDown(e)
  }
}
const onMouseUp = (ui, e) => {
  if (e.button === moveKey) {
    ui.cameraMode.move = false;
  } else if (e.button === 0) {
    ui.addMatterUI(e);
  }
}

const onMouseMove = (ui, e) => {
  if (ui.cameraMode.move) {
    const mouseP: Position = {x: e.clientX, y: e.clientY};
    const {from} = ui.cameraMode;
    const shift: Position = {x: mouseP.x - from.x, y: mouseP.y - from.y};
    ui.moveShift(shift);
    Object.assign(from, mouseP);
  }
}
