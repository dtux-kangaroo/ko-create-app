import React from 'react';
import { base } from 'kov-util';

export default function XAxis(props) {
  const { scale, config, translateAxis, transformLine, emitCallback } = props;
  if (!config.show) return null;
  const { axisLine = {}, tickLine = {}, label = {}, text = {}, unit = {} } = config;
  const { translate: unitTranslate = {} } = unit;
  const { x: unitTranslateX = 20, y: unitTranslateY = 0 } = unitTranslate;
  const values = scale.ticks ? scale.ticks(+label.count) : base.getTicksOfAxis(scale.domain(), +label.count);
  const width = scale.range()[1];
  const bandwidth = scale.bandwidth ? scale.bandwidth() : 0;

  const textAnchor = +label.angle === 0 ? 'middle' : +label.angle > 0 ? 'start' : 'end';
  const textDy = +label.angle === 270 ? '0.01em' : '1em';
  const transform = translateAxis ? translateAxis : 'translate(0, 0)';
  const lineTransform = transformLine ? transformLine : 'translate(0, 0)';
  const textTranslateY = tickLine.show ? 15 : 8;
  const onRelativeData = (text) => {
    emitCallback({
      x: text,
    });
  };
  const ticks = values.map((entry, index) => {
    let showText = label.type === 'date' ? base.dateFormat(entry, label.showType) : entry;
    let showTextList = [];
    if (label.break) {
      showTextList.push(showText.slice(0, label.breakNumber));
      showTextList.push(showText.slice(label.breakNumber, showText.length));

      showText = showTextList.map((showText, index) => {
        return (
          <tspan key={index} x={0} dy={index === 0 ? textDy : text.fontSize + 2}>
            {showText}
          </tspan>
        );
      });
    }

    let x = scale(entry);
    return (
      <g className='kov-tick' transform={`translate(${x + bandwidth / 2}, ${label.translateY || 0})`} key={index}>
        {tickLine.show && <line strokeWidth={tickLine.width} stroke={tickLine.color} y2='6' x1={0.5} x2={0.5} />}
        {label.show && (
          <g transform={`translate(0, ${textTranslateY})`}>
            <text
              onClick={() => onRelativeData(showText)}
              fill={text.color}
              x={0}
              dy={textDy}
              transform={`rotate(${+label.angle != 90 ? label.angle : 0})`}
              style={
                label.angle == 90
                  ? {
                      writingMode: 'tb',
                      textOrientation: 'upright',
                      textAnchor: 'start',
                    }
                  : {}
              }
            >
              {
                // label.type === 'date' ? dateFormat(entry, label.showType) : entry
                showText
              }
            </text>
          </g>
        )}
      </g>
    );
  });

  return (
    <g textAnchor={textAnchor} fontFamily={text.fontFamily} fontSize={text.fontSize} transform={transform}>
      {/* 轴线 */}
      {axisLine.show && (
        <path
          transform={lineTransform}
          stroke={axisLine.color}
          d={`M0.5,0.5H${width + 0.5}`}
          strokeWidth={axisLine.width || 1}
        />
      )}

      {/* 轴标签与刻度 */}
      {ticks}

      {/* 单位 */}
      {unit.show && (
        <g
          className='kov-x-unit'
          transform={`translate(${width + unitTranslateX}, ${textTranslateY + unitTranslateY})`}
        >
          <text dy='0.8em' fill={text.color} fontSize={text.fontSize} textAnchor='start'>
            {unit.text}
          </text>
        </g>
      )}
    </g>
  );
}
