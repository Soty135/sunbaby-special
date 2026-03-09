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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="bg-gray-200 rounded-full w-48 h-48 mx-auto flex items-center justify-center">
                <span className="text-6xl">👨‍🍳</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Chef [Founder's Name]
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                With over 15 years of culinary experience, our founder has a passion for creating 
                delicious, memorable dining experiences. Having worked in prestigious restaurants 
                across the country, they decided to bring their expertise and love for food to 
                create Sunbaby Special.
              </p>
              <p className="text-gray-600 leading-relaxed">
                "Food is not just about nourishment; it's about bringing people together, 
                creating memories, and sharing love through every bite. That's the philosophy 
                behind Sunbaby Special."
              </p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-green-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Our Mission</h2>
          <div className="space-y-4">
            <p className="text-green-100 leading-relaxed">
              At Sunbaby Special, our mission is to provide exceptional dining experiences 
              by combining high-quality ingredients, innovative recipes, and outstanding service. 
              We are committed to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-green-100">
              <li>Using only the freshest, locally-sourced ingredients</li>
              <li>Creating dishes that delight and satisfy every palate</li>
              <li>Providing excellent customer service that exceeds expectations</li>
              <li>Maintaining the highest standards of food safety and hygiene</li>
              <li>Building a community around good food and shared experiences</li>
            </ul>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We envision becoming the most beloved food destination in our community, known for 
            our consistency, quality, and innovation. Our goal is to expand our reach while 
            maintaining the personal touch and attention to detail that makes every order special.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We strive to be more than just a food service – we want to be a part of your 
            celebrations, comfort your difficult days, and make every meal an experience 
            worth remembering.
          </p>
        </div>

        {/* Values Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <span className="text-2xl text-green-600">🌟</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Quality</h3>
                <p className="text-gray-600 text-sm">
                  Never compromise on the quality of ingredients or preparation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl text-green-600">❤️</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Passion</h3>
                <p className="text-gray-600 text-sm">
                  Put love and passion into every dish we create.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl text-green-600">🤝</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Integrity</h3>
                <p className="text-gray-600 text-sm">
                  Conduct business with honesty and transparency.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl text-green-600">🚀</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">
                  Continuously improve and innovate our offerings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg mb-6">
            Thank you for choosing Sunbaby Special. We look forward to serving you!
          </p>
          <button
            onClick={() => window.open('https://wa.me/1234567890?text=Hello! I would like to know more about Sunbaby Special.', '_blank')}
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