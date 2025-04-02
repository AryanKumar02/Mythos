import React, { useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import { useTaskQuest } from '../../context/TaskQuestContext';

interface ProgressData {
  date: Date;
  xp: number;
  questTitle: string;
}

interface QuestCountData {
  date: Date;
  count: number;
}

interface PlayerProgressionGraphProps {
  width: number;
  height: number;
}

const PlayerProgressionGraph: React.FC<PlayerProgressionGraphProps> = ({ width, height }) => {
  const { quests } = useTaskQuest();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const progressData: ProgressData[] = useMemo(() => {
    let cumulativeXP = 0;
    const pd: ProgressData[] = [];
    const sortedQuests = [...quests].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    sortedQuests.forEach((quest) => {
      cumulativeXP += quest.xpReward;
      pd.push({
        date: new Date(quest.createdAt),
        xp: cumulativeXP,
        questTitle: quest.questTitle || "Unnamed Quest",
      });
    });
    return pd;
  }, [quests]);

  const questCountData: QuestCountData[] = useMemo(() => {
    const sortedQuests = [...quests].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sortedQuests.map((quest, index) => ({
      date: new Date(quest.createdAt),
      count: index + 1,
    }));
  }, [quests]);

  const movingAvgData: ProgressData[] = useMemo(() => {
    const windowSize = 3;
    return progressData.map((d, i, arr) => {
      const start = Math.max(0, i - windowSize + 1);
      const subset = arr.slice(start, i + 1);
      const avg = d3.mean(subset, s => s.xp) as number;
      return { date: d.date, xp: avg, questTitle: d.questTitle };
    });
  }, [progressData]);

  const resetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 50, right: 140, bottom: 70, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const defs = svg.append("defs");
    defs.append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleTime()
      .domain(d3.extent(progressData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(progressData, d => d.xp) || 100])
      .nice()
      .range([innerHeight, 0]);

    const questCountScale = d3.scaleLinear()
      .domain([0, questCountData.length])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat((d) => {
        const date = d instanceof Date ? d : new Date(Number(d));
        return d3.timeFormat("%b %d")(date);
      })
      .tickPadding(16)
      .tickSizeOuter(0);

    const yAxisLeft = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d} XP`)
      .tickPadding(16)
      .tickSizeOuter(0);

    const yAxisRight = d3.axisRight(questCountScale)
      .ticks(5)
      .tickFormat(d => `${d} Quests`)
      .tickPadding(16)
      .tickSizeOuter(0);

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(
        d3.axisBottom(xScale)
          .ticks(6)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
      )
      .selectAll("line")
      .style("stroke", "rgba(255,255,255,0.2)");

    g.append('g')
      .attr('class', 'grid')
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll("line")
      .style("stroke", "rgba(255,255,255,0.2)");

    const xAxisG = g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis);
    xAxisG.selectAll("text")
      .style("font-size", "14px")
      .style("fill", "white")
      .attr("transform", "rotate(-45)")
      .attr("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", "0.25em");
    xAxisG.selectAll("line")
      .style("stroke", "white")
      .style("stroke-width", "1");
    xAxisG.select(".domain")
      .style("stroke", "white")
      .style("stroke-width", "1");

    const yAxisLeftG = g.append('g')
      .call(yAxisLeft);
    yAxisLeftG.selectAll("text")
      .style("font-size", "14px")
      .style("fill", "white");
    yAxisLeftG.selectAll("line")
      .style("stroke", "white")
      .style("stroke-width", "1");
    yAxisLeftG.select(".domain")
      .style("stroke", "white")
      .style("stroke-width", "1");

    const yAxisRightG = g.append('g')
      .attr("transform", `translate(${innerWidth}, 0)`)
      .call(yAxisRight);
    yAxisRightG.selectAll("text")
      .style("font-size", "14px")
      .style("fill", "white");
    yAxisRightG.selectAll("line")
      .style("stroke", "white")
      .style("stroke-width", "1");
    yAxisRightG.select(".domain")
      .style("stroke", "white")
      .style("stroke-width", "1");

    const legend = g.append("g")
      .attr("transform", "translate(0,-20)");

    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "white");
    legend.append("text")
      .attr("x", 18)
      .attr("y", 10)
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Cumulative XP");

    legend.append("rect")
      .attr("x", 120)
      .attr("y", 0)
      .attr("width", 12)
      .attr("height", 12)
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 2);
    legend.append("text")
      .attr("x", 138)
      .attr("y", 10)
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Quest Count");

    const chartGroup = g.append("g")
      .attr("clip-path", "url(#clip)");

    const lineXP = d3.line<ProgressData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.xp))
      .curve(d3.curveMonotoneX);

    const pathXP = chartGroup.append('path')
      .datum(progressData)
      .attr('class', 'progress-line')
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('d', lineXP);

    const lineAvg = d3.line<ProgressData>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.xp))
      .curve(d3.curveMonotoneX);

    chartGroup.append('path')
      .datum(movingAvgData)
      .attr('class', 'moving-average-line')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1.5)
      .attr('d', lineAvg);

    const lineQuestCount = d3.line<QuestCountData>()
      .x(d => xScale(d.date))
      .y(d => questCountScale(d.count))
      .curve(d3.curveMonotoneX);

    chartGroup.append('path')
      .datum(questCountData)
      .attr('class', 'quest-count-line')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-dasharray', '5,5')
      .attr('stroke-width', 2)
      .attr('d', lineQuestCount);

    const circles = chartGroup.selectAll('.data-point')
      .data(progressData)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.xp))
      .attr('r', 4)
      .attr('fill', 'white');

    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("padding", "8px")
      .style("background", "rgba(0, 0, 0, 0.8)")
      .style("color", "white")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    circles.on('mouseover', (event: MouseEvent, d: ProgressData) => {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(
        `<strong>Date:</strong> ${d3.timeFormat("%b %d, %Y")(d.date)}<br/>` +
        `<strong>XP:</strong> ${d.xp}<br/>` +
        `<strong>Quest:</strong> ${d.questTitle}`
      )
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on('mouseout', () => {
      tooltip.transition().duration(500).style("opacity", 0);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 5])
      .translateExtent([[0, 0], [innerWidth, innerHeight]])
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        const newXScale = event.transform.rescaleX(xScale);
        const newYScale = event.transform.rescaleY(yScale);
        const newQuestCountScale = event.transform.rescaleY(questCountScale);
        xAxisG.call(xAxis.scale(newXScale))
              .selectAll("text")
              .attr("transform", "rotate(-45)")
              .attr("text-anchor", "end")
              .attr("dx", "-0.5em")
              .attr("dy", "0.25em")
              .style("fill", "white")
              .style("font-size", "14px");
        yAxisLeftG.call(yAxisLeft.scale(newYScale))
              .selectAll("text")
              .style("fill", "white")
              .style("font-size", "14px");
        yAxisRightG.call(yAxisRight.scale(newQuestCountScale))
              .selectAll("text")
              .style("fill", "white")
              .style("font-size", "14px");
        pathXP.attr("d", lineXP.x(d => newXScale(d.date)).y(d => newYScale(d.xp)));
        const newAvgLine = d3.line<ProgressData>()
          .x(d => newXScale(d.date))
          .y(d => newYScale(d.xp))
          .curve(d3.curveMonotoneX);
        chartGroup.selectAll('.moving-average-line')
          .attr("d", newAvgLine(movingAvgData));
        const newLineQuestCount = d3.line<QuestCountData>()
          .x(d => newXScale(d.date))
          .y(d => newQuestCountScale(d.count))
          .curve(d3.curveMonotoneX);
        chartGroup.selectAll('.quest-count-line')
          .attr("d", newLineQuestCount(questCountData));
        circles.attr("cx", d => newXScale(d.date))
               .attr("cy", d => newYScale(d.xp));
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    const buttonWidth = 80;
    const buttonHeight = 30;
    g.append("foreignObject")
      .attr("x", innerWidth - buttonWidth - 10)
      .attr("y", 10)
      .attr("width", buttonWidth)
      .attr("height", buttonHeight)
      .append("xhtml:div")
      .html(`<button style="width:100%;height:100%; background:#453245; color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">Reset Zoom</button>`)
      .on("click", resetZoom);

    return () => {
      tooltip.remove();
    };

  }, [progressData, movingAvgData, questCountData, width, height]);

  return <svg ref={svgRef}></svg>;
};

export default PlayerProgressionGraph;
