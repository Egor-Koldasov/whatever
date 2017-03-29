// @flow
import {observable} from 'mobx';
import type {IObservableArray} from 'mobx';

export type Position = {
  x: number,
  y: number,
};
export type Matter = {
  key: number,
  mass: number,
  position: Position,
  momentum: Position,
};

let o2: Matter = {
  mass: 100000,
  position: {
    x: 500 * 50,
    y: 300 * 50,
  },
  key: 2,
  momentum: {x: 0, y: 0},
};
let o3: Matter = {
  mass: 1000,
  position: {
    x: 700 * 50,
    y: 300 * 50,
  },
  key: 3,
  momentum: {x: -1, y: -3},
};

export default (mock: Array<Matter> = []): IObservableArray<Matter> =>
  observable.array([o2, o3, ...mock]);
