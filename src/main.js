/** @flow */
import React from 'react';
import ReactDOM from 'react-dom';
import mobx, {observable, autorun} from 'mobx';
import DevTools from 'mobx-react-devtools'
import {Provider} from 'mobx-react';
import Info from './components/Info';
import MatterList from './components/MatterList';
import {UI} from './state/ui';
import type {MatterUI} from './state/ui';
import type {Position} from './state/matterList';
window.mobx = mobx;

const makeEl = (item: MatterUI) => {
  const el = document.createElement('div');
  el.classList.add('matter');
  el.setAttribute('id', `matter-${item.matter.key}`);
  document.body.appendChild(el);
  return el;
};

const worker = new Worker('worker.js');

const run = () => {
  const ui = new UI();

  listen(ui);

  setInterval(() => {
    worker.postMessage({items: ui.matterList.slice(), speed: ui.speed});
  }, 50);
  ReactDOM.render(
    <Provider ui={ui}><div><MatterList/><Info/><DevTools/></div></Provider>,
    document.getElementById('app')
  );
}
const listen = (ui) => {
  worker.onmessage = ({data: list}: {data: mixed}) => {
    if (!Array.isArray(list)) return;
    ui.replaceMatterList(list);
  };
}
run();
