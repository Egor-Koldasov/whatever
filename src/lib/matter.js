// @flow
import config from '../config';
import type {Matter} from '../state/matterList';

export const getSize = (
  matter: Matter,
  massScale: number = config.massScale,
) =>
  matter.mass * massScale + 250;
