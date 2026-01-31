# GeoVisual - Interactive 3D Geometry Calculator & Visualizer

**Calculate sphere, cone, cylinder, and cube volume instantly with our interactive 3D visualizer.** Learn formulas, see step-by-step solutions, and explore geometric properties. Free online geometry calculator and math solver.

## Overview

GeoVisual is an **interactive geometry calculator and 3D visualizer** that combines the precision of a math solver with the clarity of interactive visualizations. Unlike static calculators that only provide numeric results, GeoVisual lets you **see the formulas**, **manipulate 3D shapes in real-time**, and **discover mathematical relationships** through exploration.

The core idea: when you drag the radius slider from 50 to 100, three things happen simultaneously - the sphere grows, the r³ in the formula highlights, and the calculation steps show r³ = 1,000,000. When radius doubles, a message appears: radius × 2 = volume × 8. That's when the relationship becomes obvious.

### Design Philosophy

The interface uses Swiss Style principles:

**No Rounded Corners** - Maximum 2px border radius
**Explicit Grid** - Visible 2px black borders define structure
**Academic Typography** - Times New Roman serif headings
**Minimal Color** - Pure white (#FFFFFF) and black (#000000)
**High Contrast** - Pure black text for maximum readability
**Single Accent** - Mathematical Blue (#0055FF) for emphasis only
**No Shadows** - Flat design, content over decoration
**Border-Based Interaction** - Border changes on hover, not background effects

This transforms the interface from generic "SaaS product" into a serious mathematical publication.

## What Makes It Different

| Traditional Dictionary | GeoVisual |
|----------------------|-----------|
| Static images and text | Interactive 3D visualizations |
| Read-only formulas | Manipulatable parameters |
| Abstract explanations | Real-world applications |
| Passive learning | Active discovery |
| Fixed examples | Infinite variations |

## Key Features

### 🧮 Interactive Calculators

**Sphere Volume Calculator**
- Calculate volume with adjustable radius: **V = (4/3)πr³**
- Real-time 3D visualization
- Step-by-step formula explanations
- Surface area calculator: **S = 4πr²**

**Cone Volume Calculator**
- Calculate volume: **V = (1/3)πr²h**
- Surface area with slant height: **S = πr(r+l)**
- Compare cone vs cylinder volume (1/3 relationship)
- Interactive apex and base manipulation

**Cylinder Volume Calculator**
- Calculate volume: **V = πr²h**
- Surface area: **S = 2πr(r+h)**
- Real-time radius and height adjustment
- Curved surface unrolling visualization

**Cube & Cuboid Volume Calculator**
- Calculate volume: **V = l × w × h**
- Surface area: **S = 2(lw + lh + wh)**
- Space diagonal: **d = √(l² + w² + h²)**
- Interactive face highlighting

**Pythagorean Theorem Calculator**
- Calculate hypotenuse: **c² = a² + b²**
- Interactive 2D triangle visualization
- Visual proof with colored squares
- Famous Pythagorean triples detector (3-4-5, 5-12-13)

### 📚 Educational Content

**Formula Explanations**
- Step-by-step derivations for each shape
- Variable definitions and units
- Real-world application examples
- Historical context (Archimedes, Euclid)

**FAQ Sections**
- Common geometry questions answered
- Bold keywords for easy scanning
- Step-by-step calculation guides
- Shape property comparisons

**Discovery Zones**
- Interactive experiments and comparisons
- "What if?" scenarios
- Mathematical relationship insights
- Real-world object comparisons

### Interactive Components

**ExplorableFormula**
- Step-by-step formula derivations
- Variable highlighting tied to slider manipulation
- Real-time calculation results

**DiscoveryInsight**
- Context-aware insights triggered by exploration
- Messages appear when you hit specific relationships
- Examples: doubling radius, finding famous triples

**InteractiveSlider**
- Touch-friendly sliders (44px minimum touch targets)
- Synchronized formula feedback
- Swiss styling: square thumb, 2px black border

**DiscoveryZone**
- Themed exploration areas
- Experiments and comparisons
- Historical context sections

**FAQSection** (NEW)
- Shape-specific frequently asked questions
- Bold keywords for easy scanning
- Step-by-step calculation guides
- FAQPage schema for "People Also Ask" optimization
- 20+ FAQ entries across all shapes

## Technical Capabilities

- **5 Geometric Shapes**: Sphere, Cone, Cylinder, Cube, Pythagorean Triangle
- **Real-time Parameter Adjustment**: Slider controls for all dimensions
- **Visible/Hidden Line Rendering**: Smart solid/dashed line separation
- **High-Performance Rendering**: 60fps SVG rendering
- **Responsive Design**: Mobile-first touch-friendly interface
- **SEO-Optimized Content**: Educational material with formulas and context

## Quick Start

### Prerequisites

- Node.js 16+
- npm 8+

### Installation

```bash
cd geovisual
npm install
npm run dev
```

Browser opens at http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## Tech Stack

- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.3.1
- **Styling**: Tailwind CSS 3.4.4 with custom Swiss design system
- **Icons**: Lucide React 0.400.0
- **Math Engine**: Pure JavaScript (no external math libraries)
- **Typography**: Times New Roman (headings), Inter (body), JetBrains Mono (math)
- **Color System**: Custom Swiss tokens (Black, White, Math Blue #0055FF)

## Project Structure

```
geovisual/
├── src/
│   ├── components/
│   │   ├── premiumPages/
│   │   │   ├── PremiumSpherePage.jsx       # Sphere exploration
│   │   │   ├── PremiumConePage.jsx         # Cone exploration
│   │   │   ├── PremiumCylinderPage.jsx     # Cylinder exploration
│   │   │   ├── PremiumCubePage.jsx         # Cube exploration
│   │   │   └── PremiumPythagoreanPage.jsx  # Pythagorean theorem
│   │   ├── ExplorableFormula.jsx           # Formula display
│   │   ├── DiscoveryInsight.jsx            # Insight triggers
│   │   ├── DiscoveryZone.jsx               # Exploration containers
│   │   ├── InteractiveSlider.jsx           # Touch sliders
│   │   ├── PythagoreanVisualization.jsx    # 2D triangle
│   │   └── FAQSection.jsx                  # FAQ with schema (NEW)
│   ├── App.jsx                             # Main app with 3D engine
│   ├── App.css                             # Swiss typography
│   └── main.jsx                            # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js                      # Swiss design tokens
└── package.json
```

## Core Algorithms

### 3D Projection Engine

```javascript
project(x, y, z) {
  // Rotate around Y-axis (azimuth)
  // Rotate around X-axis (elevation)
  // Return { x, y, z } screen coordinates with depth
}
```

### Face Visibility Detection

```javascript
isFrontFacing(p1, p2, p3) {
  // Cross product in screen space
  // Clockwise + nz < 0 → front face
}
```

### Smart Edge Rendering

```javascript
// Edge is visible if it belongs to ≥1 front-facing face
// Solid lines for visible edges
// Dashed lines for hidden edges
```

### Painter's Algorithm

```javascript
// Sort faces by average depth (z-value)
// Render from back to front
```

## Geometric Formulas & Calculators

### Volume Formulas

| Shape | Formula | Calculator |
|-------|---------|------------|
| **Sphere** | V = (4/3)πr³ | [Sphere Volume Calculator](#) |
| **Cone** | V = (1/3)πr²h | [Cone Volume Calculator](#) |
| **Cylinder** | V = πr²h | [Cylinder Volume Calculator](#) |
| **Cube** | V = l × w × h | [Cube Volume Calculator](#) |

### Surface Area Formulas

| Shape | Formula | Calculator |
|-------|---------|------------|
| **Sphere** | S = 4πr² | [Sphere Surface Area](#) |
| **Cone** | S = πr(r+l), l=√(r²+h²) | [Cone Surface Area](#) |
| **Cylinder** | S = 2πr(r+h) | [Cylinder Surface Area](#) |
| **Cube** | S = 2(lw+lh+wh) | [Cube Surface Area](#) |

### Special Formulas

| Theorem | Formula | Calculator |
|---------|---------|------------|
| **Pythagorean** | c² = a² + b² | [Pythagorean Calculator](#) |
| **Cone Slant Height** | l = √(r² + h²) | [Cone Calculator](#) |
| **Cube Space Diagonal** | d = √(l² + w² + h²) | [Cube Calculator](#) |

### Variable Definitions

- **V** = Volume (cubic units)
- **S** = Surface Area (square units)
- **r** = Radius (units)
- **h** = Height (units)
- **l, w** = Length, Width (units)
- **l** = Slant Height (units)
- **a, b** = Triangle legs (units)
- **c** = Hypotenuse (units)
- **π** = Pi (≈3.14159)

## Educational Approach

### From Calculator to Understanding

**Traditional Calculator:**
> Input: radius = 5, height = 10
> Output: volume = 261.8

**GeoVisual Approach:**
1. **See the Formula** - V = (4/3)πr³ displayed with highlighted variables
2. **Manipulate 3D Shape** - Drag sliders and watch sphere grow in real-time
3. **Step-by-Step Calculation** - Follow each calculation step
4. **Discover Relationships** - Insights trigger when conditions met (e.g., "Doubling radius increases volume 8x!")
5. **Real-World Context** - Compare with basketball, planets, molecules

### Learning Framework: **Calculate → Visualize → Discover**

1. **Calculate** - Get instant results with interactive calculators
2. **Visualize** - See formulas update in 3D as you adjust parameters
3. **Discover** - Insights appear when you hit specific mathematical relationships

### Example: Sphere Volume Calculator

```jsx
// Input: Adjust radius slider
radius = 70

// Step-by-step calculation:
Step 1: r³ = 70³ = 343,000
Step 2: π = 3.14159
Step 3: (4/3) × π × r³ = 1,436,755

// Visual feedback:
- Sphere grows in 3D
- Formula highlights "r³"
- Volume updates in real-time

// Discovery insight:
"Doubling radius increases volume 8x! (2³ = 8)"
```

### Highlight-Connect-Discover Framework

1. **Highlight** - Dragging a slider highlights the corresponding variable in the formula
2. **Connect** - Step-by-step calculations show how inputs become outputs
3. **Discover** - Insights trigger when specific conditions are met

### Example: Sphere Volume

```jsx
<ExplorableFormula
  formula="V = (4/3)πr³"
  variables={{ r: 70 }}
  highlight="r"
  showSteps={true}
  result={1436755}
  unit="cubic units"
/>

<DiscoveryInsight
  triggerCondition={() => radius >= initialRadius * 2}
  message="Doubling radius increases volume by 8x! (2³ = 8)"
/>
```

## SEO & Discoverability

### Target Keywords

**Primary (Calculator & Solver Cluster):**
- sphere volume calculator
- cone volume calculator
- cylinder volume calculator
- cube volume calculator
- Pythagorean theorem calculator
- math solver
- geometry solver

**Secondary (Visualization Cluster):**
- 3D geometry visualizer
- interactive 3D shapes
- geometry simulation
- mathematical visualization
- interactive geometry tools

**Educational (Problem-Solving Cluster):**
- step-by-step calculator
- volume formulas
- surface area calculator
- geometry education
- interactive math tools

### SEO Features

✅ **Structured Data (Schema.org)**
- WebApplication schema
- MathSolver schemas for each calculator (Sphere, Cylinder, Cone, Pythagorean)
- FAQPage schema for "People Also Ask" optimization

✅ **Meta Tags Optimization**
- Title tags with calculator-focused keywords
- Descriptions emphasizing "Calculate instantly" and "Step-by-step"
- Open Graph and Twitter Card tags for social sharing

✅ **Content Optimization**
- Educational content with 2500+ words
- FAQ sections with bold keywords
- Formula explanations with step-by-step guides
- Real-world application examples

✅ **Technical SEO**
- Fast loading (Vite optimization)
- Mobile-responsive design
- Accessible (ARIA labels, keyboard navigation)
- Semantic HTML structure

## Premium Pages Detail

### Sphere Page

**Discovery Zones:**
- Radius exploration with volume scaling insights
- Archimedes' 2/3 cylinder-sphere relationship
- Real-world object comparison (baseball, basketball, planets)
- Surface area-to-volume ratio analysis

**Insights:**
- Radius × 2 → Volume × 8
- Radius × 3 → Volume × 27
- Large objects cool slower (surface/volume ratio)

### Cone Page

**Discovery Zones:**
- Why 1/3? (Cone vs Cylinder volume comparison)
- Apex angle experiments (tall vs wide)
- Slant height and Pythagorean connection
- Ice cream cone calculator

**Insights:**
- 3 cones = 1 cylinder
- Height ≈ radius → optimal 53° apex angle
- Large slant height → huge surface area

### Cylinder Page

**Discovery Zones:**
- Unrolling the cylinder (curved surface → rectangle)
- Volume comparison: Cylinder vs Sphere vs Cone
- Soda can optimization puzzle (330ml target)
- Pipe flow and cross-sectional area

**Insights:**
- Unrolled area = 2πrh (rectangle)
- Sphere = 2/3 of cylinder volume
- Cone = 1/3 of cylinder volume
- Pipe radius × 2 → Flow × 4

### Cube Page

**Discovery Zones:**
- Interactive face highlighting
- Spatial Pythagorean theorem (d = √(l²+w²+h²))
- Box packing optimization puzzles
- Surface area-to-volume ratio

**Insights:**
- Space diagonal formula
- Packing efficiency comparisons
- Surface/volume ratio explains cell size

### Pythagorean Theorem

**Discovery Zones:**
- Interactive 2D triangle with draggable sides
- Visual proofs (Rearrangement, Similar Triangles, Euclid's Windmill)
- Real-world applications (ladders, TV sizes, construction)
- Famous Pythagorean triples detector

**Features:**
- Clean triangle without side labels
- Three colored squares (blue a², green b², purple c²)
- Hypotenuse square rotates to align with hypotenuse
- Real-time area calculation
- Famous triple recognition

## User Experience

### Navigation

1. **Top Nav** - Switch between shapes (Sphere, Cone, Cylinder, Cube, Pythagorean)
2. **Left Panel** - Parameter controls + Mathematical Derivation
3. **Center Canvas** - 3D/2D visualization with real-time rendering
4. **Premium Content** - Scroll down for Discovery Zones

### Interaction Patterns

- **Drag Sliders** → Formula highlights + Results update
- **Adjust Parameters** → Insights trigger when conditions met
- **Click Shapes** → Face highlighting (Cube page)
- **Scroll Discovery Zones** → Educational content unfolds

## Component API

### ExplorableFormula

```jsx
<ExplorableFormula
  formula="V = (4/3)πr³"
  variables={{ r: 70 }}
  highlight="r"
  showSteps={true}
  result={1436755}
  unit="cubic units"
/>
```

### DiscoveryInsight

```jsx
<DiscoveryInsight
  triggerCondition={() => radius > 100}
  message="Discovery message"
  type="discovery"  // or 'warning', 'tip'
/>
```

### DiscoveryZone

```jsx
<DiscoveryZone
  title="Explore Title"
  variant="primary"  // 'primary' | 'secondary' | 'tertiary'
>
  {/* Content */}
</DiscoveryZone>
```

### InteractiveSlider

```jsx
<InteractiveSlider
  label="Radius (r)"
  value={radius}
  onChange={setRadius}
  min={10}
  max={120}
  variableName="r"
  unit=" units"
  color="math-blue"
/>
```

## Performance Features

### Rendering Optimization
- **useMemo** for expensive calculations
- **React.memo** on pure components
- Debounded slider events (16ms frame budget)

### Mobile Optimization
- **44px touch targets** (Apple HIG compliant)
- **Reduced motion** respects `prefers-reduced-motion`
- **Overflow scrolling** for long content

### Accessibility
- **Semantic HTML** (button, label, summary)
- **ARIA labels** on interactive controls
- **Keyboard navigation** support

## Content Quality

### Educational Content
- 500+ words per premium page
- 4 discovery zones per shape
- 3+ insights per page
- Historical context in collapsible sections

### Code Quality
- **Component modularity** - Reusable UI library
- **Performance** - 60fps rendering
- **Responsive** - Mobile-first Tailwind classes

## Troubleshooting

### Sliders Not Responding

**Cause:** Parent container has `pointer-events: none`

**Fix:** Add `pointer-events-auto` to interactive children

### Formula Not Highlighting

**Cause:** `variableName` prop doesn't match formula variable

**Fix:** Ensure consistent naming between slider and formula

### Insight Not Triggering

**Debug:** Add console.log to check condition

## Deployment

### Production Build

```bash
npm run build
# Outputs to: dist/
```

### Environment Variables

Create `.env.production`:

```env
VITE_BASE_URL=/path/to/app
```

### Vercel Deployment

```bash
npm i -g vercel
vercel --prod
```

### Netlify Deployment

```bash
npm i -g netlify-cli
netlify deploy --prod
```

## Swiss Style Design System

### Design Philosophy

The interface uses Swiss Style + Digital Brutalism principles to create a serious mathematical publication aesthetic.

### Core Principles

| Principle | Implementation |
|-----------|----------------|
| No Rounded Corners | Maximum 2px border radius |
| Explicit Grid | Visible 2px black borders |
| Academic Typography | Times New Roman serif headings |
| Minimal Color | Pure white background only |
| High Contrast | Pure black text |
| Single Accent | Mathematical Blue for emphasis |
| No Shadows | Flat design |
| Border Interaction | Hover changes border width |

### Color Palette

```css
/* Foundation Colors */
--swiss-white: #FFFFFF        /* Primary background */
--swiss-offwhite: #FAFAFA     /* Secondary backgrounds */
--swiss-black: #000000        /* Primary text */
--swiss-charcoal: #1A1A1A     /* Secondary text */

/* Accent Colors */
--math-blue: #0055FF          /* Single accent color */
--math-blue-light: #E6F0FF    /* Accent backgrounds */
```

### Typography

**Display Headings (Serif)** - Times New Roman for authority
**Body Text (Sans-Serif)** - Inter for readability
**Math & Code (Monospace)** - JetBrains Mono for precision

### Component Patterns

**Primary card**
```jsx
<div className="bg-swiss-white border-2 border-swiss-black rounded-swiss-sm p-8">
```

**Secondary card**
```jsx
<div className="bg-swiss-offwhite border-2 border-swiss-black rounded-swiss-sm p-8">
```

**Formula display**
```jsx
<span className="font-serif-display text-display-xl font-semibold text-swiss-black">
  V = (4/3)πr³
</span>
```

**Math numbers**
```jsx
<span className="font-mono-math text-display-2xl text-math-blue">
  {volume.toFixed(2)}
</span>
```

## License

MIT License - Free for educational purposes

## Development

GeoVisual demonstrates interactive math visualization using pure JavaScript algorithms. No 3D libraries (Three.js, Babylon.js) are used - all projection is calculated from scratch.

**Status:** Production Ready (v2.1.0)

**Latest Updates:** February 1, 2026

**Recent SEO Optimization:**
✅ Keyword migration from "Dictionary" to "Calculator & Visualizer"
✅ MathSolver schemas deployed for all shapes
✅ FAQ sections with step-by-step guides
✅ Enhanced meta tags for search visibility
✅ Mobile-optimized with 44px touch targets

### Technical Achievements
- Pure math engine (no external 3D libraries)
- 60fps performance with optimized rendering
- **5 MathSolver schemas** (Sphere, Cylinder, Cone, Pythagorean)
- SEO-optimized with calculator-focused keywords
- Mobile-first responsive design
- Accessible (ARIA labels, keyboard navigation)

### Pedagogical Innovations
- **Interactive calculators** with real-time 3D visualization
- Context-aware insights triggered by exploration
- **Step-by-step calculation** guides for each formula
- Real-world connections (soda cans, ice cream, buildings)
- Visual proof library with interactive demonstrations
- FAQ sections with bold keywords for easy scanning

### Design Excellence
- Swiss Style design system with academic typography
- High contrast (pure black on white)
- Minimal aesthetic (no emojis, gradients, shadows)
- Sharp geometry (2px borders, 2px max corner radius)
- Single accent color (Mathematical Blue #0055FF)

### Content Statistics
- **5 Interactive Calculators** (Sphere, Cone, Cylinder, Cube, Pythagorean)
- **20+ FAQ entries** with step-by-step guides
- **5 MathSolver schemas** for rich snippets
- **2500+ Words** of educational content
- **8 Reusable Components**
- **2000+ Lines** of React/JavaScript code

### SEO Performance Targets
- **3-Month:** 1,000 monthly impressions, 100 visitors
- **6-Month:** 10,000 monthly impressions, 1,000 visitors
- **12-Month:** 50,000 monthly impressions, 5,000 visitors
- **Keywords:** "sphere volume calculator", "Pythagorean theorem calculator", etc.

## Acknowledgments

- React Team - Excellent UI framework
- Vite Team - Lightning-fast build tool
- Tailwind CSS - Practical utility-first CSS
- Lucide - Beautiful icon library
- Explorable Explanations - Pedagogical inspiration by Bret Victor
