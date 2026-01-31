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
        answer: "The formula for <strong>sphere volume</strong> is <strong>V = (4/3)πr³</strong>, where <strong>r</strong> is the radius. This means volume equals four-thirds times pi times the radius cubed."
      },
      {
        question: "How do I calculate the volume of a sphere step by step?",
        answer: "<strong>Step 1:</strong> Measure the radius (r).\n<strong>Step 2:</strong> Cube the radius (r³ = r × r × r).\n<strong>Step 3:</strong> Multiply by pi (π ≈ 3.14159).\n<strong>Step 4:</strong> Multiply by 4/3.\nThe result is the <strong>volume</strong>."
      },
      {
        question: "Why is the volume of a sphere 4/3 πr³?",
        answer: "Archimedes discovered that a <strong>sphere</strong> occupies exactly 2/3 of its surrounding <strong>cylinder</strong>. The <strong>formula</strong> comes from calculus integration over spherical coordinates."
      },
      {
        question: "What is the relationship between sphere radius and volume?",
        answer: "<strong>Volume</strong> scales with the cube of radius. Doubling radius increases <strong>volume</strong> 8x (2³ = 8). Tripling radius increases <strong>volume</strong> 27x (3³ = 27). This non-linear relationship is why large objects have much larger <strong>volumes</strong>."
      }
    ],
    cylinder: [
      {
        question: "What is the formula for cylinder volume?",
        answer: "The <strong>formula</strong> for <strong>cylinder volume</strong> is <strong>V = πr²h</strong>, where <strong>r</strong> is the radius of the circular base and <strong>h</strong> is the height. Multiply the area of the base (<strong>πr²</strong>) by the height."
      },
      {
        question: "How do I calculate cylinder surface area?",
        answer: "The <strong>surface area formula</strong> is <strong>S = 2πr(r + h)</strong>, which includes both circular bases (<strong>2πr²</strong>) and the curved surface (<strong>2πrh</strong>)."
      },
      {
        question: "What's the difference between volume and surface area?",
        answer: "<strong>Volume</strong> measures the space inside (<strong>V = πr²h</strong>), while <strong>surface area</strong> measures the total area of all surfaces (<strong>S = 2πr(r + h)</strong>)."
      },
      {
        question: "How does changing radius affect cylinder volume?",
        answer: "<strong>Volume</strong> scales with the square of radius. Doubling the radius increases <strong>volume</strong> 4x (2² = 4), while doubling height only doubles <strong>volume</strong>."
      }
    ],
    cone: [
      {
        question: "What is the formula for cone volume?",
        answer: "The <strong>formula</strong> for <strong>cone volume</strong> is <strong>V = (1/3)πr²h</strong>, where <strong>r</strong> is the base radius and <strong>h</strong> is the height. The 1/3 factor means a <strong>cone</strong> holds one-third the <strong>volume</strong> of a <strong>cylinder</strong> with same dimensions."
      },
      {
        question: "Why is cone volume 1/3 of cylinder volume?",
        answer: "This can be proven using calculus integration or by showing that three <strong>cones</strong> of identical base and height can exactly fill one <strong>cylinder</strong>."
      },
      {
        question: "How do I calculate cone surface area?",
        answer: "The <strong>surface area formula</strong> is <strong>S = πr(r + l)</strong>, where <strong>l</strong> is the slant height calculated as <strong>l = √(r² + h²)</strong>. This includes the base (<strong>πr²</strong>) and the curved surface (<strong>πrl</strong>)."
      },
      {
        question: "What is slant height in a cone?",
        answer: "<strong>Slant height</strong> (l) is the distance from the apex to any point on the base edge, calculated as <strong>l = √(r² + h²)</strong> using the <strong>Pythagorean theorem</strong>."
      }
    ],
    cube: [
      {
        question: "What is the formula for cube volume?",
        answer: "The <strong>formula</strong> for <strong>cuboid volume</strong> is <strong>V = l × w × h</strong>, where <strong>l</strong> is length, <strong>w</strong> is width, and <strong>h</strong> is height. For a perfect <strong>cube</strong> where all sides are equal: <strong>V = s³</strong>."
      },
      {
        question: "How do I calculate surface area of a cube?",
        answer: "The <strong>surface area formula</strong> is <strong>S = 2(lw + lh + wh)</strong>, which accounts for all six rectangular faces. For a perfect <strong>cube</strong>: <strong>S = 6s²</strong>."
      },
      {
        question: "What's the difference between cube and cuboid?",
        answer: "A <strong>cube</strong> has all equal sides (<strong>s³</strong>), while a <strong>cuboid</strong> (rectangular prism) can have different length, width, and height (<strong>l × w × h</strong>)."
      },
      {
        question: "How do I find the diagonal of a cube?",
        answer: "The space diagonal of a <strong>cube</strong> is <strong>d = s√3</strong>, where <strong>s</strong> is the side length. This comes from applying the <strong>Pythagorean theorem</strong> twice."
      }
    ],
    pythagorean: [
      {
        question: "What is the Pythagorean theorem formula?",
        answer: "The <strong>Pythagorean theorem</strong> states: <strong>a² + b² = c²</strong>, where '<strong>a</strong>' and '<strong>b</strong>' are the legs of a right triangle, and '<strong>c</strong>' is the hypotenuse (the longest side)."
      },
      {
        question: "How do I use the Pythagorean theorem step by step?",
        answer: "<strong>Step 1:</strong> Identify the two legs (a, b) and hypotenuse (c).\n<strong>Step 2:</strong> Square the lengths of the legs.\n<strong>Step 3:</strong> Add the squares.\n<strong>Step 4:</strong> Take the square root to find the unknown side."
      },
      {
        question: "What are common Pythagorean triples?",
        answer: "Famous triples include <strong>(3, 4, 5)</strong>, <strong>(5, 12, 13)</strong>, <strong>(8, 15, 17)</strong>, and <strong>(7, 24, 25)</strong>. These are sets of whole numbers that satisfy <strong>a² + b² = c²</strong>."
      },
      {
        question: "Why is the Pythagorean theorem important?",
        answer: "It's used in construction (<strong>3-4-5 triangles</strong> for right angles), navigation (GPS), computer graphics (distance calculations), physics (vectors), and countless real-world applications."
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
