/** @flow */
import {scale, massScale, setScale} from './lib';
type Position = {
  x: number,
  y: number,
};
type Matter = {
  mass: number,
  position: Position,
  velocity: number,
  key: number,
  momentum: Position,
};

setScale(50);
let o1: Matter = {
  mass: 50,
  position: {
    x: 100,
    y: 290,
  },
  velocity: 0,
  key: 1,
  momentum: {x: 0, y: 0},
};
let o2: Matter = {
  mass: 100000,
  position: {
    x: 500 * scale,
    y: 300 * scale,
  },
  velocity: 0,
  key: 2,
  momentum: {x: 0, y: 0},
};
let o3: Matter = {
  mass: 50,
  position: {
    x: 900,
    y: 310,
  },
  velocity: 0,
  key: 3,
  momentum: {x: 0, y: 0},
};

const makeEl = (item) => {
  const el = document.createElement('div');
  el.classList.add('matter');
  el.setAttribute('id', `matter-${item.key}`);
  document.body.appendChild(el);
  return el;
};

let items: Array<Matter> = [o2];

const worker = new Worker('worker.js');

worker.onmessage = ({data: list}) => {
  items = list.filter(i => {
    if (i.mass <= 0) {
      const el = document.querySelector(`#matter-${i.key}`);
      el.parentNode.removeChild(el);
      return false;
    }
    return true;
  });
  items.forEach((item, key) => {
    const foundEl = document.querySelector(`#matter-${item.key}`);
    const el = foundEl || makeEl(item, key);
    const size = Math.max(item.mass * massScale, 2);
    Object.assign(el.style, {
      left: item.position.x / scale - size/2 + 'px',
      top: item.position.y / scale - size/2 + 'px',
      width: size + 'px',
      height: size + 'px',
    });
  });
};
setInterval(() => {
  worker.postMessage(items);
}, 50);

let lastMouseDown = {x: 0, y: 0};
document.body.addEventListener('mousedown', (e: object) => {
  lastMouseDown = {x: e.clientX * scale, y: e.clientY * scale};
});
document.body.addEventListener('mouseup', (e: object) => {
  items.push({
    mass: 1000,
    key: Date.now(),
    position: lastMouseDown,
    momentum: {x: (e.clientX * scale - lastMouseDown.x)/200, y: (e.clientY * scale - lastMouseDown.y)/200},
  });
});

document.body.addEventListener('keydown', (e: object) => {
  if (e.key === 'z') setScale(scale - 5);
  if (e.key === 'x') setScale(scale + 5);
});
