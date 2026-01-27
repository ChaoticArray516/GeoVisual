import React, { useState, useMemo } from 'react';
import { Settings2, BookOpen, Calculator, Ruler, Target, Globe, Box } from 'lucide-react';
import './App.css';

/**
 * Geometric Analytical Rendering Engine
 * Core Logic: Analytical surface algorithm based on normal vectors and projection depth
 */
const Engine = {
  ROTATION: { x: -25, y: -35 }, // Optimized fixed viewing angle

  // 3D projection: map spatial points to screen coordinates
  project(x, y, z) {
    const radX = (this.ROTATION.x * Math.PI) / 180;
    const radY = (this.ROTATION.y * Math.PI) / 180;

    // Rotate around Y-axis (horizontal rotation)
    let nx = x * Math.cos(radY) + z * Math.sin(radY);
    let nz = -x * Math.sin(radY) + z * Math.cos(radY);

    // Rotate around X-axis (pitch rotation)
    let ny = y * Math.cos(radX) - nz * Math.sin(radX);
    let fz = y * Math.sin(radX) + nz * Math.cos(radX); // Projected depth Z

    return { x: nx, y: ny, z: fz };
  },

  // Determine if face is front-facing (based on screen space cross product)
  isFrontFacing(p1, p2, p3) {
    // In SVG coordinate system (Y-axis down), clockwise points with nz < 0 indicate front face
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y };
    const nz = v1.x * v2.y - v1.y * v2.x;
    return nz < 0;
  }
};

/**
 * Shape Generator: Generate normalized vertices and face indices
 */
