// @flow
import React from 'react';
import {observer, inject} from 'mobx-react';

export default inject('ui')(observer(({ui}) => (
  <div className="info">
    <div className="section">
      stars: {ui.matterList.length}
    </div>
    <div className="section">
      scale: {ui.scale}
    </div>
    <div className="section">
      shift: ({ui.shift.x}, {ui.shift.y})
    </div>
    <div className="section">
      speed:
      <input
        value={ui.speed}
        onChange={e => ui.speed = parseFloat(e.target.value)}
      />
    </div>
  </div>
)));
