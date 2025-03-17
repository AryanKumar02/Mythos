import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { useTaskQuest } from '../../context/TaskQuestContext';

interface PieChartData {
  label: string;
  value: number;
}

interface PieChartProps {
  width?: number;
  height?: number;
}

const PieChart: React.FC<PieChartProps> = ({
  width = 500,
  height = 400,
}) => {
  const { quests } = useTaskQuest();
  const activeCount = quests.filter(q => !q.isComplete).length;
  const completedCount = quests.filter(q => q.isComplete).length;

  const data = useMemo((): PieChartData[] => {
    return [
      { label: 'Active Quests', value: activeCount },
      { label: 'Completed Quests', value: completedCount },
    ];
  }, [activeCount, completedCount]);

  const colorScale = d3.scaleOrdinal<string>()
    .domain(data.map(d => d.label))
    .range(["#7B5B76", "#A390A7"]);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 100, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = (Math.min(innerWidth, innerHeight) / 2) * 0.9;

    const pie = d3.pie<PieChartData>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.05);

    const arcGenerator = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius);

    const arcHoverGenerator = d3.arc<d3.PieArcDatum<PieChartData>>()
      .innerRadius(0)
      .outerRadius(radius + 10);

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${(innerHeight / 2) + margin.top})`);

    const arcs = chartGroup.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', d => arcGenerator(d) as string)
      .attr('fill', d => colorScale(d.data.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(300)
          .attr('d', arcHoverGenerator(d) as string);
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .transition()
          .duration(300)
          .attr('d', arcGenerator(d) as string);
      });

    const legendGroup = svg.append('g')
      .attr('transform', `translate(${width / 2 - 60}, ${height - margin.bottom + 20})`);

    const legend = legendGroup.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(0, ${i * 30})`);

    legend.append('rect')
      .attr('x', -40)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', d => colorScale(d.label))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    legend.append('text')
      .attr('x', -15)
      .attr('y', 14)
      .attr('fill', '#fff')
      .attr('font-size', '14px')
      .text(d => `${d.label}: ${d.value}`);

    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('padding', '8px')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', '#fff')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);

    arcs.on('mousemove', (event, d) => {
      tooltip
        .html(`<strong>${d.data.label}</strong>: ${d.data.value}`)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 28) + 'px');
    })
    .on('mouseover', () => {
      tooltip.transition().duration(200).style('opacity', 0.9);
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

    return () => {
      tooltip.remove();
    };

  }, [data, width, height, colorScale]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <svg ref={svgRef} />
    </div>
  );
};

export default PieChart;
