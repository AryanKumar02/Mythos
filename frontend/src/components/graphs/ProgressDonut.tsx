/* eslint-disable react-hooks/rules-of-hooks */
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTaskQuest } from '../../context/TaskQuestContext';
interface ProgressDonutProps {
  width: number;
  height: number;
}

const ProgressDonut: React.FC<ProgressDonutProps> = ({ width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { quests } = useTaskQuest();

  // Outer ring: XP progress
  const totalXP = quests.reduce((acc, quest) => acc + quest.xpReward, 0);

  let level = 1;
  let xpRemainder = totalXP;
  while (xpRemainder >= level * 100) {
    xpRemainder -= level * 100;
    level++;
  }
  const nextLevelXP = level * 100;
  const xpProgressPercent = Math.min(xpRemainder / nextLevelXP, 1);

  // Inner ring: Quest progress
  const totalQuests = quests.length;
  const completedQuests = quests.filter(q => q.isComplete).length;
  const questProgressPercent = totalQuests > 0 ? completedQuests / totalQuests : 0;

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll('*').remove();

    const containerWidth = width;
    const containerHeight = height;
    const radius = Math.min(containerWidth, containerHeight) / 2 - 10; // padding

    const svg = d3
      .select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${containerWidth / 2}, ${containerHeight / 2})`);

    // Add a subtle dark background circle for contrast
    svg.append('circle')
      .attr('r', radius)
      .attr('fill', '#222');

    // Define gradients
    const defs = d3.select(svgRef.current).append('defs');
    // Outer ring gradient (XP)
    const xpGradient = defs.append('linearGradient')
      .attr('id', 'xpGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    xpGradient.append('stop').attr('offset', '0%').attr('stop-color', '#A389D4');
    xpGradient.append('stop').attr('offset', '100%').attr('stop-color', '#524456');

    // Inner ring gradient (Quest)
    const questGradient = defs.append('linearGradient')
      .attr('id', 'questGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    questGradient.append('stop').attr('offset', '0%').attr('stop-color', '#FFB347');
    questGradient.append('stop').attr('offset', '100%').attr('stop-color', '#FFCC33');

    // Data for outer ring (XP)
    const outerArcData = [
      { value: xpProgressPercent, label: 'xpProgress' },
      { value: 1 - xpProgressPercent, label: 'xpRemaining' },
    ];

    // Data for inner ring (Quest)
    const innerArcData = [
      { value: questProgressPercent, label: 'questProgress' },
      { value: 1 - questProgressPercent, label: 'questRemaining' },
    ];

    const pie = d3.pie<{ value: number; label: string }>()
      .value(d => d.value)
      .sort(null);

    // Arc generators for each ring
    const outerArcGenerator = d3.arc<d3.PieArcDatum<{ value: number; label: string }>>()
      .innerRadius(radius * 0.65)
      .outerRadius(radius);
    const innerArcGenerator = d3.arc<d3.PieArcDatum<{ value: number; label: string }>>()
      .innerRadius(radius * 0.35)
      .outerRadius(radius * 0.6);

    // Draw outer ring (XP progress)
    const outerArcs = svg.selectAll('.outerArc')
      .data(pie(outerArcData))
      .enter()
      .append('g')
      .attr('class', 'outerArc');

    outerArcs.append('path')
      .attr('fill', d => d.data.label === 'xpProgress' ? 'url(#xpGradient)' : '#333')
      .attr('d', outerArcGenerator({ startAngle: 0, endAngle: 0 } as d3.PieArcDatum<{ value: number; label: string }>))
      .attr('stroke-width', '2px')
      .on('mouseover', function(event: MouseEvent, d: d3.PieArcDatum<{ value: number; label: string }>) {
         const tooltip = d3.select('body').append('div')
              .attr('class', 'd3-tooltip')
              .style('position', 'absolute')
              .style('background', 'rgba(0, 0, 0, 0.7)')
              .style('color', '#fff')
              .style('padding', '5px 10px')
              .style('border-radius', '5px')
              .style('pointer-events', 'none')
              .style('font-size', '14px')
              .style('opacity', 0);
         tooltip.text(`XP: ${xpRemainder} / ${nextLevelXP}`)
              .transition()
              .duration(300)
              .style('opacity', 1);
         d3.select(this).on('mousemove', function(event: MouseEvent) {
              tooltip.style('left', (event.pageX + 10) + 'px')
                     .style('top', (event.pageY - 28) + 'px');
         });
      })
      .on('mouseout', function() {
         d3.selectAll('.d3-tooltip')
              .transition()
              .duration(300)
              .style('opacity', 0)
              .remove();
      })
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
         const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
         return function(t) {
           return outerArcGenerator(interpolate(t)) || '';
         };
      });

    // Draw inner ring (Quest progress)
    const innerArcs = svg.selectAll('.innerArc')
      .data(pie(innerArcData))
      .enter()
      .append('g')
      .attr('class', 'innerArc');

    innerArcs.append('path')
      .attr('fill', d => d.data.label === 'questProgress' ? 'url(#questGradient)' : '#333')
      .attr('d', innerArcGenerator({ startAngle: 0, endAngle: 0, padAngle: 0, value: 0, data: { value: 0, label: 'questProgress' }, index: 0 }))
      .attr('stroke-width', '2px')
      .on('mouseover', function(event: MouseEvent, d: d3.PieArcDatum<{ value: number; label: string }>) {
          const tooltip = d3.select('body').append('div')
              .attr('class', 'd3-tooltip')
              .style('position', 'absolute')
              .style('background', 'rgba(0, 0, 0, 0.7)')
              .style('color', '#fff')
              .style('padding', '5px 10px')
              .style('border-radius', '5px')
              .style('pointer-events', 'none')
              .style('font-size', '14px')
              .style('opacity', 0);
          tooltip.text(`Quests: ${Math.round(questProgressPercent * 100)}%`)
              .transition()
              .duration(300)
              .style('opacity', 1);
          d3.select(this).on('mousemove', function(event: MouseEvent) {
              tooltip.style('left', (event.pageX + 10) + 'px')
                     .style('top', (event.pageY - 28) + 'px');
          });
      })
      .on('mouseout', function() {
          d3.selectAll('.d3-tooltip')
              .transition()
              .duration(300)
              .style('opacity', 0)
              .remove();
      })
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
         const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
         return function(t) {
           return innerArcGenerator(interpolate(t)) || '';
         };
      });

    // Center text: XP progress percentage
    svg.append('text')
      .attr('class', 'xp-text')
      .attr('text-anchor', 'middle')
      .attr('x', -radius)
      .attr('dy', `${radius + 40}px`)
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(`${Math.round(xpProgressPercent * 100)}% XP`);

    // Center text: Level
    svg.append('text')
      .attr('class', 'level-text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('dy', `${radius + 40}px`)
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(`Level ${level}`);

    // Center text: Quest progress percentage
    svg.append('text')
      .attr('class', 'quest-text')
      .attr('text-anchor', 'middle')
      .attr('x', radius)
      .attr('dy', `${radius + 40}px`)
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(`Quests ${Math.round(questProgressPercent * 100)}%`);
  }, [xpProgressPercent, width, height, quests, xpRemainder, nextLevelXP, level, questProgressPercent]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '1rem',
        borderRadius: '0.5rem',
      }}
    >
      <svg
        ref={svgRef}
        style={{
          display: 'block',
          margin: '0 auto',
        }}
      ></svg>
    </div>
  );
};

export default ProgressDonut;
