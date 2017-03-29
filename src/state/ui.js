// @flow
import {observable, computed, action, autorun, extras} from 'mobx';
import type {IObservableArray, IObservableValue} from 'mobx';
import matterList from './matterList';
import type {Matter, Position} from './matterList';
import config from '../config';
import {getSize} from '../lib/matter';
import _ from 'ramda';

export class MatterUI {
  ui: UI;
   matter: Matter; // observable
  constructor(ui: UI, matter: Matter) {
    this.ui = ui;
    this.matter = matter;
  }

  @computed get pos(): Position {
    const size = this.size;
    return {
      x: this.ui.scaleVal(this.matter.position.x) - size/2 + this.ui.shift.x,
      y: this.ui.scaleVal(this.matter.position.y) - size/2 + this.ui.shift.y,
    };
  }
  @computed get size(): number {
    return Math.max(this.ui.scaleVal(getSize(this.matter)), config.minSize);
  }

  @action checkMatter(matter: Matter): boolean {
    const same = matter.key === this.matter.key;
    if (same && matter !== this.matter) {
      this.matter = matter;
    }
    return same;
  }
}
export class UI {
  matterList: IObservableArray<Matter> = matterList();
  matterUI: IObservableArray<MatterUI> = observable([]);
  @observable speed: number = config.speed;
  @observable uiScale: number = config.defaultScale;
  @observable shift: Position = {x: 0, y: 0};
  @observable lastMouseDown: Position = {x: 0, y: 0};
  @observable cameraMode: {move: boolean, from: Position} = {
    move: false,
    from: {x: 0, y: 0},
  };

  constructor() {
    this.matterList.$mobx.atom.name = 'matterList';
    this.matterUI.$mobx.atom.name = 'matterUI';
    autorun(() => {
      let keys = [];
      let newMUI = [];
      const mList = this.matterList;
      mList.forEach((m, i) => {
        if (!this.matterUI.find(mui => mui.checkMatter(m))) {
          newMUI.push(new MatterUI(this, m));
        }
        keys.push(i);
      });
      _.range(0, this.matterUI.length)
      .filter(i => keys.indexOf(i) === -1)
      .forEach(i => this.matterUI.splice(i, 1));
      this.matterUI.push(...newMUI);
    });
    this.listen();
  }

  listen() {
    this.syncUI();
  }

  @action syncUI() {
  }

  unscaleVal(val: number): number {
    return this.scale > 0 ? val * this.scale : (
      this.scale < 0 ? val / this.scale : val
    );
  }
  scaleVal(val: number): number {
    return this.scale > 0 ? val / this.scale : (
      this.scale < 0 ? val * this.scale : val
    );
  }

  @computed get scale(): number {
    const uiScale = this.uiScale;
    return uiScale > 0 ?
      uiScale :
      (uiScale < 0 ? 1/uiScale : 1);
  }

  @action setLastMouseDown(e: MouseEvent) {
    this.lastMouseDown = {
      x: this.unscaleVal(e.clientX - this.shift.x),
      y: this.unscaleVal(e.clientY - this.shift.y),
    };
  }

  @action addMatterUI(e: MouseEvent) {
    this.matterList.push({
      key: Date.now(),
      mass: 1000,
      position: this.lastMouseDown,
      momentum: {
        x: (this.unscaleVal(e.clientX) - this.lastMouseDown.x)/200,
        y: (this.unscaleVal(e.clientY) - this.lastMouseDown.y)/200,
      },

    });
  }

  @action increaseScale() {
    this.uiScale = this.uiScale + 0.8;
  }
  @action decreaseScale() {
    this.uiScale = this.uiScale - 0.8;
  }
  @action changeScale(change) {
    this.uiScale = this.uiScale + change;
  }
  @action moveShift(move: Position) {
    this.shift = {
      x: this.shift.x + move.x,
      y: this.shift.y + move.y,
    }
  }

  @action replaceMatterList(mList: Array<Matter>) {
    this.matterList.push(...mList.filter(m => _.pluck('key', this.matterList).indexOf(m.key) === -1));
    this.matterList.forEach(((m, index) => {
      const lm = mList.find(_lm => _lm.key === m.key);
      if (!lm || lm.mass <= 0) return this.matterList.splice(index, 1);
      if (m !== lm) Object.assign(this.matterList[index], lm);
    }));
  }
}
