import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About Sunbaby Special
          </h1>
          <div className="w-24 h-1 bg-green-600 mx-auto"></div>
        </div>

        {/* Founder Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Founder</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1">
              <img
                src="/images/chef.jpeg"
                alt="Sunbaby Special"
                className="rounded-full w-48 h-48 mx-auto object-cover object-top"
              />
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Chef Sunbaby (Esther Douglas)
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                With over 15 years of culinary mastery honed in the kitchens of the country's most prestigious restaurants, Chef Sunbaby (Esther Douglas) is the visionary force behind Sunbaby Special. While her technical expertise is undeniable, it is her presence that truly commands the room. With a radiant, effortless smile and a voice so uniquely melodic it compels people to stop and listen, Chef Sunbaby doesn't just cook—she narrates a story through flavor.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">● The Philosophy</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                For Chef Sunbaby, a plate is more than a meal; it is a medium for connection.
                "Food is not just about nourishment; it's about bringing people together, creating memories, and sharing love through every bite. That's the philosophy behind Sunbaby Special."
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Why Sunbaby Special?</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800">● Expert Craftsmanship:</h4>
                  <p className="text-gray-600">Built on 15+ years of high-end culinary experience.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">● Signature Style:</h4>
                  <p className="text-gray-600">A blend of technical precision and soulful, memory-making flavors.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">● Personal Connection:</h4>
                  <p className="text-gray-600">Driven by Esther's belief that the best meals are those shared with love.</p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mt-4">
                Whether she is orchestrating a kitchen or sharing her latest culinary inspiration, Chef Sunbaby ensures that every guest leaves with more than just a full stomach—they leave with a memory.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg mb-6">
            Thank you for choosing Sunbaby Special. We look forward to serving you!
          </p>
          <button
            onClick={() => window.open('https://wa.me/12404180905?text=Hello! I would like to know more about Sunbaby Special.', '_blank')}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            Contact Us on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;