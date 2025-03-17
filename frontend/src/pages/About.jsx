import React from 'react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Top Section / Hero */}
      <section className="bg-secondary text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">About Us</h1>
        <h2 className="text-2xl">The SafetyNet of Community Care</h2>
      </section>

      {/* Main Content Section */}
      <section className="bg-bg_grey py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Why the Map? */}
          <div>
            <h3 className="text-xl font-bold mb-2">Why the Map?</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ac
              ligula sit amet eros pretium vehicula. Suspendisse feugiat risus
              vitae odio auctor, vitae faucibus orci rutrum. Donec vitae elit
              nunc. Sed in neque sed risus blandit eleifend.
            </p>
          </div>

          {/* What is Holistic Safety? */}
          <div>
            <h3 className="text-xl font-bold mb-2">What is Holistic Safety?</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              gravida placerat arcu, sed finibus nisi pellentesque vitae. Proin
              accumsan vulputate massa nec vehicula.
            </p>
          </div>

          {/* Who is behind the map? */}
          <div>
            <h3 className="text-xl font-bold mb-2">Who is behind the map?</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              vestibulum neque ac lorem ultrices, ac fermentum velit vulputate.
            </p>
          </div>

          {/* What will happen to my data? */}
          <div>
            <h3 className="text-xl font-bold mb-2">What will happen to my data?</h3>
            <p className="text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              tincidunt gravida libero, quis congue velit luctus in. Vestibulum
              eget orci lectus.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action / Questions Button */}
      <section className="py-8 flex justify-center">
        <button className="btn btn-primary">Questions?</button>
      </section>

      {/* Footer */}
      <footer className="bg-purple-200 text-center p-8 mt-auto">
        <p className="text-lg font-bold mb-1">Lorem Ipsum Safety Page!</p>
        <p className="mb-2">Contact: email@email.org</p>
        <p>
          A project of <span className="font-bold">NP</span> &amp; 
          <span className="font-bold"> DSSD</span>
        </p>
      </footer>
    </div>
  );
};

export default About;
  