const ShapeGenerator = {
  getCircle(r, y, segments = 64) {
    return Array.from({ length: segments }).map((_, i) => {
      const ang = (i * 2 * Math.PI) / segments;
      return { x: r * Math.cos(ang), y: y, z: r * Math.sin(ang) };
    });
  },

  generate(type, p) {
    let vertices = [], faces = [];

    switch (type) {
      case 'pent_prism': {
        const R = p.side / (2 * Math.sin(Math.PI / 5));
        const top = this.getCircle(R, -p.height / 2, 5);
        const bot = this.getCircle(R, p.height / 2, 5);
        vertices = [...top, ...bot];
        // Ensure face point sets are in consistent clockwise/counterclockwise order for external viewing
        faces = [[0, 1, 2, 3, 4], [9, 8, 7, 6, 5]]; // top/bottom
        for (let i = 0; i < 5; i++) faces.push([i, (i + 1) % 5, (i + 1) % 5 + 5, i + 5]); // sides
        break;
      }
      case 'cube': {
        const l = p.length / 2, w = p.width / 2, h = p.height / 2;
        vertices = [[-l,-h,-w],[l,-h,-w],[l,h,-w],[-l,h,-w],[-l,-h,w],[l,-h,w],[l,h,w],[-l,h,w]].map(v=>({x:v[0],y:v[1],z:v[2]}));
        faces = [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
        break;
      }
      case 'pyramid':
      case 'tri_pyramid': {
        const sides = type === 'pyramid' ? 4 : 3;
        const R = p.side / (2 * Math.sin(Math.PI / sides));
        const apex = { x: 0, y: -p.height / 2, z: 0 };
        const bot = this.getCircle(R, p.height / 2, sides);
        vertices = [apex, ...bot];
        faces = [Array.from({length: sides}, (_, i) => sides - i)];
        for (let i = 0; i < sides; i++) faces.push([0, i + 1, (i + 1) % sides + 1]);
        break;
      }
      case 'cylinder':
      case 'frustum': {
        const rt = type === 'cylinder' ? p.radius : p.radius2;
        const rb = p.radius;
        const segs = 48;
        const top = this.getCircle(rt, -p.height / 2, segs);
        const bot = this.getCircle(rb, p.height / 2, segs);
        vertices = [...top, ...bot];
        for (let i = 0; i < segs; i++) faces.push([i, (i + 1) % segs, (i + 1) % segs + segs, i + segs]);
        faces.push(Array.from({length: segs}, (_, i) => i));
        faces.push(Array.from({length: segs}, (_, i) => segs*2-1-i));
        break;
      }
      case 'cone': {
        // Educational style cone: apex + base circle with fewer segments
        const segs = 24; // Fewer segments for cleaner educational diagram
        const apex = { x: 0, y: -p.height / 2, z: 0 };
        const bot = this.getCircle(p.radius, p.height / 2, segs);
        vertices = [apex, ...bot];
        // Triangular faces from apex to base edges
        for (let i = 0; i < segs; i++) {
          faces.push([0, i + 1, (i + 1) % segs + 1]);
        }
        // Base circle face (all base vertices in order)
        faces.push(Array.from({length: segs}, (_, i) => segs - i));
        break;
      }
      case 'sphere': {
        const latS = 10, lonS = 16;
        for (let i = 0; i <= latS; i++) {
          const lat = (i * Math.PI) / latS - Math.PI / 2;
          const y = p.radius * Math.sin(lat), r = p.radius * Math.cos(lat);
          vertices.push(...this.getCircle(r, y, lonS));
        }
        for (let i = 0; i < latS; i++) {
          for (let j = 0; j < lonS; j++) {
            const c = i*lonS+j, n = i*lonS+(j+1)%lonS, bc = (i+1)*lonS+j, bn = (i+1)*lonS+(j+1)%lonS;
            faces.push([c, n, bn, bc]);
          }
        }
        break;
      }
      default: break;
    }
    return { vertices, faces };
  }
};

const GeometryLab = () => {
  const [shape, setShape] = useState('pent_prism');
  const [params, setParams] = useState({ radius: 70, radius2: 40, height: 140, side: 100, length: 150, width: 100 });

  const shapeTypes = [
    { id: 'cylinder', label: 'Cylinder' }, { id: 'frustum', label: 'Frustum' },
    { id: 'cone', label: 'Cone' }, { id: 'cube', label: 'Cuboid' },
    { id: 'pent_prism', label: 'Pentagonal Prism' }, { id: 'pyramid', label: 'Square Pyramid' },
    { id: 'tri_pyramid', label: 'Triangular Pyramid' }, { id: 'sphere', label: 'Sphere' }
  ];

  const renderData = useMemo(() => {
    const { vertices, faces } = ShapeGenerator.generate(shape, params);
    const projectedPts = vertices.map(v => Engine.project(v.x, v.y, v.z));

    // Special handling for pentagonal prism - proper geometric drawing style
    if (shape === 'pent_prism') {
      // Process all faces normally first
      const processedFaces = faces.map((idxSet, i) => {
        const pts = idxSet.map(idx => projectedPts[idx]);
        const isFront = Engine.isFrontFacing(pts[0], pts[1], pts[2]);
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        return { idxSet, isFront, avgZ, id: i };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // Edge processing for all faces
      const edgeMap = new Map();
      processedFaces.forEach(face => {
        const n = face.idxSet.length;
        for (let i = 0; i < n; i++) {
          const v1 = face.idxSet[i], v2 = face.idxSet[(i + 1) % n];
          const key = [v1, v2].sort().join('-');
          const existing = edgeMap.get(key) || { isVisible: false, p1: projectedPts[v1], p2: projectedPts[v2], v1, v2 };
          if (face.isFront) existing.isVisible = true;
          edgeMap.set(key, existing);
        }
      });

      const renderedFaces = [];
      const renderedHiddenEdges = [];
      const renderedVisibleEdges = [];

      // Render all faces with fill
      processedFaces.forEach((f) => {
        const pathData = f.idxSet.map((idx, j) => `${j === 0 ? 'M' : 'L'} ${projectedPts[idx].x} ${projectedPts[idx].y}`).join(' ') + ' Z';
        renderedFaces.push(
          <path key={`f-${f.id}`} d={pathData} fill="url(#grad)" fillOpacity={f.isFront ? 0.3 : 0.05} />
        );
      });

      // Collect visibility patterns for top and bottom edges
      const topEdgeVisibility = [];
      const bottomEdgeVisibility = [];

      Array.from(edgeMap.values()).forEach((edge) => {
        const { v1, v2 } = edge;
        const isTopEdge = v1 < 5 && v2 < 5;
        const isBottomEdge = v1 >= 5 && v2 >= 5;

        if (isTopEdge) {
          topEdgeVisibility.push(edge.isVisible);
        } else if (isBottomEdge) {
          bottomEdgeVisibility.push(edge.isVisible);
        }
      });

      // Swap the visibility patterns between top and bottom
      let topIndex = 0;
      let bottomIndex = 0;

      Array.from(edgeMap.values()).forEach((edge, i) => {
        const { v1, v2 } = edge;
        const isTopEdge = v1 < 5 && v2 < 5;
        const isBottomEdge = v1 >= 5 && v2 >= 5;

        let finalVisibility = edge.isVisible;

        if (isTopEdge && topIndex < bottomEdgeVisibility.length) {
          // Top edge uses bottom's visibility pattern
          finalVisibility = bottomEdgeVisibility[topIndex];
          topIndex++;
        } else if (isBottomEdge && bottomIndex < topEdgeVisibility.length) {
          // Bottom edge uses top's visibility pattern
          finalVisibility = topEdgeVisibility[bottomIndex];
          bottomIndex++;
        }

        const line = (
          <line key={`e-${i}`} x1={edge.p1.x} y1={edge.p1.y} x2={edge.p2.x} y2={edge.p2.y}
            stroke="#3b82f6" strokeWidth={finalVisibility ? 2.5 : 1}
            strokeDasharray={finalVisibility ? "0" : "5,5"} opacity={finalVisibility ? 1 : 0.3} />
        );
        if (finalVisibility) renderedVisibleEdges.push(line);
        else renderedHiddenEdges.push(line);
      });

      return {
        renderedFaces,
        renderedHiddenEdges,
        renderedVisibleEdges
      };
    }

    // Special handling for pyramid (square pyramid) - all solid lines except back edge
    if (shape === 'pyramid') {
      // Process all faces normally
      const processedFaces = faces.map((idxSet, i) => {
        const pts = idxSet.map(idx => projectedPts[idx]);
        const isFront = Engine.isFrontFacing(pts[0], pts[1], pts[2]);
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        return { idxSet, isFront, avgZ, id: i };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // Edge processing
      const edgeMap = new Map();
      processedFaces.forEach(face => {
        const n = face.idxSet.length;
        for (let i = 0; i < n; i++) {
          const v1 = face.idxSet[i], v2 = face.idxSet[(i + 1) % n];
          const key = [v1, v2].sort().join('-');
          const existing = edgeMap.get(key) || { isVisible: false, p1: projectedPts[v1], p2: projectedPts[v2], v1, v2 };
          if (face.isFront) existing.isVisible = true;
          edgeMap.set(key, existing);
        }
      });

      const renderedFaces = [];
      const renderedHiddenEdges = [];
      const renderedVisibleEdges = [];

      // Render all faces with fill
      processedFaces.forEach((f) => {
        const pathData = f.idxSet.map((idx, j) => `${j === 0 ? 'M' : 'L'} ${projectedPts[idx].x} ${projectedPts[idx].y}`).join(' ') + ' Z';
        renderedFaces.push(
          <path key={`f-${f.id}`} d={pathData} fill="url(#grad)" fillOpacity={f.isFront ? 0.3 : 0.05} />
        );
      });

      // Find the back edge of the base square (the edge with lowest average z depth)
      let backEdge = null;
      let minZ = Infinity;

      Array.from(edgeMap.values()).forEach((edge) => {
        const { v1, v2 } = edge;
        const avgZ = (edge.p1.z + edge.p2.z) / 2;
        // Check if this is a base edge (both vertices are 1-4, not apex 0)
        const isBaseEdge = v1 >= 1 && v2 >= 1 && v1 <= 4 && v2 <= 4;

        if (isBaseEdge && avgZ < minZ) {
          minZ = avgZ;
          backEdge = edge;
        }
      });

      // Render edges - all solid except the back edge which is dashed
      Array.from(edgeMap.values()).forEach((edge, i) => {
        const isBackEdge = edge === backEdge;

        const line = (
          <line key={`e-${i}`} x1={edge.p1.x} y1={edge.p1.y} x2={edge.p2.x} y2={edge.p2.y}
            stroke="#3b82f6" strokeWidth={isBackEdge ? 1 : 2.5}
            strokeDasharray={isBackEdge ? "5,5" : "0"}
            opacity={isBackEdge ? 0.3 : 1} />
        );

        if (isBackEdge) renderedHiddenEdges.push(line);
        else renderedVisibleEdges.push(line);
      });

      return {
        renderedFaces,
        renderedHiddenEdges,
        renderedVisibleEdges
      };
    }

    // Special handling for triangular pyramid - all solid lines except inner edges
    if (shape === 'tri_pyramid') {
      // Process all faces normally
      const processedFaces = faces.map((idxSet, i) => {
        const pts = idxSet.map(idx => projectedPts[idx]);
        const isFront = Engine.isFrontFacing(pts[0], pts[1], pts[2]);
        const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
        return { idxSet, isFront, avgZ, id: i };
      }).sort((a, b) => b.avgZ - a.avgZ);

      // Edge processing
      const edgeMap = new Map();
      processedFaces.forEach(face => {
        const n = face.idxSet.length;
        for (let i = 0; i < n; i++) {
          const v1 = face.idxSet[i], v2 = face.idxSet[(i + 1) % n];
          const key = [v1, v2].sort().join('-');
          const existing = edgeMap.get(key) || { isVisible: false, p1: projectedPts[v1], p2: projectedPts[v2], v1, v2 };
          if (face.isFront) existing.isVisible = true;
          edgeMap.set(key, existing);
        }
      });

      const renderedFaces = [];
      const renderedHiddenEdges = [];
      const renderedVisibleEdges = [];

      // Render all faces with fill
      processedFaces.forEach((f) => {
        const pathData = f.idxSet.map((idx, j) => `${j === 0 ? 'M' : 'L'} ${projectedPts[idx].x} ${projectedPts[idx].y}`).join(' ') + ' Z';
        renderedFaces.push(
          <path key={`f-${f.id}`} d={pathData} fill="url(#grad)" fillOpacity={f.isFront ? 0.3 : 0.05} />
        );
      });

      // Find the two innermost base edges (base edges with lowest z depth)
      const baseEdges = [];
      Array.from(edgeMap.values()).forEach((edge) => {
        const { v1, v2 } = edge;
        const avgZ = (edge.p1.z + edge.p2.z) / 2;
        // Check if this is a base edge (both vertices are 1-3, not apex 0)
        const isBaseEdge = v1 >= 1 && v2 >= 1 && v1 <= 3 && v2 <= 3;
        if (isBaseEdge) {
          baseEdges.push({ edge, avgZ });
        }
      });

      // Sort by z depth and pick the two innermost (lowest z)
      baseEdges.sort((a, b) => a.avgZ - b.avgZ);
      const innermostBaseEdges = baseEdges.slice(0, 2).map(item => item.edge);

      // Find the innermost generatrix (edge from apex to base vertex with lowest z depth)
      let innermostGen = null;
      let minZ = Infinity;

      Array.from(edgeMap.values()).forEach((edge) => {
        const { v1, v2 } = edge;
        const avgZ = (edge.p1.z + edge.p2.z) / 2;
        // Check if this is a generatrix (one vertex is apex 0, other is base 1-3)
        const isGeneratrix = (v1 === 0 && v2 >= 1 && v2 <= 3) || (v2 === 0 && v1 >= 1 && v1 <= 3);

        if (isGeneratrix && avgZ < minZ) {
          minZ = avgZ;
          innermostGen = edge;
        }
      });

      // Render edges - all solid except innermost edges which are dashed
      Array.from(edgeMap.values()).forEach((edge, i) => {
        const isInnerEdge = innermostBaseEdges.includes(edge) || edge === innermostGen;

        const line = (
          <line key={`e-${i}`} x1={edge.p1.x} y1={edge.p1.y} x2={edge.p2.x} y2={edge.p2.y}
            stroke="#3b82f6" strokeWidth={isInnerEdge ? 1 : 2.5}
            strokeDasharray={isInnerEdge ? "5,5" : "0"}
            opacity={isInnerEdge ? 0.3 : 1} />
        );

        if (isInnerEdge) renderedHiddenEdges.push(line);
        else renderedVisibleEdges.push(line);
      });

      return {
        renderedFaces,
        renderedHiddenEdges,
        renderedVisibleEdges
      };
    }

    // Special handling for cone - simple educational style
    if (shape === 'cone') {
      const segs = 24;
      const baseVertices = projectedPts.slice(1); // Skip apex
      const apex = projectedPts[0];

      // Find leftmost and rightmost points for the two generatrix lines
      let leftmostIdx = 0, rightmostIdx = 0;
      baseVertices.forEach((v, i) => {
        if (v.x < baseVertices[leftmostIdx].x) leftmostIdx = i;
        if (v.x > baseVertices[rightmostIdx].x) rightmostIdx = i;
      });

      // Find frontmost and backmost points for base ellipse
      let frontmostIdx = 0, backmostIdx = 0;
      baseVertices.forEach((v, i) => {
        if (v.z > baseVertices[frontmostIdx].z) frontmostIdx = i;
        if (v.z < baseVertices[backmostIdx].z) backmostIdx = i;
      });

      // Generate base ellipse path - split into two arcs
      // Left arc: from leftmost to rightmost going through back
      const leftArc = [];
      const rightArc = [];

      for (let i = 0; i < segs; i++) {
        const idx = (leftmostIdx + i) % segs;
        if (idx === rightmostIdx) {
          leftArc.push(baseVertices[idx]);
          break;
        }
        leftArc.push(baseVertices[idx]);
      }

      for (let i = 0; i < segs; i++) {
        const idx = (rightmostIdx + i) % segs;
        if (idx === leftmostIdx) {
          rightArc.push(baseVertices[idx]);
          break;
        }
        rightArc.push(baseVertices[idx]);
      }

      // Determine which arc is front (solid/outer) and which is back (dashed/inner)
      const leftArcAvgZ = leftArc.reduce((sum, v) => sum + v.z, 0) / leftArc.length;
      const rightArcAvgZ = rightArc.reduce((sum, v) => sum + v.z, 0) / rightArc.length;

      const frontArc = leftArcAvgZ > rightArcAvgZ ? leftArc : rightArc; // Outer (closer to viewer)
      const backArc = leftArcAvgZ > rightArcAvgZ ? rightArc : leftArc; // Inner (farther from viewer)

      // Create paths for arcs
      const frontPathData = frontArc.map((pt, j) => `${j === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
      const backPathData = backArc.map((pt, j) => `${j === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

      // Create filled faces for the membrane effect
      // Front/outer arc gets darker fill, Back/inner arc gets lighter fill
      const filledFaces = [
        <path key="fill-front" d={`M ${apex.x} ${apex.y} L ${frontArc.map(pt => `${pt.x} ${pt.y}`).join(' L ')} Z`}
          fill="url(#grad)" fillOpacity={0.3} stroke="none" />,
        <path key="fill-back" d={`M ${apex.x} ${apex.y} L ${backArc.map(pt => `${pt.x} ${pt.y}`).join(' L ')} Z`}
          fill="url(#grad)" fillOpacity={0.15} stroke="none" />
      ];

      const baseArcs = [
        <path key="base-back" d={backPathData}
          fill="none" stroke="#3b82f6" strokeWidth={1.5}
          strokeDasharray="5,5" opacity={0.4} />,
        <path key="base-front" d={frontPathData}
          fill="none" stroke="#3b82f6" strokeWidth={2.5}
          opacity={1} />
      ];

      // Two generatrix lines from apex to leftmost and rightmost base points
      const generatrixLines = [
        <line key="gen-left"
          x1={apex.x} y1={apex.y} x2={baseVertices[leftmostIdx].x} y2={baseVertices[leftmostIdx].y}
          stroke="#3b82f6" strokeWidth={2.5} opacity={1} />,
        <line key="gen-right"
          x1={apex.x} y1={apex.y} x2={baseVertices[rightmostIdx].x} y2={baseVertices[rightmostIdx].y}
          stroke="#3b82f6" strokeWidth={2.5} opacity={1} />
      ];

      return {
        renderedFaces: filledFaces,
        renderedHiddenEdges: [],
        renderedVisibleEdges: [...baseArcs, ...generatrixLines]
      };
    }

    // Special handling for cylinder and frustum - simple educational style
    if (shape === 'cylinder' || shape === 'frustum') {
      const segs = 48;
      const topVertices = projectedPts.slice(0, segs);
      const bottomVertices = projectedPts.slice(segs, segs * 2);

      // Find leftmost and rightmost points for generatrix lines
      let leftmostTopIdx = 0, rightmostTopIdx = 0;
      let leftmostBotIdx = 0, rightmostBotIdx = 0;

      topVertices.forEach((v, i) => {
        if (v.x < topVertices[leftmostTopIdx].x) leftmostTopIdx = i;
        if (v.x > topVertices[rightmostTopIdx].x) rightmostTopIdx = i;
      });

      bottomVertices.forEach((v, i) => {
        if (v.x < bottomVertices[leftmostBotIdx].x) leftmostBotIdx = i;
        if (v.x > bottomVertices[rightmostBotIdx].x) rightmostBotIdx = i;
      });

      // Top circle - all solid (fully visible)
      const topPathData = topVertices.map((pt, j) => `${j === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ') + ' Z';
      const topCircle = (
        <path key="top-circle" d={topPathData}
          fill="none" stroke="#3b82f6" strokeWidth={2.5} opacity={1} />
      );

      // Bottom circle - split into front (solid) and back (dashed) arcs
      const botLeftArc = [];
      const botRightArc = [];

      for (let i = 0; i < segs; i++) {
        const idx = (leftmostBotIdx + i) % segs;
        if (idx === rightmostBotIdx) {
          botLeftArc.push(bottomVertices[idx]);
          break;
        }
        botLeftArc.push(bottomVertices[idx]);
      }

      for (let i = 0; i < segs; i++) {
        const idx = (rightmostBotIdx + i) % segs;
        if (idx === leftmostBotIdx) {
          botRightArc.push(bottomVertices[idx]);
          break;
        }
        botRightArc.push(bottomVertices[idx]);
      }

      const botLeftArcAvgZ = botLeftArc.reduce((sum, v) => sum + v.z, 0) / botLeftArc.length;
      const botRightArcAvgZ = botRightArc.reduce((sum, v) => sum + v.z, 0) / botRightArc.length;

      const botFrontArc = botLeftArcAvgZ > botRightArcAvgZ ? botLeftArc : botRightArc; // Outer (bottom front)
      const botBackArc = botLeftArcAvgZ > botRightArcAvgZ ? botRightArc : botLeftArc; // Inner (bottom back)

      const botFrontPathData = botFrontArc.map((pt, j) => `${j === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');
      const botBackPathData = botBackArc.map((pt, j) => `${j === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

      // Create filled faces for the membrane effect
      // Top: darker (outer visible), Bottom front: lighter (inner), Sides: outer darker, inner lighter
      const filledFaces = [
        <path key="fill-top" d={topPathData}
          fill="url(#grad)" fillOpacity={0.3} stroke="none" />,
        <path key="fill-bot-front" d={botFrontPathData + ' Z'}
          fill="url(#grad)" fillOpacity={0.1} stroke="none" />,
        <path key="fill-side-left"
          d={`M ${topVertices[leftmostTopIdx].x} ${topVertices[leftmostTopIdx].y} L ${botLeftArc.map(pt => `${pt.x} ${pt.y}`).join(' L ')} L ${topVertices[leftmostTopIdx].x} ${topVertices[leftmostTopIdx].y} Z`}
          fill="url(#grad)" fillOpacity={0.25} stroke="none" />,
        <path key="fill-side-right"
          d={`M ${topVertices[rightmostTopIdx].x} ${topVertices[rightmostTopIdx].y} L ${botRightArc.map(pt => `${pt.x} ${pt.y}`).join(' L ')} L ${topVertices[rightmostTopIdx].x} ${topVertices[rightmostTopIdx].y} Z`}
          fill="url(#grad)" fillOpacity={0.15} stroke="none" />
      ];

      const bottomArcs = [
        <path key="bot-back" d={botBackPathData}
          fill="none" stroke="#3b82f6" strokeWidth={1.5}
          strokeDasharray="5,5" opacity={0.4} />,
        <path key="bot-front" d={botFrontPathData}
          fill="none" stroke="#3b82f6" strokeWidth={2.5}
          opacity={1} />
      ];

      // Two generatrix lines (left and right)
      const generatrixLines = [
        <line key="gen-left"
          x1={topVertices[leftmostTopIdx].x} y1={topVertices[leftmostTopIdx].y}
          x2={bottomVertices[leftmostBotIdx].x} y2={bottomVertices[leftmostBotIdx].y}
          stroke="#3b82f6" strokeWidth={2.5} opacity={1} />,
        <line key="gen-right"
          x1={topVertices[rightmostTopIdx].x} y1={topVertices[rightmostTopIdx].y}
          x2={bottomVertices[rightmostBotIdx].x} y2={bottomVertices[rightmostBotIdx].y}
          stroke="#3b82f6" strokeWidth={2.5} opacity={1} />
      ];

      return {
        renderedFaces: filledFaces,
        renderedHiddenEdges: [],
        renderedVisibleEdges: [topCircle, ...bottomArcs, ...generatrixLines]
      };
    }

    // 1. Face processing and depth sorting (Painter's Algorithm)
    const processedFaces = faces.map((idxSet, i) => {
      const pts = idxSet.map(idx => projectedPts[idx]);
      const isFront = Engine.isFrontFacing(pts[0], pts[1], pts[2]);
      const avgZ = pts.reduce((s, p) => s + p.z, 0) / pts.length;
      return { idxSet, isFront, avgZ, id: i };
    }).sort((a, b) => b.avgZ - a.avgZ);

    // 2. Edge processing: logic is "visible edge = edge belonging to at least one front-facing face"
    const edgeMap = new Map();
    processedFaces.forEach(face => {
      const n = face.idxSet.length;
      for (let i = 0; i < n; i++) {
        const v1 = face.idxSet[i], v2 = face.idxSet[(i + 1) % n];
        const key = [v1, v2].sort().join('-');
        const existing = edgeMap.get(key) || { isVisible: false, p1: projectedPts[v1], p2: projectedPts[v2] };
        if (face.isFront) existing.isVisible = true;
        edgeMap.set(key, existing);
      }
    });

    const renderedFaces = processedFaces.map((f) => {
      const pathData = f.idxSet.map((idx, j) => `${j === 0 ? 'M' : 'L'} ${projectedPts[idx].x} ${projectedPts[idx].y}`).join(' ') + ' Z';
      return <path key={`f-${f.id}`} d={pathData} fill="url(#grad)" fillOpacity={f.isFront ? 0.3 : 0.05} />;
    });

    // Separate visible/hidden edges, ensure rendering layers (hidden lines at bottom, visible lines at top)
    const renderedHiddenEdges = [];
    const renderedVisibleEdges = [];

    Array.from(edgeMap.values()).forEach((edge, i) => {
      const line = (
        <line key={`e-${i}`} x1={edge.p1.x} y1={edge.p1.y} x2={edge.p2.x} y2={edge.p2.y}
          stroke="#3b82f6" strokeWidth={edge.isVisible ? 2.5 : 1}
          strokeDasharray={edge.isVisible ? "0" : "5,5"} opacity={edge.isVisible ? 1 : 0.3} />
      );
      if (edge.isVisible) renderedVisibleEdges.push(line);
      else renderedHiddenEdges.push(line);
    });

    return { renderedFaces, renderedHiddenEdges, renderedVisibleEdges };
  }, [shape, params]);

  const calc = useMemo(() => {
    const { radius: r, radius2: r2, height: h, side: a, length: l, width: w } = params;
    const PI = Math.PI;
    const res = {
      pent_prism: { v: 1.720477 * a*a * h, s: 3.44095 * a*a + 5*a*h, fV: 'V = Bh', fS: 'S = 2B + 5ah', fb: 'B = 5a²/4tan(36°)' },
      frustum: { v: (1/3)*PI*h*(r*r + r2*r2 + r*r2), s: PI*(r*r+r2*r2+(r+r2)*Math.sqrt((r-r2)**2+h**2)), fV: 'V = 1/3πh(r₁²+r₂²+r₁r₂)', fS: 'S = π(r₁²+r₂²+(r₁+r₂)l)' },
      cylinder: { v: PI*r*r*h, s: 2*PI*r*(r+h), fV: 'V = πr²h', fS: 'S = 2πr(r+h)' },
      cone: { v: (1/3)*PI*r*r*h, s: PI*r*(r+Math.sqrt(r*r+h*h)), fV: 'V = 1/3πr²h', fS: 'S = πr(r+l)' },
      cube: { v: l*w*h, s: 2*(l*w+l*h+w*h), fV: 'V = l·w·h', fS: 'S = 2(lw+lh+wh)' },
      pyramid: { v: (1/3)*a*a*h, s: a*a + 2*a*Math.sqrt((a/2)**2+h**2), fV: 'V = 1/3a²h', fS: 'S = a² + 2al' },
      tri_pyramid: { v: (Math.sqrt(3)/12)*a*a*h, s: (Math.sqrt(3)/4)*a*a+1.5*a*Math.sqrt((a/(2*Math.sqrt(3)))**2+h**2), fV: 'V = 1/3Bh', fS: 'S = B + 3/2al' },
      sphere: { v: (4/3)*PI*r**3, s: 4*PI*r*r, fV: 'V = 4/3πr³', fS: 'S = 4πr²' }
    };
    return res[shape] || res.cube;
  }, [shape, params]);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans flex flex-col selection:bg-blue-500/30">
      <header className="max-w-7xl w-full mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-6 z-20">
        <div>
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent uppercase italic">
            GeoVisual
          </h1>
          <p className="text-[10px] text-slate-500 font-bold mt-1 tracking-widest uppercase flex items-center gap-1">
            <Box size={12} className="text-blue-600" /> Advanced Analytical Geometry Engine • Precise Visible/Hidden Line Separation
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-white/5 backdrop-blur-md">
          {shapeTypes.map(s => (
            <button key={s.id} onClick={() => setShape(s.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all uppercase ${
                shape === s.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
              }`}>
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md shadow-2xl">
            <h2 className="flex items-center gap-2 mb-8 text-[10px] font-black uppercase text-slate-500 tracking-widest">
              <Settings2 size={14} className="text-blue-400" /> Parameter Control
            </h2>
            <div className="space-y-8">
              {shape === 'cube' && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Length L</span><span>{params.length}</span></div>
                    <input type="range" min="40" max="220" value={params.length} onChange={(e) => setParams({...params, length: +e.target.value})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Width W</span><span>{params.width}</span></div>
                    <input type="range" min="40" max="220" value={params.width} onChange={(e) => setParams({...params, width: +e.target.value})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
                  </div>
                </>
              )}
              {['cylinder', 'frustum', 'cone', 'sphere'].includes(shape) && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Radius R</span><span>{params.radius}</span></div>
                  <input type="range" min="30" max="120" value={params.radius} onChange={(e) => setParams({...params, radius: +e.target.value})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
              )}
              {shape === 'frustum' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Top Radius R₂</span><span>{params.radius2}</span></div>
                  <input type="range" min="0" max="120" value={params.radius2} onChange={(e) => setParams({...params, radius2: +e.target.value})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                </div>
              )}
              {shape !== 'sphere' && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Height H</span><span>{params.height}</span></div>
                  <input type="range" min="40" max="220" value={params.height} onChange={(e) => setParams({...params, height: +e.target.value})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
              )}
              {['pent_prism', 'pyramid', 'tri_pyramid'].includes(shape) && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>Base Edge a</span><span>{params.side}</span></div>
                  <input type="range" min="40" max="180" value={params.side} onChange={(e) => setParams({...params, side: +e.target.value})} className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                </div>
              )}
            </div>
          </section>

          <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md">
            <h3 className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase text-indigo-400 tracking-widest">
              <BookOpen size={14} /> Mathematical Derivation
            </h3>
            <div className="space-y-4 font-serif italic text-center text-slate-300">
               {calc.fb && <div className="p-3 bg-blue-900/20 rounded-xl border border-blue-500/20 text-xs text-blue-200 non-italic">{calc.fb}</div>}
               <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-xl font-bold">{calc.fV}</div>
               <div className="p-4 bg-slate-950/40 rounded-xl border border-white/5 text-xl font-bold text-blue-300">{calc.fS}</div>
            </div>
            <div className="mt-6 p-4 bg-slate-950/20 rounded-xl border border-white/5 grid grid-cols-2 gap-4">
               <div><p className="text-[10px] text-slate-500 uppercase font-sans">Volume</p><p className="text-lg font-mono">{calc.v.toLocaleString(undefined, {maximumFractionDigits:1})}</p></div>
               <div><p className="text-[10px] text-slate-500 uppercase font-sans">Area</p><p className="text-lg font-mono text-cyan-400">{calc.s.toLocaleString(undefined, {maximumFractionDigits:1})}</p></div>
            </div>
          </section>
        </aside>

        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-[#0a0e1a] border border-white/5 rounded-[3rem] relative flex items-center justify-center overflow-hidden shadow-inner group">
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
            <svg width="100%" height="100%" viewBox="-300 -300 600 600" preserveAspectRatio="xMidYMid meet" className="relative z-10 transition-transform duration-500">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* Render by layers: hidden lines -> filled faces -> visible lines */}
              <g>{renderData.renderedHiddenEdges}</g>
              <g>{renderData.renderedFaces}</g>
              <g>{renderData.renderedVisibleEdges}</g>
            </svg>
            <div className="absolute bottom-8 px-5 py-2 bg-slate-900/80 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
              <Ruler size={12} className="text-blue-500" /> Analytical "Parsed Surface" Rendering Engine
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-white/5">
              <h4 className="flex items-center gap-2 text-[11px] font-bold text-blue-400 uppercase tracking-widest mb-3">
                <Target size={14} /> Spatial Analytical Features
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light italic">The normal vector-based detection algorithm has been optimized. Solid lines define visible contours, dashed lines reveal internal spatial structure. This "analytical surface" presentation best aligns with engineering mechanics and solid geometry cognitive patterns.</p>
            </div>
            <div className="bg-slate-900/30 p-8 rounded-[2rem] border border-white/5">
              <h4 className="flex items-center gap-2 text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-3">
                <Globe size={14} /> Model Application Value
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light italic">Precise visible/hidden line separation is fundamental to high-quality math courseware and 3D design software (e.g., AutoCAD), helping learners establish robust spatial coordinate system intuition.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GeometryLab;
