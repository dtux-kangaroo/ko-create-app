import React from 'react';
import { base } from 'kov-util';
function YAxisLeft(props) {
  const { scale, config, translateAxis } = props;
  if (!config.show) return null;
  const { axisLine = {}, tickLine = {}, label = {}, text = {}, unit = {} } = config;
  const { translate = {} } = unit;
  const { count, tickAuto = true, toFixed = 0 } = label;
  const domain = scale.domain();
  const values = scale.ticks
    ? tickAuto
      ? scale.ticks(+count)
      : base.getYTicks(domain[1], domain[0], +count)
    : tickAuto
    ? domain
    : base.getTicksOfAxis(domain, +count);
  const height = scale.range()[0];
  const bandwidth = scale.bandwidth ? scale.bandwidth() : 0;
  const transform = translateAxis ? translateAxis : 'translate(0, 0)';
  const blank = label.blank || 0;

  const ticks = values.map((entry, index) => {
    let y = scale(entry);
    return (
      <g className='kov-tick' transform={`translate(0,${y + bandwidth / 2})`} key={index}>
        {tickLine.show && (
          <line stroke={tickLine.color} strokeWidth={tickLine.width} y1={0.5} y2={0.5} x1={-6.5} x2={-0.5} />
        )}
        {label.show && index % (blank + 1) === 0 && (
          <g transform={'translate(-10, 0)'}>
            <text fill={text.color} x={0} dy='0.3em' transform={'rotate(' + (label.angle || 0) + ')'}>
              {label.type === 'date' ? base.dateFormat(entry, label.showType) : entry.toFixed(toFixed)}
            </text>
          </g>
        )}
      </g>
    );
  });
  return (
    <g
      className='kov-yaxis-left'
      textAnchor='end'
      fontFamily={text.fontFamily}
      fontSize={text.fontSize}
      transform={transform}
    >
      {/* 轴线 */}
      {axisLine.show && <path strokeWidth={axisLine.width} stroke={axisLine.color} d={`M0.5,0.5V${height + 0.5}`} />}

      {/* 轴标签与刻度 */}
      {ticks}

      {/* 单位 */}
      {unit.show && (
        <g
          className='kov-unit'
          transform={'translate(' + (translate.x || '-10') + ', ' + (translate.y || '0') + ')'}
        >
          <text dy='-1em' fill={text.color} fontSize={text.fontSize} textAnchor='end'>
            {unit.text}
          </text>
        </g>
      )}
    </g>
  );
}
function YAxisRight(props) {
  const { scale, config, translateAxis } = props;
  if (!config.show) return null;
  const { axisLine = {}, tickLine = {}, label = {}, text = {}, unit = {} } = config;
  const { translate = {} } = unit;
  const { count, tickAuto = true } = label;
  const domain = scale.domain();
  const values = scale.ticks ? (tickAuto ? scale.ticks(+count) : base.getYTicks(domain[1], domain[0], +count)) : domain;
  const height = scale.range()[0];
  const bandwidth = scale.bandwidth ? scale.bandwidth() : 0;
  const transform = translateAxis ? translateAxis : 'translate(0, 0)';
  const blank = label.blank || 0;

  const ticks = values.map((entry, index) => {
    let y = scale(entry);
    return (
      <g className='kov-tick' transform={`translate(0,${y + bandwidth / 2})`} key={index}>
        {tickLine.show && (
          <line stroke={tickLine.color} y1={0.5} strokeWidth={tickLine.width} y2={0.5} x1={0} x2={6.5} />
        )}
        {label.show && index % (blank + 1) === 0 && (
          <g transform={'translate(10, 0)'}>
            <text fill={text.color} x={0} dy='0.3em'>
              {label.type === 'date' ? base.dateFormat(entry, label.showType) : entry}
            </text>
          </g>
        )}
      </g>
    );
  });
  return (
    <g
      className='kov-yaxis-right'
      textAnchor='start'
      fontFamily={text.fontFamily}
      fontSize={text.fontSize}
      transform={transform}
    >
      {/* 轴线 */}
      {axisLine.show && <path strokeWidth={axisLine.width} stroke={axisLine.color} d={`M0.5,0.5V${height + 0.5}`} />}

      {/* 轴标签与刻度 */}
      {ticks}

      {/* 单位 */}
      {unit.show && (
        <g
          className='kov-unit'
          transform={'translate(' + (translate.x || '10') + ', ' + (translate.y || '0') + ')'}
        >
          <text dy='-1em' fill={text.color} fontSize={text.fontSize} textAnchor='start'>
            {unit.text}
          </text>
        </g>
      )}
    </g>
  );
}

export default {
  YAxisLeft,
  YAxisRight,
}
