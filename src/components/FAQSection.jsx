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
