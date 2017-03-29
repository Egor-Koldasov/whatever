// @flow
import {getSize} from './lib/matter';
import type {Matter} from './state/matterList';
import config from './config';

let equal = 0;
export const step = (target: Matter, others: Array<Matter>, speed: number): Matter => {
  let life = 0;
  const forces: Array<{x: number, y: number}> = others.map((matter) => {
    const p1 = target.position;
    const p2 = matter.position;
    const distance: number = Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
    const crossing = distance < getSize(target) + getSize(matter);
    if (crossing) {
      life = target.mass < matter.mass ? -1 :
        target.mass !== matter.mass ? matter.mass + target.mass :
        (equal > 0 ? equal = -1 : equal = matter.mass + target.mass);
    }
    const force = crossing ? 0 : (target.mass * matter.mass) / (distance ** 2);
    const direction = (p2.y - p1.y) / (p2.x - p1.x);
    const diff = distance/force;
    const vector = {
      x: (p2.x - p1.x)/diff,
      y: (p2.y - p1.y)/diff,
    };
    // vector.x = p2.x - p1.x > 0 ? vector.x : -vector.x;
    // vector.y = p2.y - p1.y > 0 ? vector.y : -vector.y;
    return vector;

    /*
    r = Vy/Vx
    s = sqrt(Vx^2 + Vy^2); Vx^2 = s^2 - Vy^2; Vx = sqrt(s^2 - Vy^2)

    Vy = r * sqrt(s^2 - Vy^2)

    Vy/Vx = Vy'/Vx' =
    */
  });

  const force = [...forces].reduce((total, adding) => ({
    x: total.x + adding.x,
    y: total.y + adding.y,
  }), {x: 0, y: 0});

  return {
    ...target,
    position: {
      x: target.position.x + target.momentum.x * speed,
      y: target.position.y + target.momentum.y * speed,
    },
    mass: life > 0 ? life : (life < 0 ? 0 : target.mass),
    momentum: {
      x: target.momentum.x + (force.x/target.mass) * speed,
      y: target.momentum.y + (force.y/target.mass) * speed,
    },
  };
};
