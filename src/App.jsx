import React, { useState, useMemo, useEffect } from 'react';
import { Settings2, Calculator, Ruler, Target, Globe, Box } from 'lucide-react';
import './App.css';
// Import premium components
import PremiumSpherePage from './components/premiumPages/PremiumSpherePage';
import PremiumConePage from './components/premiumPages/PremiumConePage';
import PremiumCylinderPage from './components/premiumPages/PremiumCylinderPage';
import PremiumCubePage from './components/premiumPages/PremiumCubePage';
import PremiumPythagoreanPage from './components/premiumPages/PremiumPythagoreanPage';
import PythagoreanVisualization from './components/PythagoreanVisualization';
import FAQSection from './components/FAQSection';

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
  const [shape, setShape] = useState('sphere');
  const [params, setParams] = useState({ radius: 70, height: 140, length: 150, width: 100 });
  const [pythagoreanSides, setPythagoreanSides] = useState({ sideA: 3, sideB: 4 });

  const shapeTypes = [
    { id: 'sphere', label: 'Sphere' },
    { id: 'cone', label: 'Cone' },
    { id: 'cylinder', label: 'Cylinder' },
    { id: 'cube', label: 'Cuboid' },
    { id: 'pythagorean', label: 'Pythagorean' }
  ];

  // Dynamic meta tags for SEO (Requirement 3)
  useEffect(() => {
    const metadata = {
      cylinder: {
        // Old: "Cylinder Volume Calculator & Geometry Formulas | Interactive 3D Tools | GeoVisual"
        title: "Volume of a Cylinder Calculator | Interactive 3D Tools | CalcVisual",
        // Old: "Interactive cylinder volume calculator. Calculate volume of a cylinder instantly with radius and height adjustment. Learn cylinder volume formula V = πr²h with visual proofs and step-by-step solutions."
        description: "Calculate volume of a cylinder instantly with radius and height adjustment. Learn cylinder volume formula V = πr²h with visual proofs and step-by-step solutions. Free 3D calculator.",
        ogImage: "/og-cylinder.png"
      },
      frustum: {
        title: "Frustum Volume Calculator | Geometry Formulas Reference | CalcVisual",
        // Old: "Calculate frustum volume with interactive geometry formula sheet. Understand general geometry formulas and equations for geometry. Volume formula V = (1/3)πh(r₁²+r₂²+r₁r₂) explained."
        description: "Calculate frustum volume with interactive tools. Learn frustum volume formula V = (1/3)πh(r₁²+r₂²+r₁r₂) with step-by-step solutions. Free 3D calculator.",
        ogImage: "/og-frustum.png"
      },
      cone: {
        // Old: "Cone Volume Calculator & Geometry Formulas | Interactive 3D Visualizer | GeoVisual"
        title: "Cone Geometry Formulas & Volume Calculator | Interactive 3D Visualizer | CalcVisual",
        // Old: "Interactive cone calculator with cone geometry formulas. Access area formulas for all shapes. Learn cone volume formula V = (1/3)πr²h and surface area with slant height. Interactive 3D model."
        description: "Interactive cone calculator with geometry formulas. Learn cone volume V = (1/3)πr²h and surface area with slant height. Adjust radius and height in real-time. Free 3D visualizer.",
        ogImage: "/og-cone.png"
      },
      cube: {
        // Old: "Cube Volume Calculator & Geometry Formulas | Cuboid Volume Formula | GeoVisual"
        title: "Volume of a Cube Calculator | Interactive 3D Visualizer | CalcVisual",
        // Old: "Interactive cube volume calculator. Calculate volume of a cube instantly with length, width, height adjustment. Learn cuboid volume formula V = l·w·h with visual demonstrations."
        description: "Calculate volume of a cube instantly with length, width, height adjustment. Learn cuboid volume formula V = l·w·h with visual demonstrations. Interactive 3D geometry calculator.",
        ogImage: "/og-cube.png"
      },
      pent_prism: {
        title: "Pentagonal Prism Volume Calculator | Geometry Formulas Guide | CalcVisual",
        // Old: "Calculate pentagonal prism volume with general geometry formulas. Interactive geometry formula sheet with area formulas for all shapes and real-time measurements."
        description: "Calculate pentagonal prism volume with interactive tools. Learn volume formulas and area calculations with real-time 3D measurements. Free calculator.",
        ogImage: "/og-pentagonal.png"
      },
      pyramid: {
        title: "Square Pyramid Volume Calculator | Geometry Formula Sheet | CalcVisual",
        // Old: "Interactive pyramid volume calculator with basic geometry formulas. Access area formulas for all shapes. Learn pyramid volume formula V = (1/3)a²h with 3D model."
        description: "Calculate pyramid volume with interactive tools. Learn pyramid volume formula V = (1/3)a²h and surface area with 3D model. Free geometry calculator.",
        ogImage: "/og-pyramid.png"
      },
      tri_pyramid: {
        title: "Triangular Pyramid Volume Calculator | Geometry Formulas Reference | CalcVisual",
        // Old: "Calculate triangular pyramid volume with complete geometry formula sheet. Interactive equations for geometry and area formulas for all shapes. Tetrahedron volume explained."
        description: "Calculate triangular pyramid volume with interactive tools. Learn tetrahedron volume formulas and surface area with 3D model. Free calculator.",
        ogImage: "/og-tri-pyramid.png"
      },
      sphere: {
        title: "Volume of Sphere Formula | Geometry Formulas | CalcVisual",
        // Old: "Interactive sphere volume calculator with geometry formula sheet. Learn volume of sphere formula V = (4/3)πr³ and area formulas for all shapes. Access basic geometry formulas with interactive 3D demonstrations."
        description: "Interactive sphere volume calculator. Learn volume of sphere formula V = (4/3)πr³ and surface area. Adjust radius in real-time with 3D demonstrations. Free geometry tools.",
        ogImage: "/og-sphere.png"
      },
      pythagorean: {
        // Old: "Pythagorean Theorem Calculator & Visual Proof | Geometry Formulas | GeoVisual"
        title: "What is the Pythagorean Theorem? Calculator & Visual Proof | CalcVisual",
        // Old: "Interactive calculator answering what is the Pythagorean theorem. Learn Pythagorean theorem formula a² + b² = c² with visual proof. Access geometry formulas and famous Pythagorean triples."
        description: "Interactive calculator: what is the Pythagorean theorem? Learn a² + b² = c² with visual proof. Explore famous Pythagorean triples and real-world applications. Free 3D math tools.",
        ogImage: "/og-pythagorean.png"
      }
    };

    const meta = metadata[shape] || metadata.cube;

    // Update document title
    document.title = meta.title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', meta.description);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');

    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    if (ogDesc) ogDesc.setAttribute('content', meta.description);
    if (ogImage) ogImage.setAttribute('content', meta.ogImage);

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const twitterImage = document.querySelector('meta[name="twitter:image"]');

    if (twitterTitle) twitterTitle.setAttribute('content', meta.title);
    if (twitterDesc) twitterDesc.setAttribute('content', meta.description);
    if (twitterImage) twitterImage.setAttribute('content', meta.ogImage);

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://geovisual.com/${shape}`);
  }, [shape]);

  const renderData = useMemo(() => {
    // Skip 3D rendering for Pythagorean theorem (uses 2D visualization instead)
    if (shape === 'pythagorean') {
      return {
        renderedFaces: [],
        renderedHiddenEdges: [],
        renderedVisibleEdges: []
      };
    }

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

  // Educational content for each shape (Requirement 1: HTML content layer for SEO)
  // Function to format educational content with bold formulas and highlighted keywords
  const formatEducationalText = (text, shapeType) => {
    // Common mathematical patterns to bold
    const patterns = [
      // Formulas like V = πr²h, a² + b² = c², etc.
      { regex: /([A-Za-z]\s*=\s*(?:\([^)]+\)\s*)?(?:π)?\s*(?:[A-Za-z]²?|[0-9.]+(?:⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹)?)\s*(?:[+*/-]\s*(?:π)?\s*[A-Za-z0-9.²³¹⁰⁴⁵⁶⁷⁸⁹]+)*)/g, class: 'font-mono-math font-bold text-swiss-black' },
      // Individual variables like V, r, h, a, b, c when used in formulas
      { regex: /\b[Vlrhabcr₁₂]\b/g, class: 'font-mono-math font-bold text-math-blue' },
      // Greek letter π
      { regex: /π/g, class: 'font-serif-display font-bold text-math-blue' },
      // Numbers with superscripts (squared, cubed, etc.)
      { regex: /\d+[²³¹⁰⁴⁵⁶⁷⁸⁹]/g, class: 'font-mono-math font-bold text-swiss-black' },
      // Keywords to highlight (shape-specific and common terms)
      { regex: /\b(volume|radius|height|cylinder|sphere|cone|cube|rectangle|circular base|hypotenuse|Pythagorean theorem|right triangle|formula|surface area)\b/gi, class: 'font-bold text-math-blue' },
      // Important numbers and measurements
      { regex: /\b(2\/3|1\/3|4\/3|3-4-5)\b/g, class: 'font-mono-math font-bold text-swiss-black' },
    ];

    let formattedText = text;

    // Apply each pattern
    patterns.forEach(pattern => {
      formattedText = formattedText.replace(pattern.regex, (match) => {
        return `<span class="${pattern.class}">${match}</span>`;
      });
    });

    return formattedText;
  };

  const educationalContent = useMemo(() => {
    const content = {
      cylinder: {
        title: "Cylinder Volume Calculator & Surface Area Formula",
        introduction: "A cylinder is a three-dimensional solid with two parallel circular bases connected by a curved surface. This geometric shape is one of the most fundamental forms in mathematics and engineering. The cylinder is characterized by its circular base and uniform height, making it a surface of revolution. Calculate cylinder volume instantly with our interactive 3D tool using radius and height parameters. Watch how the volume changes as you adjust the dimensions in real-time!",
        formula: "The volume of a cylinder is calculated using V = πr²h, where V is volume, π (pi) ≈ 3.14159, r is the radius of the circular base, and h is the height. The surface area formula is A = 2πr² + 2πrh, which includes both circular bases (2πr²) and the curved surface (2πrh). This formula is essential for engineering and construction applications. The curved surface area alone is 2πrh, which you can visualize as unrolling the curved side into a rectangle.",
        applications: "Cylinders are everywhere in our daily lives and industrial applications. In transportation: car engine cylinders, hydraulic cylinders, pneumatic systems, and shock absorbers. In construction: water tanks, silos, columns, and pipes. In manufacturing: drums, cans, barrels, and containers. In household items: cups, glasses, candles, and batteries. Understanding cylinder volume helps in engineering design, manufacturing quality control, construction planning, and fluid dynamics calculations. For example, calculating how much liquid a water tank can hold, determining the displacement of an engine, or designing efficient packaging for cylindrical products.",
        derivation: "The formula derivation comes from the method of exhaustion used by ancient Greek mathematicians. Start with a circle of area A = πr² (the base). Imagine stacking infinitely many infinitesimally thin circles from height 0 to height h. The total volume is the integral of the base area over the height: V = ∫πr²dh = πr²h. Alternatively, think of it as adding up all the circular slices: each slice has area πr², and there are h of them (in a unit system where height is measured in units of slice thickness). The curved surface can be 'unrolled' into a rectangle with width equal to the circumference (2πr) and height h, giving area 2πrh. This visualization helps understand why the surface area formula has two parts: the top and bottom circles plus the curved side."
      },
      sphere: {
        title: "Sphere Volume Calculator & Surface Area Formula",
        introduction: "A sphere is a perfectly round three-dimensional object where every point on its surface is equidistant from its center point. This perfect symmetry makes the sphere one of the most important shapes in mathematics and nature. A sphere is completely defined by its radius - the distance from the center to any point on the surface. Calculate sphere volume instantly with our interactive 3D calculator. Adjust the radius slider and watch the sphere grow in real-time! The sphere is the only 3D shape that looks the same from any viewing angle.",
        formula: "The volume of a sphere uses V = (4/3)πr³, where V is volume, π (pi) ≈ 3.14159, and r is the radius. The surface area is A = 4πr². Notice the beautiful relationship: the surface area is the derivative of volume with respect to radius (dV/dr = 4πr² = A). This mathematical elegance was discovered by Archimedes over 2,000 years ago and is considered one of the most beautiful formulas in mathematics. The formula tells us that volume grows with the cube of radius (r³), while surface area grows with the square (r²). This means doubling the radius increases volume by 8 times but surface area only by 4 times!",
        applications: "Spherical shapes minimize surface area for a given volume, which is why bubbles and planets naturally form spheres. In astronomy: planets, stars, moons, and celestial bodies are spherical due to gravity. In physics: atoms, molecules, and particles are often modeled as spheres. In sports: balls (basketball, soccer, tennis, baseball, billiard balls). In engineering: ball bearings, domes, pressure vessels, and water tanks. In nature: raindrops, oranges, marbles, and pearls. Understanding sphere volume is crucial in physics, astronomy, chemistry, biology, and engineering. For example: calculating the volume of a planet, designing spherical tanks for storing gases under pressure, or understanding why large animals have different proportions than small ones (square-cube law).",
        derivation: "Archimedes' discovery is one of the most remarkable insights in mathematics history. He found that a sphere inscribed in a cylinder (touching the sides, top, and bottom) has exactly 2/3 the volume of the cylinder, and exactly the same surface area as the curved surface of the cylinder (including the bases). Since the cylinder volume is πr²h = 2πr³ (when h = 2r, the diameter), the sphere volume is (2/3)(2πr³) = (4/3)πr³. This relationship so impressed Archimedes that he requested a sphere and cylinder be carved on his tombstone. Modern calculus derives this by integrating the area of circular slices: V = ∫π(r² - x²)dx from -r to r, or using the shell method: V = ∫2πx·2√(r² - x²)dx. Archimedes used the 'method of exhaustion' - a precursor to integral calculus - to prove this formula without calculus tools!"
      },
      cone: {
        title: "Cone Volume Calculator & Surface Area Formula",
        introduction: "A cone is a three-dimensional shape with a circular base that tapers smoothly to a single point called the apex or vertex. The cone is a surface of revolution formed by rotating a right triangle around one of its legs. This elegant shape appears throughout nature and human design. Explore cone volume and surface area with our interactive 3D calculator. The right circular cone (where the apex is directly above the center of the base) is the most common type, though oblique cones also exist.",
        formula: "The volume of a cone uses V = (1/3)πr²h, where V is volume, π (pi) ≈ 3.14159, r is the base radius, and h is the perpendicular height from base to apex. The slant height (l) is calculated as l = √(r² + h²). Surface area includes the base (πr²) plus the lateral surface area (πrl): Total A = πr² + πrl = πr(r + l). The 1/3 factor means a cone holds exactly one-third the volume of a cylinder with the same base and height. This is a beautiful geometric relationship you can explore by comparing cone and cylinder volumes in our interactive tool!",
        applications: "Cones are ubiquitous in design and nature. In architecture: pointed arches, spires, roofs (especially on circular buildings), and the famous Louvre Pyramid. In everyday items: ice cream cones, traffic cones, funnels, party hats, and paper cups. In manufacturing: speakers, megaphones, and nozzles (the cone shape directs flow efficiently). In nature: pine cones, termite mounds, and some seashells. In science: light cones in relativity, cone cells in the human eye (for color vision), and volcanic cones. The cone shape is structurally stable and efficient at directing things (light, sound, liquids) toward or away from a point. Understanding cone volume is essential in manufacturing, packaging design, and construction.",
        derivation: "The 1/3 factor in the cone volume formula has multiple beautiful proofs. (1) Cavalieri's Principle: Compare a cone with a pyramid of equal base and height - they have the same volume. Since we know a pyramid is 1/3 of a prism, a cone must be 1/3 of a cylinder. (2) Calculus integration: V = ∫π(r·x/h)²dx from 0 to h = (πr²/h²)∫x²dx = (πr²/h²)(h³/3) = (1/3)πr²h. (3) Physical demonstration: Fill a cone with water or sand and pour it into a cylinder of same dimensions - exactly three cones fill one cylinder! This hands-on proof is used in classrooms worldwide. The ancient Greeks used the 'method of exhaustion' to derive this formula, and it's a classic example of how geometry and calculus connect."
      },
      cube: {
        title: "Cube Volume Calculator & Surface Area Formula",
        introduction: "A cuboid (also called rectangular prism) is a three-dimensional shape with six rectangular faces at right angles to each other. When all edges are equal, it's called a cube. Cuboids are the most common 3D shape in daily life - boxes, rooms, buildings, and containers are all cuboids. Calculate cube and cuboid volume instantly with our interactive 3D calculator using length, width, and height. Adjust the dimensions and watch the volume update in real-time!",
        formula: "The volume formula V = l·w·h multiplies length (l), width (w), and height (h). This simple formula applies to all rectangular boxes, making it fundamental to engineering and construction. Surface area A = 2(lw + lh + wh) - sum of all six faces. For a special case of a cube (all sides equal: l = w = h = s), the formulas simplify to V = s³ and A = 6s². The space diagonal (longest distance between two corners) is d = √(l² + w² + h²), useful for determining if an object will fit diagonally in a box.",
        applications: "From shipping containers to cardboard boxes, from rooms to skyscrapers, cuboid volume calculations are essential. In logistics: calculating shipping costs, warehouse storage capacity, and truck loading. In construction: room sizes, building volumes, concrete pour calculations, and material estimation. In manufacturing: product packaging, box design, and storage optimization. In everyday life: measuring rooms for furniture, calculating aquarium or pool volume, or determining if a TV will fit in your car. The cuboid is the default shape for most manufactured objects because it's easy to design, build, stack, and transport. Understanding cuboid volume is one of the most practical geometry skills!",
        derivation: "The volume formula comes from the area of the base rectangle (A = l·w) multiplied by the height (h). Imagine stacking identical rectangular layers from bottom to top. Each layer has volume l·w (in 2D units), and there are h such layers, giving V = l·w·h. This intuitive approach extends to any prism: volume equals base area times height. For a cube, since all edges are equal (s), the base area is s² and height is s, so V = s³. The surface area is the sum of all six rectangular faces: top and bottom (lw each), front and back (lh each), left and right (wh each), giving A = 2lw + 2lh + 2wh = 2(lw + lh + wh). For a cube, each face is s², so A = 6s². The diagonal formula comes from applying the Pythagorean theorem twice: first on the base diagonal, then from that diagonal to the opposite corner."
      },
      pythagorean: {
        title: "Pythagorean Theorem Calculator & Visual Proof",
        introduction: "The Pythagorean theorem is perhaps the most famous formula in mathematics: in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides (a² + b² = c²). A right triangle has one 90° angle, and the hypotenuse is always the longest side, opposite the right angle. This fundamental relationship connects algebra and geometry and has been used for over 3,000 years. Use the interactive visualization above to explore this relationship! Adjust sides A and B and watch the hypotenuse C update automatically.",
        formula: "The Pythagorean theorem states: a² + b² = c², where 'a' and 'b' are the lengths of the legs (the sides that form the right angle), and 'c' is the length of the hypotenuse (the longest side, opposite the right angle). To find a missing side: c = √(a² + b²) for the hypotenuse, or a = √(c² - b²) for a leg. The converse is also true: if a² + b² = c², then the triangle is a right triangle. Famous Pythagorean triples (integer solutions) include 3-4-5, 5-12-13, 8-15-17, and 7-24-25. These are used in construction to ensure perfect right angles without measuring tools.",
        applications: "The Pythagorean theorem is used everywhere: (1) Construction - ensuring right angles with 3-4-5 triangles, calculating roof slopes, and determining diagonal bracing. (2) Navigation - GPS and trilateration calculate position using distances from multiple satellites. (3) Computer graphics - distance calculations, collision detection, and 3D rendering. (4) Physics - vector analysis, force components, and motion calculations. (5) Engineering - structural analysis, bridge design, and surveying. (6) Everyday problems - finding the length of a ladder needed to reach a window, the diagonal of a TV screen, or the shortest distance across a rectangular field. The theorem extends to higher dimensions (distance in 3D: d² = x² + y² + z²) and is fundamental to trigonometry and calculus.",
        derivation: "There are over 350 known proofs of the Pythagorean theorem! (1) Rearrangement proof - Four identical right triangles form a large square in two different arrangements, proving a² + b² = c² by comparing areas. (2) Similar triangles proof - Dropping an altitude from the right angle creates similar triangles, establishing proportional relationships that lead to the theorem. (3) Euclid's 'windmill' proof (Proposition I.47 in Elements) - A geometric construction showing area equivalence using squares constructed on each side. (4) President Garfield's proof - Uses a trapezoid formed by two right triangles. (5) Algebraic proof - Expands (a+b)² = c² + 4(½ab) to derive the relationship. (6) Differential proof - Shows that small changes in legs relate to changes in hypotenuse. The theorem was known by ancient Babylonians and Egyptians, but Pythagoras (or his students) may have provided the first proof. Chinese and Indian mathematicians also discovered it independently."
      },
      frustum: {
        title: "Frustum Volume Calculator",
        introduction: "A frustum (sometimes called a truncated cone or pyramid) is what remains when you cut the top off a cone or pyramid parallel to its base. The word comes from Latin 'frustum' meaning 'piece' or 'crumb'. This shape appears everywhere: buckets, lamp shades, flower pots, tree trunks, and architectural elements like the Lincoln Memorial. A frustum has two parallel bases of different sizes - a larger bottom base and a smaller top base. The sides are tapered, connecting the two bases. Calculate frustum volume instantly with our interactive 3D tool.",
        formula: "The frustum volume formula V = (1/3)πh(r₁² + r₂² + r₁r₂) accounts for both the bottom radius (r₁), top radius (r₂), and height (h). Notice how it reduces to the cone volume when r₂ = 0 (no top): V = (1/3)πhr₁². The surface area includes the top and bottom circles plus the lateral (side) surface. The slant height l = √(h² + (r₁ - r₂)²) is needed for lateral surface area: A = πr₁² + πr₂² + π(r₁ + r₂)l. This formula is derived from the difference between two cones.",
        applications: "Frustums are incredibly useful in design and engineering. In architecture and construction: roof structures (making buildings narrower at the top), church spires, and monuments. In manufacturing: funnels, buckets, flower pots, lamp shades, and cups. In nature: tree trunks, ant hills, and some seashells. In engineering: transition pieces between pipes of different diameters, reducing gears, and machine components. The frustum shape is structurally stable and efficient at directing flow (liquids, light, or air) from a wide area to a narrow point or vice versa. Understanding frustum volume is essential in manufacturing, packaging design, and construction.",
        derivation: "The formula derives from subtracting the volume of a small cone (removed from top) from a large cone (original). If the original cone had height H and base radius r₁, and we cut it at height h to get top radius r₂, then by similar triangles r₂/(H-h) = r₁/H, so H = hr₁/(r₁ - r₂). The volume is V = (1/3)πr₁²H - (1/3)πr₂²(H-h) = (1/3)πh(r₁² + r₂² + r₁r₂). This elegant relationship shows how the frustum volume depends on all three dimensions. The surface area comes from adding the areas of the two circular bases plus the lateral surface, which can be 'unrolled' into a truncated cone sector."
      },
      pent_prism: {
        title: "Pentagonal Prism Volume Calculator",
        introduction: "A pentagonal prism is a three-dimensional shape with two pentagonal (five-sided) bases connected by five rectangular faces. It belongs to the prism family - shapes with two identical parallel bases connected by rectangular sides. While less common than triangular or rectangular prisms, pentagonal prisms appear in architecture, decorative design, and certain crystals. The regular pentagonal prism has a regular pentagon as its base (all sides equal, all angles equal). Calculate pentagonal prism volume with our interactive calculator.",
        formula: "The volume V = Bh where B is the base area and h is the prism height. For a regular pentagon with side length a, the area is B = (5/4)a²cot(36°) ≈ 1.720a². The perimeter is P = 5a. The surface area includes two pentagonal bases plus five rectangular sides: A = 2B + Ph. The apothem (distance from center to midpoint of a side) is a/(2tan(36°)). These formulas come from dividing the pentagon into 5 congruent isosceles triangles radiating from the center.",
        applications: "Pentagonal prisms appear in specialized contexts. In architecture and design: decorative columns, modern building facades, and pavilions. In nature: some crystal structures form pentagonal prisms. In manufacturing: certain packaging and containers use pentagonal shapes for distinctiveness. In education: pentagonal prisms are used to teach geometry and spatial reasoning. While less practical than rectangular prisms, pentagonal shapes offer aesthetic appeal and can tessellate in interesting patterns. The pentagon is also significant in nature (appearing in flowers and certain marine life) and has golden ratio connections.",
        derivation: "To find the pentagon area, divide it into 5 identical isosceles triangles with vertices at the center. Each triangle has base a and two sides of length R (circumradius). The central angle is 360°/5 = 72°, so each triangle has area (1/2)R²sin(72°). Using trigonometry, the apothem is a/(2tan(36°)). The total area is 5 × (1/2)(a)(a/(2tan(36°))) = (5/4)a²cot(36°). The prism volume is then this base area times height, just like any prism. This derivation shows how polygon area formulas connect to triangle areas and trigonometry."
      },
      pyramid: {
        title: "Square Pyramid Volume Calculator",
        introduction: "A square pyramid has a square base and four triangular faces meeting at an apex (the top point). It's one of the most recognizable shapes in history and architecture. The Great Pyramid of Giza, built around 2560 BCE, is the most famous example and one of the Seven Wonders of the Ancient World. Square pyramids are structurally stable and have appeared in tombs, monuments, and buildings across cultures for thousands of years. Calculate square pyramid volume with our interactive 3D calculator.",
        formula: "Volume V = (1/3)a²h, where a is the side length of the square base and h is the perpendicular height from base to apex. The slant height (height of each triangular face) is l = √(h² + (a/2)²). Surface area A = a² + 2a√(h² + (a/2)²) - square base plus four triangular faces. The 1/3 factor means a pyramid holds exactly one-third the volume of a prism (box) with the same base and height. This relationship holds true for any pyramid or cone, regardless of base shape!",
        applications: "Pyramids have fascinated humans for millennia. In ancient architecture: Egyptian pyramids (tombs for pharaohs), Mesoamerican pyramids (temples), and modern monuments. In design and art: glass pyramids (like the Louvre Pyramid), jewelry, and sculptures. In mathematics: the pyramid is a fundamental shape for understanding volume and surface area relationships. In engineering: pyramid structures are incredibly stable and distribute weight efficiently. The pyramid shape is used in roof design, packaging, and even in food presentation. Understanding pyramid volume is important in architecture, engineering, and historical studies of ancient construction techniques.",
        derivation: "The 1/3 factor has several beautiful proofs. (1) Physical proof: Fill a square pyramid with sand or water - it takes exactly three to fill a prism of same base and height. (2) Dissection proof: A prism can be cut into three pyramids of equal volume (though they're different shapes). (3) Calculus: V = ∫(x/h)²dxdy from 0 to h for both dimensions = (1/3)a²h. (4) Comparison with cone: Any pyramid is 1/3 of its enclosing prism, just as a cone is 1/3 of its enclosing cylinder. The ancient Egyptians may have known this formula empirically through construction experience, though the formal proof came later with Greek mathematics."
      },
      tri_pyramid: {
        title: "Triangular Pyramid Volume Calculator",
        introduction: "A triangular pyramid, also called a tetrahedron, has four triangular faces - making it the simplest three-dimensional shape with flat faces. Each face is a triangle, and four faces meet at each vertex. The regular tetrahedron (all faces are equilateral triangles) is one of the five Platonic solids - shapes with identical regular polygonal faces. Tetrahedra appear in nature, chemistry, and engineering. They're the 3D equivalent of the triangle - just as triangles are the simplest polygons, tetrahedra are the simplest polyhedra.",
        formula: "Volume V = (1/3)Bh where B is the triangular base area and h is the height (perpendicular distance from base to opposite vertex). For an equilateral triangle base with side a: B = (√3/4)a², so V = (√3/12)a²h. The regular tetrahedron (all edges equal to a) has volume V = a³/(6√2) ≈ 0.118a³ and surface area A = √3a². The height of a regular tetrahedron is h = a√(2/3). A tetrahedron has 4 faces, 6 edges, and 4 vertices - illustrating Euler's formula: V - E + F = 2.",
        applications: "Tetrahedra appear throughout science and engineering. In chemistry: methane (CH₄) and ammonium (NH₄⁺) molecules have tetrahedral geometry. Many crystal structures use tetrahedral arrangements. In engineering: tetrahedral structures are incredibly rigid and stable for their weight, used in trusses, frameworks, and space frames. In computer graphics: tetrahedra are the basic 3D element in finite element analysis and mesh generation. In packaging: some products use tetrahedral containers for distinctive design. In mathematics: the tetrahedron is fundamental for understanding 3D geometry and is the simplest case for many theorems. It's also used in dice (4-sided dice are tetrahedra).",
        derivation: "Like all pyramids, the volume is (1/3)Bh. For a regular tetrahedron with edge length a, the base is an equilateral triangle: B = (√3/4)a². Using the 3D Pythagorean theorem or coordinates, the height is h = a√(2/3). Thus V = (1/3)(√3/4)a² × a√(2/3) = a³/(6√2). This can also be derived using coordinates: place vertices at (1,1,1), (1,-1,-1), (-1,1,-1), (-1,-1,1) and calculate the volume using the determinant formula. The regular tetrahedron is dual to itself - connecting centers of faces creates another tetrahedron. This self-duality makes it unique among Platonic solids."
      }
    };
    return content[shape] || content.cube;
  }, [shape]);

  const calc = useMemo(() => {
    // Special handling for Pythagorean theorem
    if (shape === 'pythagorean') {
      const { sideA: a, sideB: b } = pythagoreanSides;
      const c = Math.sqrt(a * a + b * b);
      return {
        v: c,
        s: a * a + b * b,
        fV: 'a² + b² = c²',
        fS: `c = √(${a}² + ${b}²) = ${c.toFixed(2)}`,
        fb: `The hypotenuse c is ${c.toFixed(2)}`
      };
    }

    // Original volume/area calculations for 3D shapes
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
  }, [shape, params, pythagoreanSides]);

  return (
    <div className="min-h-screen bg-swiss-white text-swiss-black font-sans-body flex flex-col">
      <header className="max-w-7xl w-full mx-auto p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-b-2 border-swiss-black">
        <div>
          <h1 className="font-serif-display text-display-4xl tracking-tight text-swiss-black">
            CalcVisual
          </h1>
          <p className="font-sans-body text-display-sm text-swiss-charcoal mt-2">
            Interactive Geometry Dictionary - 3D Calculator & Visualizer
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-0 border-2 border-swiss-black">
          {shapeTypes.map(s => (
            <button key={s.id} onClick={() => setShape(s.id)}
              className={`px-4 py-2 rounded-swiss-sm border-2 border-swiss-black font-sans-body text-display-sm font-semibold transition-all uppercase ${
                shape === s.id ? 'bg-swiss-black text-swiss-white border-swiss-black' : 'bg-swiss-white text-swiss-black border-swiss-black hover:border-math-blue hover:text-math-blue'
              }`}>
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-swiss-white border-2 border-swiss-black p-8 rounded-swiss-sm">
            <h3 className="flex items-center gap-2 mb-8 font-sans-body text-display-sm font-semibold uppercase text-swiss-black tracking-wider">
              <Settings2 size={14} className="text-swiss-black" /> Parameter Control
            </h3>
            <div className="space-y-8">
              {shape === 'cube' && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between font-sans-body text-display-sm font-semibold text-swiss-black"><span>Length L</span><span className="font-mono-math">{params.length}</span></div>
                    <input type="range" min="40" max="220" value={params.length} onChange={(e) => setParams({...params, length: +e.target.value})} className="w-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between font-sans-body text-display-sm font-semibold text-swiss-black"><span>Width W</span><span className="font-mono-math">{params.width}</span></div>
                    <input type="range" min="40" max="220" value={params.width} onChange={(e) => setParams({...params, width: +e.target.value})} className="w-full" />
                  </div>
                </>
              )}
              {['cylinder', 'cone', 'sphere'].includes(shape) && (
                <div className="space-y-3">
                  <div className="flex justify-between font-sans-body text-display-sm font-semibold text-swiss-black"><span>Radius R</span><span className="font-mono-math">{params.radius}</span></div>
                  <input type="range" min="30" max="120" value={params.radius} onChange={(e) => setParams({...params, radius: +e.target.value})} className="w-full" />
                </div>
              )}
              {shape === 'pythagorean' && (
                <div className="space-y-4 p-6 bg-swiss-offwhite border-2 border-swiss-black rounded-swiss-sm">
                  <p className="font-sans-body text-display-sm text-swiss-charcoal text-center">
                    Use the interactive sliders in the visualization area above to adjust sides a and b
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="font-mono-math text-display-xl text-math-blue">{pythagoreanSides.sideA}</div>
                      <div className="font-sans-body text-display-sm uppercase text-swiss-black">Side a</div>
                    </div>
                    <div>
                      <div className="font-mono-math text-display-xl text-math-blue">{pythagoreanSides.sideB}</div>
                      <div className="font-sans-body text-display-sm uppercase text-swiss-black">Side b</div>
                    </div>
                  </div>
                </div>
              )}
              {['cylinder', 'cone', 'cube'].includes(shape) && (
                <div className="space-y-3">
                  <div className="flex justify-between font-sans-body text-display-sm font-semibold text-swiss-black"><span>Height H</span><span className="font-mono-math">{params.height}</span></div>
                  <input type="range" min="40" max="220" value={params.height} onChange={(e) => setParams({...params, height: +e.target.value})} className="w-full" />
                </div>
              )}
            </div>
          </section>

          <section className="bg-swiss-white border-2 border-swiss-black p-8 rounded-swiss-sm">
            <h3 className="flex items-center gap-2 mb-6 font-sans-body text-display-sm font-semibold uppercase text-swiss-black tracking-wider">
              <Calculator size={14} className="text-swiss-black" /> {shape === 'pythagorean' ? 'Pythagorean Formula' : 'Mathematical Derivation'}
            </h3>
            <div className="space-y-4 font-serif-display text-center text-swiss-black">
               {shape !== 'pythagorean' && calc.fb && <div className="p-4 bg-math-blue-light border-2 border-swiss-black font-sans-body text-display-sm text-swiss-black">{calc.fb}</div>}
               <div className="p-4 bg-swiss-offwhite border-2 border-swiss-black text-display-lg font-semibold">{calc.fV}</div>
               <div className="p-4 bg-swiss-offwhite border-2 border-swiss-black text-display-lg font-semibold text-math-blue">{calc.fS}</div>
            </div>
            <div className="mt-6 p-4 bg-swiss-offwhite border-2 border-swiss-black grid grid-cols-2 gap-4">
               <div><p className="font-sans-body text-display-sm uppercase font-semibold text-swiss-charcoal">{shape === 'pythagorean' ? 'Hypotenuse c' : 'Volume'}</p><p className="font-mono-math text-display-lg">{calc.v.toLocaleString(undefined, {maximumFractionDigits:shape === 'pythagorean' ? 2 : 1})}</p></div>
               <div><p className="font-sans-body text-display-sm uppercase font-semibold text-swiss-charcoal">{shape === 'pythagorean' ? 'Sum of Squares' : 'Area'}</p><p className="font-mono-math text-display-lg text-math-blue">{calc.s.toLocaleString(undefined, {maximumFractionDigits:shape === 'pythagorean' ? 2 : 1})}</p></div>
            </div>
          </section>
        </aside>

        <section className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-swiss-white border-2 border-swiss-black rounded-swiss-sm relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>

            {/* Conditional rendering: Pythagorean 2D visualization or 3D geometry */}
            {shape === 'pythagorean' ? (
              <PythagoreanVisualization
                sideA={pythagoreanSides.sideA}
                sideB={pythagoreanSides.sideB}
                onSideAChange={(value) => setPythagoreanSides({ ...pythagoreanSides, sideA: value })}
                onSideBChange={(value) => setPythagoreanSides({ ...pythagoreanSides, sideB: value })}
              />
            ) : (
              <>
                <svg width="100%" height="100%" viewBox="-300 -300 600 600" preserveAspectRatio="xMidYMid meet" className="relative z-10 transition-transform duration-500">
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0055FF" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0055FF" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  {/* Render by layers: hidden lines -> filled faces -> visible lines */}
                  <g>{renderData.renderedHiddenEdges}</g>
                  <g>{renderData.renderedFaces}</g>
                  <g>{renderData.renderedVisibleEdges}</g>
                </svg>
                <div className="absolute bottom-8 px-5 py-3 bg-swiss-white border-2 border-swiss-black rounded-swiss-sm font-sans-body text-display-sm font-semibold uppercase tracking-wider text-swiss-black flex items-center gap-2">
                  <Ruler size={14} className="text-swiss-black" /> Analytical Rendering Engine
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-swiss-white p-8 rounded-swiss-sm border-2 border-swiss-black">
              <h4 className="flex items-center gap-2 font-sans-body text-display-sm font-semibold text-swiss-black uppercase tracking-wider mb-3">
                <Target size={14} className="text-swiss-black" /> Spatial Analytical Features
              </h4>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">The normal vector-based detection algorithm has been optimized. Solid lines define visible contours, dashed lines reveal internal spatial structure. This analytical surface presentation best aligns with engineering mechanics and solid geometry cognitive patterns.</p>
            </div>
            <div className="bg-swiss-white p-8 rounded-swiss-sm border-2 border-swiss-black">
              <h4 className="flex items-center gap-2 font-sans-body text-display-sm font-semibold text-swiss-black uppercase tracking-wider mb-3">
                <Globe size={14} className="text-swiss-black" /> Model Application Value
              </h4>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">Precise visible/hidden line separation is fundamental to high-quality math courseware and 3D design software, helping learners establish robust spatial coordinate system intuition.</p>
            </div>
          </div>

          {/* SEO Content Layer - Requirement 1 */}
          <article className="bg-swiss-white border-2 border-swiss-black p-8 rounded-swiss-sm">
            <h2 className="font-serif-display text-display-2xl text-swiss-black mb-6">{educationalContent.title}</h2>

            <section className="mb-8">
              <h3 className="font-serif-display text-display-lg text-swiss-black mb-3">What is this shape?</h3>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed" dangerouslySetInnerHTML={{ __html: formatEducationalText(educationalContent.introduction, shape) }}></p>
            </section>

            <section className="mb-8">
              <h3 className="font-serif-display text-display-lg text-swiss-black mb-3">Volume Formula</h3>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed" dangerouslySetInnerHTML={{ __html: formatEducationalText(educationalContent.formula, shape) }}></p>
            </section>

            <section className="mb-8">
              <h3 className="font-serif-display text-display-lg text-swiss-black mb-3">Real-World Applications</h3>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed" dangerouslySetInnerHTML={{ __html: formatEducationalText(educationalContent.applications, shape) }}></p>
            </section>

            <section className="mb-8">
              <h3 className="font-serif-display text-display-lg text-swiss-black mb-3">Formula Derivation</h3>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed" dangerouslySetInnerHTML={{ __html: formatEducationalText(educationalContent.derivation, shape) }}></p>
            </section>

            <section className="p-6 bg-math-blue-light border-2 border-swiss-black rounded-swiss-sm">
              <h3 className="font-serif-display text-display-lg text-swiss-black mb-3">Interactive Exploration</h3>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
                Use the controls on the left to adjust parameters and see how the <span className="font-bold text-math-blue">volume</span> changes in real-time.
                Notice how changing the <span className="font-bold text-math-blue">radius</span>, <span className="font-bold text-math-blue">height</span>, or other dimensions affects the total <span className="font-bold text-math-blue">volume</span>.
                This interactive visualization helps build intuition for geometric relationships.
              </p>
            </section>
          </article>

          {/* Premium Interactive Pages - Requirement 4 */}
          {shape === 'sphere' && (
            <PremiumSpherePage params={params} onParamsChange={setParams} />
          )}
          {shape === 'cone' && (
            <PremiumConePage params={params} onParamsChange={setParams} />
          )}
          {shape === 'cylinder' && (
            <PremiumCylinderPage params={params} onParamsChange={setParams} />
          )}
          {shape === 'cube' && (
            <PremiumCubePage params={params} onParamsChange={setParams} />
          )}
          {shape === 'pythagorean' && (
            <PremiumPythagoreanPage />
          )}

          {/* FAQ Section with Schema */}
          <FAQSection shape={shape} />
        </section>
      </main>
    </div>
  );
};

export default GeometryLab;
