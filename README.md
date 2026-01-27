# GeoVisual - Geometric Visualization Engine

> Advanced Analytical Geometry Engine • Precise Visible/Hidden Line Separation

## 📸 Screenshots & Demo

### 🎬 Demo Video

[![Watch Demo Video](demo.mp4)](demo.mp4)

*Click the video above to watch the full demonstration*

### 🖼️ Gallery

#### Cone Visualization
![Cone](screenshots/OPA0.png)

#### Cylinder & Frustum
![Cylinder and Frustum](screenshots/OPA1.png)

#### Pentagonal Prism
![Pentagonal Prism](screenshots/OPA2.png)

## 📖 Project Overview

GeoVisual is a React-based 3D geometric visualization rendering engine that supports real-time rendering, parameter adjustment, and mathematical calculations for various common geometric shapes. This project uses pure mathematical algorithms for 3D projection and face detection, without relying on large 3D graphics libraries.

### Key Features

- **🎨 8 Geometric Shapes**: Cylinder, Frustum, Cone, Cuboid, Pentagonal Prism, Square Pyramid, Triangular Pyramid, Sphere
- **📐 Real-time Parameter Adjustment**: Adjust geometric dimension parameters in real-time using slider controls
- **🔬 Visible/Hidden Line Separation Rendering**: Analytical surface algorithm based on normal vectors, precisely separating visible contours from internal structures
- **📊 Mathematical Calculation Display**: Real-time display of volume, surface area calculations, and derivation formulas
- **⚡ High-Performance Rendering**: Smooth real-time rendering using SVG + React Hooks
- **🎯 Responsive Design**: Adapts to desktop and mobile devices

## 🚀 Quick Start

### Requirements

- Node.js >= 16.0.0
- npm >= 8.0.0

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Browser will automatically open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.3
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React 0.400
- **Math Engine**: Native JavaScript mathematical algorithms

## 🏗️ Project Structure

```
geovisual/
├── src/
│   ├── App.jsx           # Main application component (geometry engine core)
│   ├── App.css           # Stylesheet
│   └── main.jsx          # Application entry point
├── screenshots/          # Project screenshots gallery
│   ├── OPA0.png         # Cone visualization
│   ├── OPA1.png         # Cylinder & Frustum
│   └── OPA2.png         # Pentagonal Prism
├── demo.mp4             # Interactive demo video
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Project dependencies
└── README.md            # This file
```

## 🧮 Core Algorithms

### 1. 3D Projection Transformation

```javascript
project(x, y, z) {
  // Rotate around Y-axis (horizontal rotation)
  // Rotate around X-axis (pitch rotation)
  // Return screen coordinates and depth value
}
```

### 2. Face Visibility Detection

```javascript
isFrontFacing(p1, p2, p3) {
  // Based on screen space cross product
  // Clockwise points with nz < 0 indicate front face
}
```

### 3. Edge Visibility Detection

```javascript
// Visible edge = edge belonging to at least one front-facing face
// Use EdgeMap data structure to track edge visibility
```

### 4. Depth Sorting (Painter's Algorithm)

```javascript
// Sort by average depth value
// Render from back to front for correct occlusion
```

## 🎨 Geometric Formulas

| Shape | Volume Formula | Surface Area Formula |
|--------|---------------|---------------------|
| Cylinder | V = πr²h | S = 2πr(r+h) |
| Frustum | V = ⅓πh(r₁²+r₂²+r₁r₂) | S = π(r₁²+r₂²+(r₁+r₂)l) |
| Cone | V = ⅓πr²h | S = πr(r+l) |
| Cuboid | V = l·w·h | S = 2(lw+lh+wh) |
| Pentagonal Prism | V = Bh | S = 2B + 5ah |
| Square Pyramid | V = ⅓a²h | S = a² + 2al |
| Triangular Pyramid | V = ⅓Bh | S = B + ³⁄₂al |
| Sphere | V = ⁴⁄₃πr³ | S = 4πr² |

## 🎬 Live Demo

Check out the interactive demo video below to see GeoVisual in action:

### Interactive Features Demonstration

- **Shape Selection**: Seamlessly switch between 8 different geometric shapes
- **Real-time Rendering**: Watch as parameters update the 3D visualization instantly
- **Mathematical Formulas**: See volume and surface area calculations update in real-time
- **Responsive Design**: Experience smooth performance across different devices

### Rendering Highlights

- **Educational Diagram Style**: Clean, textbook-quality 3D renderings
- **Smart Line Visibility**: Automatic solid/dashed line separation for depth perception
- **Gradient Filling**: Semi-transparent fills enhance 3D spatial understanding
- **Optimized Performance**: Efficient SVG-based rendering engine

## 📝 Usage Instructions

1. **Select Geometric Shape**: Click the top navigation bar to switch between different geometric shape types
2. **Adjust Parameters**: Use sliders on the left control panel to adjust geometric parameters
3. **Observe Rendering**: The right side displays the 3D rendering effect in real-time
4. **View Calculations**: Bottom left shows mathematical derivation formulas and calculation results

## 🔧 Customization

### Modify Default Parameters

Edit initial parameters in [App.jsx](src/App.jsx#L116):

```javascript
const [params, setParams] = useState({
  radius: 70,
  radius2: 40,
  height: 140,
  side: 100,
  length: 150,
  width: 100
});
```

### Adjust Viewing Angle

Modify rotation angles in [App.jsx](src/App.jsx#L9):

```javascript
ROTATION: { x: -25, y: -35 }
```

### Add New Geometric Shape

1. Add a new case in `ShapeGenerator.generate()`
2. Add configuration in `shapeTypes` array
3. Add calculation formula in `calc` object

## 🎨 Rendering Features

### Shape-Specific Optimizations

Each geometric shape is rendered with educational-quality precision:

- **Cone**: 2 generatrix lines with base ellipse (front solid, back dashed)
- **Cylinder**: Top solid circle, bottom split ellipse, 2 generatrix lines
- **Frustum**: Similar to cylinder with adjustable top radius
- **Pyramids**: Customized solid/dashed line patterns for optimal depth perception
- **Prisms**: Smart edge visibility based on viewing angle

### Visual Enhancements

- **Gradient Filling**: Semi-transparent blue fills distinguish front/back faces
- **Smart Line Styles**: Solid lines for visible edges, dashed for hidden
- **Educational Style**: Clean, minimalist diagrams perfect for learning
- **Real-time Updates**: Instant visual feedback as parameters change

## 📄 License

MIT License

## 👨‍💻 Author

GeoVisual Team

## 🙏 Acknowledgments

- React team for the excellent UI framework
- Vite team for the lightning-fast build tool
- Tailwind CSS team for the practical CSS framework
- Lucide team for the beautiful icon library

---

**Note**: This project is for educational purposes only, demonstrating how to implement 3D geometric visualization rendering using pure mathematical algorithms.
