import React, { useState } from "react";
import emailjs from "@emailjs/browser";

const About = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .send(
        "", //  EmailJS service ID
        "", // template ID
        formData,
        "" // EmailJS public key
      )
      .then(
        (result) => {
          console.log("Email successfully sent:", result.text);
          setSuccessMsg("✅ Message successfully sent!");
          setFormData({ name: "", email: "", message: "" });
          setShowForm(false);
          setTimeout(() => setSuccessMsg(""), 3000); // Auto-hide success message after 3s
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send message.");
        }
      );
  };

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

      <div className="py-8 flex flex-col items-center gap-4">
        <h1 className="text-2xl font-semibold">Questions?</h1>

        {/* Success Message */}
        {successMsg && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-4 rounded-lg shadow text-lg text-center mb-4">
            ✅ Message successfully sent!
          </div>
        )}

        {/* Contact Us Button */}
        {!successMsg && (
          <button
            className="px-8 py-4 rounded-lg btn text-black font-medium"
            style={{ backgroundColor: "#fba2df" }}
            onClick={() => setShowForm(true)}
          >
            Contact Us
          </button>
        )}

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3 relative">
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>

              <h2 className="text-2xl font-semibold text-center mb-6">
                Send us a message
              </h2>

              <form onSubmit={sendEmail} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="border p-2 rounded w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="border p-2 rounded w-full"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <textarea
                  placeholder="Your Message"
                  className="border p-2 rounded w-full h-32"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
                <button
                  type="submit"
                  className="mt-4 bg-pink-300 hover:bg-pink-400 text-black font-medium py-2 rounded-lg"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
