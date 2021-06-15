import React from 'react';
import { base } from 'kov-util';
export default function Grid(props) {
  const { xScale, yScale, xConfig, yConfig } = props;
  if (!xConfig.show && !yConfig.show) return null;
  const { tickAuto = true, count: yCount, offset: yOffset = 3 } = yConfig;
  const { offset: xOffset = 3 } = xConfig;
  const width = xScale.range()[1];
  const height = yScale.range()[0];
  const yDomain = yScale.domain();
  const xValues = xScale.ticks ? xScale.ticks(+xConfig.count) : xScale.domain();
  const yValues = yScale.ticks ? tickAuto ? yScale.ticks(+yCount) : base.getYTicks(yDomain[1], yDomain[0], +yCount) : yDomain;
  const xBandwidth = xScale.bandwidth ? xScale.bandwidth() : 0;
  const yBandwidth = yScale.bandwidth ? yScale.bandwidth() : 0;
  return (
    <g className="kov-grid">
      {
        yConfig.show && <g className="kov-grid-horizontal">
          {
            yValues.map((entry, index) => {
              let y = yScale(entry);
              if (y + yBandwidth / 2 === height) return null;

              return <line key={index} x1={0} x2={width} y1={y + yBandwidth / 2} y2={y + yBandwidth / 2} stroke={yConfig.color} strokeWidth={yConfig.width} strokeDasharray={yConfig.lineType === 'solid' ? 'solid' : `${yOffset}`} />
            })
          }
        </g>
      }

      {
        xConfig.show && <g className="kov-grid-vertical">
          {
            xValues.map((entry, index) => {
              let x = xScale(entry);
              if(x === 0) {
                if(xConfig.showFirst) {
                  return <line key={index} x1={x + xBandwidth / 2} x2={x + xBandwidth / 2} y2={height} stroke={xConfig.color} strokeWidth={xConfig.width} strokeDasharray={xConfig.lineType === 'solid' ? 'solid' : `${xOffset}`} />
                }
                else {
                  return null
                }
              };

              return <line key={index} x1={x + xBandwidth / 2} x2={x + xBandwidth / 2} y2={height} stroke={xConfig.color} strokeWidth={xConfig.width} strokeDasharray={xConfig.lineType === 'solid' ? 'solid' : `${xOffset}`} />
            })
          }
        </g>
      }
    </g>
  )
}
