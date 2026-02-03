import React from 'react';

/**
 * FAQSection Component - Displays frequently asked questions with schema markup
 * Includes FAQPage JSON-LD structured data for SEO
 */

const FAQSection = ({ shape = 'sphere' }) => {
  // FAQ data for different shapes
  const faqData = {
    sphere: [
      {
        question: "What is the formula for sphere volume?",
        answer: "The <strong>volume of sphere formula</strong> is <strong>V = (4/3)πr³</strong>, where <strong>r</strong> is the radius. This is one of the most important <strong>geometry formulas</strong> and is part of every complete <strong>geometry formula sheet</strong>."
      },
      {
        question: "Where can I find area formulas for all shapes?",
        answer: "Our interactive tool provides a complete <strong>geometry formula sheet</strong> with <strong>area formulas for all shapes</strong>. You can access the <strong>volume of sphere formula</strong>, cylinder formulas, cone formulas, and more through our interactive 3D visualizations."
      },
      {
        question: "What are the basic geometry formulas I should know?",
        answer: "The essential <strong>basic geometry formulas</strong> include: <strong>volume of sphere formula</strong> (V = 4/3πr³), cylinder volume (V = πr²h), cone volume (V = 1/3πr²h), and Pythagorean theorem (a² + b² = c²). Our tool provides a complete <strong>geometry formula sheet</strong> with all these equations."
      },
      {
        question: "How do I calculate the volume of a sphere step by step?",
        answer: "<strong>Step 1:</strong> Measure the radius (r).\n<strong>Step 2:</strong> Cube the radius (r³ = r × r × r).\n<strong>Step 3:</strong> Multiply by pi (π ≈ 3.14159).\n<strong>Step 4:</strong> Multiply by 4/3.\nThe result is the <strong>volume</strong> using the <strong>volume of sphere formula</strong>."
      },
      {
        question: "Why is the volume of a sphere 4/3 πr³?",
        answer: "Archimedes discovered that a <strong>sphere</strong> occupies exactly 2/3 of its surrounding <strong>cylinder</strong>. The <strong>geometry formula</strong> comes from calculus integration over spherical coordinates. This is one of the fundamental <strong>equations for geometry</strong>."
      },
      {
        question: "What is the relationship between sphere radius and volume?",
        answer: "<strong>Volume</strong> scales with the cube of radius. Doubling radius increases <strong>volume</strong> 8x (2³ = 8). Tripling radius increases <strong>volume</strong> 27x (3³ = 27). This non-linear relationship is why large objects have much larger <strong>volumes</strong>."
      },
      {
        question: "How do you find the volume of a sphere with diameter?",
        answer: "First, divide the diameter by 2 to get the radius: <strong>r = d/2</strong>. Then use the <strong>volume of sphere formula</strong>: <strong>V = (4/3)π(d/2)³</strong>. For example, a sphere with diameter 10 has radius 5, so V = (4/3)π(5)³ ≈ 523.6."
      },
      {
        question: "What is the surface area of a sphere?",
        answer: "The <strong>sphere surface area formula</strong> is <strong>A = 4πr²</strong>. Notice that surface area is the derivative of volume with respect to radius: dV/dr = 4πr². This elegant relationship shows how <strong>geometry formulas</strong> connect through calculus."
      },
      {
        question: "How do I calculate sphere volume if I know circumference?",
        answer: "First, find the radius from circumference: <strong>r = C/(2π)</strong>. Then use the <strong>volume of sphere formula</strong>: <strong>V = (4/3)π(C/(2π))³</strong>. This two-step process is common when working with <strong>general geometry formulas</strong>."
      },
      {
        question: "What is the volume of a hemisphere?",
        answer: "A hemisphere is exactly half a sphere, so its volume is <strong>V = (2/3)πr³</strong>, which is half of the <strong>volume of sphere formula</strong>. The surface area of a hemisphere (including the flat base) is <strong>A = 3πr²</strong>."
      },
      {
        question: "How does sphere volume compare to cylinder volume?",
        answer: "Archimedes' famous discovery: a sphere inscribed in a cylinder (touching top, bottom, and sides) has exactly <strong>2/3 the volume of the cylinder</strong>. If the cylinder has radius r and height 2r, then cylinder volume = 2πr³ and sphere volume = (4/3)πr³ = (2/3)(2πr³)."
      },
      {
        question: "What real-world objects are spheres?",
        answer: "Spheres appear throughout nature and human design: <strong>planets and stars</strong> (Earth, Sun), <strong>balls</strong> (basketball, soccer ball, tennis ball), <strong>bubbles</strong> and <strong>water droplets</strong>, <strong>oranges</strong> and <strong>marbles</strong>, <strong>atoms</strong> (in electron cloud models), and <strong>ball bearings</strong> in machinery."
      },
      {
        question: "How do I use the sphere volume formula in physics?",
        answer: "In physics, the <strong>volume of sphere formula</strong> calculates mass (mass = density × volume), determines buoyancy (Archimedes' principle), finds moment of inertia for rotating spheres, and models gravitational fields. It's one of the most applied <strong>geometry formulas</strong> in science."
      },
      {
        question: "What is the volume of Earth in cubic meters?",
        answer: "Earth's mean radius is approximately 6,371 km (6,371,000 m). Using the <strong>volume of sphere formula</strong>: V = (4/3)π(6,371,000)³ ≈ 1.083 × 10²¹ cubic meters. This demonstrates how <strong>geometry formulas</strong> help us understand planetary scale."
      }
    ],
    cylinder: [
      {
        question: "What is the formula for cylinder volume?",
        answer: "The <strong>cylinder volume formula</strong> is <strong>V = πr²h</strong>, where <strong>r</strong> is the radius of the circular base and <strong>h</strong> is the height. This is one of the essential <strong>basic geometry formulas</strong> found on every <strong>geometry formula sheet</strong>."
      },
      {
        question: "Where can I find general geometry formulas?",
        answer: "Our interactive calculator provides access to <strong>general geometry formulas</strong> including <strong>area formulas for all shapes</strong>. The <strong>cylinder volume formula</strong> and surface area formulas are part of our complete <strong>geometry formula sheet</strong>."
      },
      {
        question: "How do I calculate cylinder surface area?",
        answer: "The <strong>surface area formula</strong> is <strong>S = 2πr(r + h)</strong>, which includes both circular bases (<strong>2πr²</strong>) and the curved surface (<strong>2πrh</strong>). These are important <strong>equations for geometry</strong>."
      },
      {
        question: "What's the difference between volume and surface area?",
        answer: "<strong>Volume</strong> measures the space inside (<strong>V = πr²h</strong>), while <strong>surface area</strong> measures the total area of all surfaces (<strong>S = 2πr(r + h)</strong>). Both are key <strong>geometry formulas</strong>."
      },
      {
        question: "How does changing radius affect cylinder volume?",
        answer: "<strong>Volume</strong> scales with the square of radius. Doubling the radius increases <strong>volume</strong> 4x (2² = 4), while doubling height only doubles <strong>volume</strong>. This demonstrates how <strong>geometry formulas</strong> work."
      },
      {
        question: "How do I calculate volume of a cylinder with diameter?",
        answer: "First, divide diameter by 2 to get radius: <strong>r = d/2</strong>. Then use the <strong>cylinder volume formula</strong>: <strong>V = π(d/2)²h</strong>. For example, a cylinder with diameter 10 and height 15 has V = π(5)²(15) ≈ 1,178.1."
      },
      {
        question: "What is the curved surface area of a cylinder?",
        answer: "The curved (lateral) surface area is <strong>A = 2πrh</strong>, which is the area of the rectangle you get by 'unrolling' the curved side. Total surface area adds the top and bottom circles: <strong>S = 2πrh + 2πr² = 2πr(r + h)</strong>."
      },
      {
        question: "How do I find the height of a cylinder if I know volume?",
        answer: "Rearrange the <strong>cylinder volume formula</strong>: <strong>h = V/(πr²)</strong>. For example, if volume = 500 and radius = 5, then h = 500/(π × 25) ≈ 6.37. This algebraic manipulation is essential for working with <strong>geometry formulas</strong>."
      },
      {
        question: "What is the volume of a cylinder in gallons?",
        answer: "First calculate volume in cubic units using <strong>V = πr²h</strong>. For cubic inches to gallons: divide by 231. For cubic feet to gallons: multiply by 7.48. This conversion is useful for <strong>general geometry formulas</strong> in practical applications."
      },
      {
        question: "How is cylinder volume used in real life?",
        answer: "Cylinder volume calculations are used for: <strong>water tanks</strong> (capacity planning), <strong>engine cylinders</strong> (displacement = πr²h × number of cylinders), <strong>pipes</strong> (flow volume), <strong>industrial drums</strong> (storage capacity), and <strong>construction columns</strong> (concrete volume)."
      },
      {
        question: "What is the relationship between cylinder and cone volume?",
        answer: "A cone with the same base radius and height as a cylinder has exactly <strong>1/3 the volume</strong>. Three cones can fill one cylinder. This relationship (V_cone = (1/3)V_cylinder) is one of the beautiful connections in <strong>basic geometry formulas</strong>."
      },
      {
        question: "How do I calculate the volume of a hollow cylinder?",
        answer: "For a tube/pipe with outer radius R and inner radius r: <strong>V = πh(R² - r²)</strong>. This subtracts the empty inner cylinder from the solid outer cylinder. This extends the <strong>cylinder volume formula</strong> to practical engineering applications."
      },
      {
        question: "What is oblique cylinder volume?",
        answer: "Surprisingly, an oblique (slanted) cylinder has the <strong>same volume formula</strong> as a right cylinder: <strong>V = πr²h</strong>, where h is the perpendicular height (not the slant height). This is a consequence of Cavalieri's Principle among <strong>geometry formulas</strong>."
      },
      {
        question: "How do engineers use cylinder volume formulas?",
        answer: "Engineers use <strong>cylinder volume calculations</strong> for: <strong>hydraulic systems</strong> (fluid displacement), <strong>pneumatics</strong> (air compression), <strong>engine design</strong> (combustion chamber volume), <strong>manufacturing</strong> (material volume), and <strong>quality control</strong> (ensuring consistent capacity)."
      }
    ],
    cone: [
      {
        question: "What is the formula for cone volume?",
        answer: "The <strong>cone volume formula</strong> is <strong>V = (1/3)πr²h</strong>, where <strong>r</strong> is the base radius and <strong>h</strong> is the height. This is one of the fundamental <strong>basic geometry formulas</strong> and part of any complete <strong>geometry formula sheet</strong>."
      },
      {
        question: "What are the area formulas for all shapes including cones?",
        answer: "Our <strong>geometry formula sheet</strong> provides <strong>area formulas for all shapes</strong>. For cones, the surface area <strong>geometry formula</strong> is <strong>S = πr(r + l)</strong>, where l is the slant height calculated as <strong>l = √(r² + h²)</strong>."
      },
      {
        question: "Why is cone volume 1/3 of cylinder volume?",
        answer: "This can be proven using calculus integration or by showing that three <strong>cones</strong> of identical base and height can exactly fill one <strong>cylinder</strong>. This relationship is part of <strong>general geometry formulas</strong>."
      },
      {
        question: "How do I calculate cone surface area?",
        answer: "The <strong>surface area formula</strong> is <strong>S = πr(r + l)</strong>, where <strong>l</strong> is the slant height calculated as <strong>l = √(r² + h²)</strong>. This includes the base (<strong>πr²</strong>) and the curved surface (<strong>πrl</strong>). These are essential <strong>equations for geometry</strong>."
      },
      {
        question: "What is slant height in a cone?",
        answer: "<strong>Slant height</strong> (l) is the distance from the apex to any point on the base edge, calculated as <strong>l = √(r² + h²)</strong> using the <strong>Pythagorean theorem</strong>. This is one of the key <strong>geometry formulas</strong> for cones."
      },
      {
        question: "How do I find cone volume with diameter?",
        answer: "First, convert diameter to radius: <strong>r = d/2</strong>. Then use the <strong>cone volume formula</strong>: <strong>V = (1/3)π(d/2)²h</strong>. For example, a cone with diameter 8 and height 12 has V = (1/3)π(4)²(12) ≈ 201.1."
      },
      {
        question: "What is the lateral surface area of a cone?",
        answer: "The lateral (curved) surface area is <strong>A = πrl</strong>, where l is slant height. This doesn't include the base. Total surface area adds the base circle: <strong>S = πrl + πr² = πr(r + l)</strong>. These <strong>geometry formulas</strong> are fundamental for cone calculations."
      },
      {
        question: "How do I calculate the height of a cone from slant height?",
        answer: "Use the <strong>Pythagorean theorem</strong>: <strong>h = √(l² - r²)</strong>. For example, if slant height l = 10 and radius r = 6, then h = √(100 - 36) = √64 = 8. This relationship connects cone <strong>geometry formulas</strong>."
      },
      {
        question: "What is a right circular cone vs oblique cone?",
        answer: "A <strong>right circular cone</strong> has its apex directly above the center of the circular base. An <strong>oblique cone</strong> has the apex off-center. Surprisingly, both use the same <strong>cone volume formula</strong>: <strong>V = (1/3)πr²h</strong> where h is perpendicular height."
      },
      {
        question: "How is the cone volume formula derived?",
        answer: "Using calculus: <strong>V = ∫(πrx/h)²dx</strong> from 0 to h, where the radius at height x is proportional to x. This integrates to <strong>(1/3)πr²h</strong>. Geometrically, it comes from comparing with a cylinder using <strong>general geometry formulas</strong>."
      },
      {
        question: "What real-world objects are cones?",
        answer: "Cones appear everywhere: <strong>ice cream cones</strong>, <strong>traffic cones</strong>, <strong>funnels</strong>, <strong>party hats</strong>, <strong>speaker enclosures</strong>, <strong>volcanoes</strong>, <strong>tree tops</strong> (spruce, fir), and <strong>mountain peaks</strong>. The cone shape efficiently directs flow or provides stability."
      },
      {
        question: "How do I calculate the volume of a truncated cone (frustum)?",
        answer: "A <strong>frustum</strong> (truncated cone) has volume <strong>V = (1/3)πh(r₁² + r₂² + r₁r₂)</strong>, where r₁ is bottom radius, r₂ is top radius, and h is height. This extends <strong>cone geometry formulas</strong> to practical shapes like buckets and lampshades."
      },
      {
        question: "What is the apex angle of a cone?",
        answer: "The apex angle (vertex angle) is <strong>θ = 2arctan(r/h)</strong>. This angle defines how 'wide' or 'narrow' the cone appears. It's used in <strong>geometry formulas</strong> for optics, acoustics, and engineering applications involving cones."
      },
      {
        question: "How are cones used in engineering?",
        answer: "Engineers use <strong>cone calculations</strong> for: <strong>funnel design</strong> (flow rate optimization), <strong>speaker design</strong> (sound projection), <strong>gear teeth</strong> (bevel gears are conical), <strong>manufacturing</strong> (turned parts), and <strong>aerodynamics</strong> (nose cones on aircraft and rockets)."
      }
    ],
    cube: [
      {
        question: "What is the formula for cube volume?",
        answer: "The <strong>cuboid volume formula</strong> is <strong>V = l × w × h</strong>, where <strong>l</strong> is length, <strong>w</strong> is width, and <strong>h</strong> is height. This is one of the most basic <strong>geometry formulas</strong> and part of every <strong>geometry formula sheet</strong>."
      },
      {
        question: "Where can I find equations for geometry including cube formulas?",
        answer: "Our interactive tool provides <strong>equations for geometry</strong> including the complete <strong>cuboid volume formula</strong>. Access our <strong>geometry formula sheet</strong> with <strong>area formulas for all shapes</strong> and volume calculations."
      },
      {
        question: "How do I calculate surface area of a cube?",
        answer: "The <strong>surface area formula</strong> is <strong>S = 2(lw + lh + wh)</strong>, which accounts for all six rectangular faces. For a perfect <strong>cube</strong>: <strong>S = 6s²</strong>. These are fundamental <strong>basic geometry formulas</strong>."
      },
      {
        question: "What's the difference between cube and cuboid?",
        answer: "A <strong>cube</strong> has all equal sides (<strong>s³</strong>), while a <strong>cuboid</strong> (rectangular prism) can have different length, width, and height (<strong>l × w × h</strong>). Both use important <strong>geometry formulas</strong>."
      },
      {
        question: "How do I find the diagonal of a cube?",
        answer: "The space diagonal of a <strong>cube</strong> is <strong>d = s√3</strong>, where <strong>s</strong> is the side length. This comes from applying the <strong>Pythagorean theorem</strong> twice. This is one of the useful <strong>general geometry formulas</strong>."
      },
      {
        question: "What is the formula for volume of a rectangular box?",
        answer: "The <strong>cuboid volume formula</strong> is <strong>V = l × w × h</strong> (length × width × height). This simple formula applies to all rectangular boxes and is one of the most practical <strong>basic geometry formulas</strong> for everyday use."
      },
      {
        question: "How do I calculate the space diagonal of a cuboid?",
        answer: "The space diagonal is <strong>d = √(l² + w² + h²)</strong>, derived from applying the <strong>Pythagorean theorem</strong> in 3D. This is essential for determining if an object will fit diagonally in a box or room."
      },
      {
        question: "What is the face diagonal of a cube?",
        answer: "Each face of a cube is a square, so the face diagonal is <strong>d = s√2</strong> (where s is side length). This uses the <strong>Pythagorean theorem</strong>: d² = s² + s² = 2s², so d = s√2. These are key <strong>geometry formulas</strong>."
      },
      {
        question: "How do I find dimensions of a box from volume?",
        answer: "If you know volume and two dimensions, find the third: <strong>h = V/(l × w)</strong>. If you only know volume for a cube, <strong>s = ³√V</strong> (cube root of volume). This algebraic manipulation of <strong>geometry formulas</strong> is essential for problem-solving."
      },
      {
        question: "What is the volume of a cube with side length 5?",
        answer: "Using the <strong>cuboid volume formula</strong> for a cube: <strong>V = s³ = 5³ = 125</strong>. Similarly, surface area would be <strong>S = 6s² = 6(25) = 150</strong>. These calculations demonstrate how <strong>geometry formulas</strong> work."
      },
      {
        question: "How are cuboid formulas used in shipping?",
        answer: "Shipping companies use <strong>cuboid volume calculations</strong> for: <strong>dimensional weight</strong> (volume ÷ dimensional factor), <strong>maximizing container load</strong> (fitting more boxes), <strong>packaging design</strong>, and <strong>storage capacity</strong> planning. These are practical <strong>geometry formula</strong> applications."
      },
      {
        question: "What is the relationship between cube volume and surface area?",
        answer: "For a cube with side s: Volume = s³, Surface Area = 6s². The ratio V:SA = s:6, meaning larger cubes have proportionally less surface area per unit volume. This is the <strong>square-cube law</strong>, important in <strong>general geometry formulas</strong>."
      },
      {
        question: "How do I calculate the volume of an L-shaped room?",
        answer: "Divide the L-shape into two rectangles, calculate each using <strong>V = l × w × h</strong>, then add them. This 'decomposition method' applies <strong>cuboid volume formulas</strong> to complex shapes by breaking them into simple components."
      },
      {
        question: "What real-world objects are cuboids?",
        answer: "Cuboids are everywhere: <strong>boxes</strong>, <strong>rooms</strong>, <strong>shipping containers</strong>, <strong>books</strong>, <strong>bricks</strong>, <strong>refrigerators</strong>, <strong>TVs</strong>, <strong>suitcases</strong>, and <strong>buildings</strong>. The <strong>cuboid volume formula</strong> is essential for calculating storage, capacity, and dimensions."
      },
      {
        question: "How do architects use cuboid formulas?",
        answer: "Architects use <strong>cuboid calculations</strong> for: <strong>room volume</strong> (for HVAC sizing), <strong>material estimation</strong> (concrete, lumber), <strong>space planning</strong> (furniture fit), <strong>building costs</strong>, and <strong>structural load</strong> calculations. These <strong>geometry formulas</strong> are fundamental to architecture."
      }
    ],
    pythagorean: [
      {
        question: "What is the Pythagorean theorem formula?",
        answer: "The <strong>Pythagorean theorem</strong> is one of the most important <strong>geometry formulas</strong>: <strong>a² + b² = c²</strong>, where '<strong>a</strong>' and '<strong>b</strong>' are the legs of a right triangle, and '<strong>c</strong>' is the hypotenuse. This is essential for any <strong>geometry formula sheet</strong>."
      },
      {
        question: "Where can I find basic geometry formulas like the Pythagorean theorem?",
        answer: "Our interactive tool provides access to <strong>basic geometry formulas</strong> including the Pythagorean theorem. The complete <strong>geometry formula sheet</strong> includes <strong>area formulas for all shapes</strong> and <strong>equations for geometry</strong>."
      },
      {
        question: "How do I use the Pythagorean theorem step by step?",
        answer: "<strong>Step 1:</strong> Identify the two legs (a, b) and hypotenuse (c).\n<strong>Step 2:</strong> Square the lengths of the legs.\n<strong>Step 3:</strong> Add the squares.\n<strong>Step 4:</strong> Take the square root to find the unknown side. This demonstrates how <strong>geometry formulas</strong> work."
      },
      {
        question: "What are common Pythagorean triples?",
        answer: "Famous triples include <strong>(3, 4, 5)</strong>, <strong>(5, 12, 13)</strong>, <strong>(8, 15, 17)</strong>, and <strong>(7, 24, 25)</strong>. These are sets of whole numbers that satisfy <strong>a² + b² = c²</strong> and are part of <strong>general geometry formulas</strong>."
      },
      {
        question: "Why is the Pythagorean theorem important?",
        answer: "It's used in construction (<strong>3-4-5 triangles</strong> for right angles), navigation (GPS), computer graphics (distance calculations), physics (vectors), and countless real-world applications. This is one of the most essential <strong>equations for geometry</strong>."
      },
      {
        question: "How do I find the missing side of a right triangle?",
        answer: "To find hypotenuse <strong>c</strong>: <strong>c = √(a² + b²)</strong>. To find leg <strong>a</strong>: <strong>a = √(c² - b²)</strong>. To find leg <strong>b</strong>: <strong>b = √(c² - a²)</strong>. These rearrangements of the <strong>Pythagorean theorem formula</strong> are essential problem-solving skills."
      },
      {
        question: "What is the converse of the Pythagorean theorem?",
        answer: "If <strong>a² + b² = c²</strong>, then the triangle is a right triangle with angle C = 90°. This converse allows you to <strong>prove</strong> a triangle is right-angled and is one of the powerful <strong>geometry formulas</strong> for geometric proofs."
      },
      {
        question: "How is the Pythagorean theorem used in construction?",
        answer: "Builders use <strong>3-4-5 triangles</strong> to ensure perfect right angles: mark 3 units on one wall, 4 units on the adjacent wall, and the diagonal should measure exactly 5 units. This practical application of <strong>Pythagorean theorem formulas</strong> ensures square corners."
      },
      {
        question: "What is the Pythagorean theorem in 3D?",
        answer: "For a 3D box with dimensions x, y, z: the space diagonal is <strong>d = √(x² + y² + z²)</strong>. This extends the <strong>Pythagorean theorem</strong> to three dimensions and is essential for <strong>general geometry formulas</strong> in engineering and physics."
      },
      {
        question: "How many proofs of the Pythagorean theorem exist?",
        answer: "There are over <strong>350 known proofs</strong>! Famous ones include: <strong>rearrangement proof</strong> (Chinese), <strong>similar triangles proof</strong>, <strong>Euclid's windmill proof</strong>, <strong>President Garfield's proof</strong>, and <strong>calculus proofs</strong>. This diversity shows the depth of <strong>geometry formulas</strong>."
      },
      {
        question: "Who discovered the Pythagorean theorem?",
        answer: "Although named after <strong>Pythagoras</strong> (570-495 BCE), the theorem was known to <strong>Babylonians</strong> (1900-1600 BCE) and <strong>Egyptians</strong> centuries earlier. Pythagoras or his school may have provided the first <strong>formal proof</strong>, establishing it among <strong>basic geometry formulas</strong>."
      },
      {
        question: "How does GPS use the Pythagorean theorem?",
        answer: "GPS uses <strong>trilateration</strong>, an extension of the <strong>Pythagorean theorem</strong>. By measuring distance from multiple satellites (calculated from signal travel time), your receiver determines your position as the intersection point, using <strong>3D geometry formulas</strong>."
      },
      {
        question: "What are primitive Pythagorean triples?",
        answer: "<strong>Primitive triples</strong> have no common factor: (3,4,5), (5,12,13), (8,15,17). Non-primitive multiples include (6,8,10) and (9,12,15). Euclid's formula generates all primitive triples: <strong>a = m² - n²</strong>, <strong>b = 2mn</strong>, <strong>c = m² + n²</strong>."
      },
      {
        question: "How is the Pythagorean theorem used in computer graphics?",
        answer: "Graphics programmers use the theorem for: <strong>distance calculations</strong> between pixels, <strong>collision detection</strong> in games, <strong>lighting calculations</strong>, <strong>3D rendering</strong> (projection formulas), and <strong>vector normalization</strong>. These applications make it one of the most used <strong>geometry formulas</strong> in computing."
      },
      {
        question: "What is the distance formula derived from Pythagorean theorem?",
        answer: "The distance between two points (x₁, y₁) and (x₂, y₂) is <strong>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</strong>. This <strong>distance formula</strong> is the <strong>Pythagorean theorem</strong> applied to coordinate geometry and is fundamental to <strong>analytic geometry</strong>."
      }
    ]
  };

  const currentFAQs = faqData[shape] || faqData.sphere;

  // Generate FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": currentFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
      }
    }))
  };

  return (
    <>
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* FAQ Section UI */}
      <section className="mt-12 bg-swiss-white border-2 border-swiss-black p-8 rounded-swiss-sm">
        <h2 className="font-serif-display text-display-2xl text-swiss-black mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {currentFAQs.map((faq, index) => (
            <div
              key={index}
              className="border-b-2 border-divider-gray pb-4 last:border-0"
            >
              <h3 className="font-sans-body text-display-base font-semibold text-swiss-black mb-2">
                {faq.question}
              </h3>
              <p
                className="font-sans-body text-display-base text-swiss-charcoal"
                dangerouslySetInnerHTML={{
                  __html: faq.answer.replace(/\n/g, '<br /><br />')
                }}
              ></p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default FAQSection;
