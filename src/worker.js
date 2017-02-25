// @flow
import {step} from './lib';
onmessage = ({data: items}) => {
  const newItems = items.map((item) => step(item, items.filter(i => i !== item)));
  postMessage(newItems);
};
