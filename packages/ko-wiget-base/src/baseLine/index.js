import React from "react";

function BaseLineHorizontal(props) {
  const { width, config = {}, scale, max } = props;
  const { baseValue, baseType, show, baseLine = {}, text = {} } = config;
  const { color, lineType } = baseLine;
  if (!show) return null;
  const y = baseType === "max" ? scale(max) : scale(+baseValue);
  if (+baseValue > max) {
    return null;
  }
  return (
    <g className="__easyv-baseline">
      <line
        x2={width}
        y1={y}
        y2={y}
        stroke={baseLine.color}
        strokeDasharray={baseLine.lineType === "dash" ? "3 3" : null}
      />
      {text.show && (
        <text
          x={!isNaN(text.x) ? text.x : width + 3}
          y={y}
          fill={text.color}
          fontSize={text.fontSize}
          fontFamily={text.fontFamily}
          dy="0.3em"
        >
          {text.content}
        </text>
      )}
    </g>
  );
}

function BaseLineVertical(props) {
  const { height, config = {}, scale, max } = props;
  const { baseValue, baseType, show, baseLine = {}, text = {} } = config;
  if (!show) return null;
  const x = baseType === "max" ? scale(max) : scale(+baseValue);
  return (
    <g className="__easyv-baseline">
      <line
        x1={x}
        x2={x}
        y1={0}
        y2={height}
        stroke={baseLine.color}
        strokeDasharray={baseLine.lineType === "dash" ? "3 3" : null}
      />
      {text.show && (
        <text
          x={x}
          y={-10}
          fill={text.color}
          fontSize={text.fontSize}
          fontFamily={text.fontFamily}
          textAnchor="middle"
        >
          {text.content}
        </text>
      )}
    </g>
  );
}

export default {
  BaseLineHorizontal,
  BaseLineVertical
}
