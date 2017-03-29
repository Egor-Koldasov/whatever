// @flow
import {step} from './lib';
onmessage = ({data: {items, speed}}) => {
  const newItems = items.map((item) => step(item, items.filter(i => i !== item), speed));
  postMessage(newItems);
};
