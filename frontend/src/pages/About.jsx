import React from "react";

const About = () => {
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-purple-100">
        {/* Main Content Section */}
        <section className="py-12 px-8 md:px-16 lg:px-24">
          <div className="max-w-5xl mx-auto space-y-24">
            {/* Why the Map? */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <h3 className="text-3xl font-bold text-indigo-900 w-full md:w-1/5">
                Why
                <br />
                the
                <br />
                Map?
              </h3>
              <p className="text-indigo-900 w-full md:w-4/5 max-w-2xl">
                In times of crisis, it's crucial for organizations and
                communities to connect easily and share resources. Rather than
                being overwhelmed by a flood of information, having a central
                place to access what's needed can prevent disconnection from one
                another and remind everyone that they aren't alone.
              </p>
            </div>

            {/* What is Holistic Safety? */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <h3 className="text-3xl font-bold text-indigo-900 w-full md:w-1/5">
                What is
                <br />
                Holistic
                <br />
                Safety?
              </h3>
              <p className="text-indigo-900 w-full md:w-4/5 max-w-2xl">
                Holistic safety is an approach that focuses on the overall well-
                being of individuals and communities. It goes beyond physical
                safety, addressing emotional, mental, and social needs to ensure
                long-term stability and resilience, especially in times of
                crisis.
              </p>
            </div>

            {/* Who is behind the map? */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <h3 className="text-3xl font-bold text-indigo-900 w-full md:w-1/5">
                Who is
                <br />
                behind
                <br />
                the map?
              </h3>
              <div className="w-full md:w-4/5 text-indigo-900 space-y-6 max-w-2xl">
                <p>
                  <strong>Nonviolent Peaceforce (NP)</strong> is an
                  international organization focused on Unarmed Civilian
                  Protection, working side-by-side with communities to foster
                  peace, safeguard human lives and dignity, and build safer,
                  more resilient communities through unarmed strategies.
                </p>
                <p>
                  <strong>
                    Data Science for Sustainable Development (DSSD)
                  </strong>{" "}
                  partners organizations, companies, and academic institutions
                  to tackle the technical and ethical challenges in sustainable
                  development through data.
                </p>
                <p>
                  NP and DSSD (UW-Madison) have teamed up to combine
                  peacebuilding and data science, enhancing community responses
                  by using data-driven solutions to connect users and promote
                  resilience.
                </p>
              </div>
            </div>

            {/* What happens to my data? */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-16">
              <h3 className="text-3xl font-bold text-indigo-900 w-full md:w-1/5">
                What
                <br />
                happens
                <br />
                to my
                <br />
                data?
              </h3>
              <p className="text-indigo-900 w-full md:w-4/5 max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </section>
      </div>
      {/* Call to Action / Questions Button */}
      <div className="py-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Questions?</h1>
        <button
          className="px-8 py-4 rounded-lg btn text-black font-medium"
          style={{ backgroundColor: "#fba2df" }}
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default About;
