import React, { useRef, useEffect } from "react";
import { select } from "d3-selection";
import { arc, DefaultArcObject } from "d3-shape";

interface StreakMeterProps {
  width?: number;
  height?: number;
}

const StreakMeter: React.FC<StreakMeterProps> = ({ width = 350, height = 350 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Dummy streak data for demonstration
  const streak = 17;
  const maxStreak = 30;

  useEffect(() => {
    if (!svgRef.current) return;

    const startAngle = -Math.PI * 2 / 3; // -120° in radians
    const endAngle = Math.PI * 2 / 3;      // 120° in radians
    const totalAngle = endAngle - startAngle;
    const progressAngle = startAngle + (streak / maxStreak) * totalAngle;

    // Radii for the gauge; leave additional room for ornate decoration
    const outerRadius = Math.min(width, height) / 2 - 30;
    const innerRadius = outerRadius - 20;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const centerX = width / 2;
    const centerY = height / 2;

    // Create definitions for gradients and filters
    const defs = svg.append("defs");

    // Linear gradient for the background arc
    const bgGradient = defs.append("linearGradient")
      .attr("id", "bgGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");
    bgGradient.append("stop").attr("offset", "0%").attr("stop-color", "#555");
    bgGradient.append("stop").attr("offset", "100%").attr("stop-color", "#333");

    // Linear gradient for the progress arc
    const progressGradient = defs.append("linearGradient")
      .attr("id", "progressGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "100%").attr("y2", "0%");
    progressGradient.append("stop").attr("offset", "0%").attr("stop-color", "#8e44ad");
    progressGradient.append("stop").attr("offset", "100%").attr("stop-color", "#c39bd3");

    // Glow filter for a magical aura
    const glowFilter = defs.append("filter")
      .attr("id", "glow");
    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");
    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "blur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Filter for an ornamental ring glow
    const ringGlow = defs.append("filter")
      .attr("id", "ringGlow");
    ringGlow.append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "ringBlur");
    const feMerge2 = ringGlow.append("feMerge");
    feMerge2.append("feMergeNode").attr("in", "ringBlur");
    feMerge2.append("feMergeNode").attr("in", "SourceGraphic");

    // Create a centered group element
    const g = svg.append("g")
      .attr("transform", `translate(${centerX},${centerY})`);

    // Background gauge arc (full gauge)
    const backgroundArc = arc<DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(endAngle);

    // Progress arc (indicating current streak)
    const progressArc = arc<DefaultArcObject>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle(progressAngle);

    // Ornamental outer ring (a decorative border outside the gauge)
    const ornamentalArc = arc<DefaultArcObject>()
      .innerRadius(outerRadius + 8)
      .outerRadius(outerRadius + 12)
      .startAngle(startAngle)
      .endAngle(endAngle);

    // Append background arc with gradient and glow
    g.append("path")
      .attr("d", backgroundArc({} as DefaultArcObject)!)
      .attr("fill", "url(#bgGradient)")
      .attr("filter", "url(#glow)");

    // Append progress arc with gradient and glow
    g.append("path")
      .attr("d", progressArc({} as DefaultArcObject)!)
      .attr("fill", "url(#progressGradient)")
      .attr("filter", "url(#glow)");

    // Append ornamental ring with subtle glow
    g.append("path")
      .attr("d", ornamentalArc({} as DefaultArcObject)!)
      .attr("fill", "none")
      .attr("stroke", "#c39bd3")
      .attr("stroke-width", 3)
      .attr("filter", "url(#ringGlow)");

    // Add a central circle for refined detail
    g.append("circle")
      .attr("r", 6)
      .attr("fill", "#ecf0f1")
      .attr("filter", "url(#glow)");

    // Display the streak value in the center with a fantasy-style font
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "#ecf0f1")
      .style("font-size", "28px")
      .style("font-family", "'Cinzel', serif")
      .text(`${streak} / ${maxStreak}`);
  }, [width, height, streak, maxStreak]);

  return (
    <div className="streak-meter">
      <svg
        ref={svgRef}
        width={width}
        height={height}
      />
    </div>
  );
};

export default StreakMeter;
