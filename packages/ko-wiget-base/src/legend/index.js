import React from 'react';
import './style.css'
export default function Legend(props) {
  const { config = {}, icon: IconOutside, series = [], random = Math.random(), margin = {} } = props;
  if (!config.show) return null;
  const shouldShowedSeries = series.filter((d) => d.show || d.show == null);
  const { text = {}, layout = {}, isAnime = false, reStart = false, number = {} } = config;

  const {
    // 设置图例默认类型
    type = 'rect',
    translateX = '0',
    translateY = '0',
    orientation = 'horizontal',
    icon: iconStyle = {},
    gridCustom,
    grid = {},
    gridGap = {},
  } = layout;

  let { column = 1, row = 1 } = grid;

  const seriesLength = shouldShowedSeries.length;

  if (!gridCustom) {
    if (orientation === 'vertical') {
      column = 1;
      row = seriesLength;
    } else {
      column = seriesLength;
      row = 1;
    }
  }

  const conditionStyle = getPosition(layout, margin);

  const wrapperStyle = {
    position: 'absolute',
    height: 'auto',
    display: 'flex',
  };

  const legendStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(' + column + ', 1fr)',
    gridTemplateRows: 'repeat(' + row + ', 1fr)',
    gridGap: (gridGap.row || layout.margin) + 'px ' + (gridGap.column || layout.margin) + 'px',
    margin: layout.margin, //后续请用gridGap代替
    padding: 0,
    margin: 0,
    fontSize: +text.fontSize,
    color: text.color,
  };

  const itemStyle = {
    display: orientation === 'vertical' ? 'flex' : 'inline-flex',
  };

  const svgStyle = {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: iconStyle.margin || 4,
    marginBottom: 2,
  };

  return (
    <div
      className='kov-legend-wrapper'
      style={{
        ...wrapperStyle,
        ...conditionStyle,
        transform: `translate3d(${translateX}px,${translateY}px,0)`,
      }}
    >
      <ul className='kov-legend' style={legendStyle}>
        {shouldShowedSeries.map((entry, index) => {
          // 为了适用公共的MyIcon 这里只传了一个color，导致basicBar中已经支持渐变的图例没有拿到正确的color
          let color = entry.color,
            name = entry.name,
            value = entry.value,
            size = iconStyle.size || legendStyle.fontSize,
            iconType = iconStyle.type || type, //type === 'rect'是为了兼容老的写法，以后都以iconStyle.type为准，增加图标灵活性
            svgIconProps = { random, size, color, name, marginRight: svgStyle.marginRight },
            showValue = typeof value !== 'undefined' && number.show;

          return (
            <li
              className={`kov-legend-item ${isAnime ? animeStyles[`legend-anime${reStart ? '-' : ''}`] : ''}`}
              style={{
                ...itemStyle,
                animationDelay: `${index * 2000}ms`,
                alignItems:
                  number.show === true ? (number.direction === 'vertical' ? 'center' : 'baseline') : 'baseline',
              }}
              key={index}
            >
              <div>
                {IconOutside && iconType !== 'rect' ? (
                  //如果是线形，进一步判断是虚线还是实现
                  iconType === 'line' ? (
                    <IconOutside {...svgIconProps} type={entry.lineType} />
                  ) : (
                    <IconOutside {...svgIconProps} />
                  )
                ) : (
                  // XXX：使用legend的组件没有指定iconType时，图例颜色都使用一下逻辑，而不使用传过来的MyIcon函数
                  iconType !== 'none' && (
                    <svg width={size} height={size} style={svgStyle}>
                      <linearGradient
                        gradientTransform={'rotate(' + (color.rotate ? color.rotate : 0) + ', .5, .5)'}
                        x1={0}
                        y1={0}
                        x2={0}
                        y2={1}
                        id={'basicBar-react-fill-' + random + '-' + index}
                      >
                        <stop offset='0' stopColor={color.start} />
                        <stop offset='1' stopColor={color.end} />
                      </linearGradient>
                      {iconType === 'rect' ? (
                        <rect
                          width={size}
                          height={size}
                          fill={
                            typeof color === 'string' ? color : 'url(#basicBar-react-fill-' + random + '-' + index + ')'
                          }
                        />
                      ) : (
                        <circle
                          cx={size / 2}
                          cy={size / 2}
                          r={size / 2}
                          fill={
                            typeof color === 'string' ? color : 'url(#basicBar-react-fill-' + random + '-' + index + ')'
                          }
                        />
                      )}
                    </svg>
                  )
                )}
              </div>
              <span
                style={{
                  display: 'flex',
                  alignItems: number.direction === 'vertical' ? 'baseline' : 'center',
                  flexDirection: number.direction === 'vertical' ? 'column' : 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}
              >
                {name && <span className='kov-legend-item-text'>{name}</span>}
                {showValue && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding:
                        number.direction === 'vertical'
                          ? number.padding + 'px' + ' 0px 0px 0px'
                          : '0px 0px 0px ' + (number.padding + 'px'),
                    }}
                  >
                    <span
                      style={{
                        color,
                        fontSize: number.text.fontSize,
                        textShadow: number.text.shadow
                          ? `${number.text.shadow.hShadow}px ${number.text.shadow.vShadow}px ${number.text.shadow.blur}px ${number.text.shadow.color}`
                          : undefined,
                      }}
                      className='kov-legend-item-value'
                    >
                      {value}
                    </span>
                    {number.real && number.suffix && number.suffix.show && (
                      <span style={number.suffix.text}>{number.suffix.value}</span>
                    )}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
function getPosition(layout, margin) {
  let { position, align } = layout,
    { left = 0, bottom = 0, right = 0, top = 0 } = margin;
  switch (position) {
    case 'top':
      return {
        top: 5,
        left,
        right,
        justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
      };
    case 'right':
      return {
        top,
        right: 10,
        bottom,
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
      };
    case 'left':
      return {
        top,
        left: 10,
        bottom,
        alignItems: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
      };
    default:
      return {
        bottom: 5,
        left,
        right,
        justifyContent: align === 'center' ? 'center' : align === 'left' ? 'flex-start' : 'flex-end',
      };
  }
}
