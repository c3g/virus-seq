import React, { PureComponent } from 'react'
import prop from 'prop-types'
import { Cell, PieChart, Pie, Sector } from 'recharts'
import AutoSizer from 'react-virtualized-auto-sizer'
import COLORS from './colors'

/* const data = [
 *   { name: 'Group A', value: 400 },
 *   { name: 'Group B', value: 300 },
 *   { name: 'Group C', value: 300 },
 *   { name: 'Group D', value: 200 },
 * ] */

export default class Chart extends PureComponent {
  static propTypes = {
    data: prop.arrayOf(prop.shape({
      name: prop.string.isRequired,
      value: prop.number.isRequired,
    })).isRequired,
    total: prop.number.isRequired,
  }

  state = {
    activeIndex: -1,
  }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    })
  }

  onPieLeave = (_, index) => {
    this.setState({
      activeIndex: -1,
    })
  }

  render() {
    const { activeIndex } = this.state
    const { data, total, ...rest } = this.props
    const height = 250
    return (
      <div style={{ width: '100%', height }} {...rest}>
        <AutoSizer>
          {({ width }) =>
            <PieChart width={width} height={height}>
              {renderCentralLabel(
                width  / 2 + 5,
                height / 2 + 5,
                activeIndex === -1 ? total : ''
              )}
              <Pie
                activeIndex={this.state.activeIndex}
                activeShape={renderActiveShape}
                label={renderLabel}
                data={data}
                cx={width / 2}
                cy={height / 2}
                innerRadius={60}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                onMouseEnter={this.onPieEnter}
                onMouseLeave={this.onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          }
        </AutoSizer>
      </div>
    )
  }
}

function renderCentralLabel(cx, cy, value) {
  return (
    <text
      x={cx}
      y={cy}
      dy={8}
      textAnchor='middle'
      fill='#999'
      font-weight='bold'
      font-size='30px'
    >
      {value}
    </text>
  )
}

function renderActiveShape(props) {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 20) * cos
  const my = cy + (outerRadius + 20) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const xDirection = cos >= 0 ? 1 : -1
  // const percentText = (percent * 100).toFixed(2)

  return (
    <g>
      {renderCentralLabel(cx, cy, value)}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + xDirection * 12}
        y={ey + 3}
        textAnchor={textAnchor}
        fill='#333'
        font-weight='bold'
      >
        {payload.name}
      </text>
    </g>
  )
      /* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
       *   {`(${value} entries)`}
       * </text> */
}

function renderLabel(props) {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 20) * cos
  const my = cy + (outerRadius + 20) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? 'start' : 'end'
  const xDirection = cos >= 0 ? 1 : -1
  // const percentText = (percent * 100).toFixed(2)

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text x={ex + xDirection * 12} y={ey + 3} textAnchor={textAnchor} fill='#333'>
        {payload.name}
      </text>
    </g>
  )
}

