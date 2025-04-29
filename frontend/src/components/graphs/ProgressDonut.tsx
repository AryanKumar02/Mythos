/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useTaskQuest } from '../../context/TaskQuestContext';
import { useUser } from '../../context/UserContext';

interface ProgressDonutProps {
  width: number;
  height: number;
}

const ProgressDonut: React.FC<ProgressDonutProps> = ({ width, height }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { quests } = useTaskQuest();
  const { user } = useUser();
  console.log("User context data:", user);

  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const nextLevelXP = level * 100;
  const xpProgressPercent = Math.min(xp / nextLevelXP, 1);

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

    // Background circle remains unchanged
    svg.append('circle')
      .attr('r', radius)
      .attr('fill', '#222');

    const defs = d3.select(svgRef.current).append('defs');

    const xpGradient = defs.append('linearGradient')
      .attr('id', 'xpGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    xpGradient.append('stop').attr('offset', '0%').attr('stop-color', '#A389D4');
    xpGradient.append('stop').attr('offset', '100%').attr('stop-color', '#524456');

    const questGradient = defs.append('linearGradient')
      .attr('id', 'questGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    questGradient.append('stop').attr('offset', '0%').attr('stop-color', '#FFB347');
    questGradient.append('stop').attr('offset', '100%').attr('stop-color', '#FFCC33');

    const outerArcData = [
      { value: xpProgressPercent, label: 'xpProgress' },
      { value: 1 - xpProgressPercent, label: 'xpRemaining' },
    ];

    const innerArcData = [
      { value: questProgressPercent, label: 'questProgress' },
      { value: 1 - questProgressPercent, label: 'questRemaining' },
    ];

    const pie = d3.pie<{ value: number; label: string }>()
      .value(d => d.value)
      .sort(null);

    const outerArcGenerator = d3.arc<d3.PieArcDatum<{ value: number; label: string }>>()
      .innerRadius(radius * 0.65)
      .outerRadius(radius);
    const innerArcGenerator = d3.arc<d3.PieArcDatum<{ value: number; label: string }>>()
      .innerRadius(radius * 0.35)
      .outerRadius(radius * 0.6);

    // Outer arcs with hover effect on the path element only
    const outerArcs = svg.selectAll('.outerArc')
      .data(pie(outerArcData))
      .enter()
      .append('g')
      .attr('class', 'outerArc');

    outerArcs.append('path')
      .attr('fill', d => d.data.label === 'xpProgress' ? 'url(#xpGradient)' : '#333')
      .attr('stroke-width', '2px')
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)');
        d3.select('body').append('div')
          .attr('class', 'd3-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.7)')
          .style('color', '#fff')
          .style('padding', '5px 10px')
          .style('border-radius', '5px')
          .style('pointer-events', 'none')
          .style('font-size', '14px')
          .style('opacity', 1)
          .text(`XP: ${xp} / ${nextLevelXP}`);
      })
      .on('mousemove', function (event) {
        d3.select('.d3-tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
        d3.select('.d3-tooltip').remove();
      })
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return outerArcGenerator(interpolate(t)) || '';
        };
      });

    // Inner arcs with similar hover effect
    const innerArcs = svg.selectAll('.innerArc')
      .data(pie(innerArcData))
      .enter()
      .append('g')
      .attr('class', 'innerArc');

    innerArcs.append('path')
      .attr('fill', d => d.data.label === 'questProgress' ? 'url(#questGradient)' : '#333')
      .attr('d', innerArcGenerator({
        startAngle: 0,
        endAngle: 0,
        padAngle: 0,
        value: 0,
        data: { value: 0, label: 'questProgress' },
        index: 0,
      }))
      .attr('stroke-width', '2px')
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1.05)');
        d3.select('body').append('div')
          .attr('class', 'd3-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.7)')
          .style('color', '#fff')
          .style('padding', '5px 10px')
          .style('border-radius', '5px')
          .style('pointer-events', 'none')
          .style('font-size', '14px')
          .style('opacity', 1)
          .text(`Quests: ${Math.round(questProgressPercent * 100)}%`);
      })
      .on('mousemove', function (event) {
        d3.select('.d3-tooltip')
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('transform', 'scale(1)');
        d3.select('.d3-tooltip').remove();
      })
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return innerArcGenerator(interpolate(t)) || '';
        };
      });

    // Text elements remain outside the arc groups so the font sizes won't be affected
    svg.append('text')
      .attr('class', 'xp-text')
      .attr('text-anchor', 'middle')
      .attr('x', -radius)
      .attr('dy', `${radius + 40}px`)
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(`${Math.round(xpProgressPercent * 100)}% XP`);

    svg.append('text')
      .attr('class', 'level-text')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('dy', `${radius + 40}px`)
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(`Level ${level}`);

    svg.append('text')
      .attr('class', 'quest-text')
      .attr('text-anchor', 'middle')
      .attr('x', radius)
      .attr('dy', `${radius + 40}px`)
      .attr('font-size', '16px')
      .attr('fill', '#fff')
      .text(`Quests ${Math.round(questProgressPercent * 100)}%`);
  }, [xpProgressPercent, width, height, quests, xp, nextLevelXP, level, questProgressPercent]);

  return (
    <div
      role="img"
      aria-label={`Progress chart showing ${Math.round(xpProgressPercent * 100)}% XP progress and ${Math.round(questProgressPercent * 100)}% quest completion`}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        role="img"
        aria-hidden="true"
      >
        {/* ... existing SVG content ... */}
      </svg>
      <div
        className="sr-only"
        aria-live="polite"
      >
        {`Level ${level}, ${xp} XP out of ${nextLevelXP} needed for next level. ${completedQuests} out of ${totalQuests} quests completed.`}
      </div>
    </div>
  );
}
export default ProgressDonut;
