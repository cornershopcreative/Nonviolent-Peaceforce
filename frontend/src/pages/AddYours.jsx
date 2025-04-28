import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust this path if needed

const AddYours = () => {
  const [formData, setFormData] = useState({
    orgName: "",
    url: "",
    location: "",
    email: "",
    phone: "",
    categoryTags: "",
    extraTags: "",
    description: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const addToBackend = async (data) => {
    try {
      await addDoc(collection(db, "submitted_resources"), data);
      console.log("✅ Data added to Firebase");
    } catch (err) {
      console.error("❌ Firebase error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const extractCityFromLocation = (loc) => { // could be implemented later
  //   const match = loc.match(/,\s*([A-Za-z\s]+),\s*[A-Z]{2}/);
  //   return match ? match[1].trim() : "";
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      orgName,
      url,
      location,
      email,
      phone,
      categoryTags,
      extraTags,
      description,
    } = formData;

    const isEmpty =
      !orgName || !url || !location || !email || !phone || !description;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;

    if (isEmpty) {
      alert("❌ All fields except tags must be filled out.");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("❌ Please enter a valid email address.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("❌ Please enter a valid phone number.");
      return;
    }

    let digits = phone.replace(/\D/g, "");
    if (digits.length === 10) digits = "1" + digits;
    const standardizedPhone = "+" + digits;

    const dataForFirestore = {
      "Organization Name": orgName,
      "Website URL": url,
      "Location (links for mult. locations)": location,
      "Contact Info": standardizedPhone,
      "Description of Resources": description,
      "Category of Resources": categoryTags || null,
      "Other Category?": extraTags || null,
      "Other Tags": null,
      submittedAt: new Date().toISOString(),
    };

    try {
      await addToBackend(dataForFirestore);
      localStorage.setItem(orgName, JSON.stringify(dataForFirestore));
    } catch (err) {
      console.error("❌ Sync error:", err);
    }

    setFormData({
      orgName: "",
      url: "",
      location: "",
      email: "",
      phone: "",
      categoryTags: "",
      extraTags: "",
      description: "",
    });

    setSuccessMsg(`✅Form successfully submitted for "${orgName}"`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-indigo-950 text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Add Your Resource</h1>
      </section>

      <section className="bg-indigo-950 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            {successMsg ? (
              <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-10 rounded-lg mt-6 text-2xl font-bold shadow-md text-center">
                {successMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Org name"
                      name="orgName"
                      value={formData.orgName}
                      onChange={handleChange}
                      className="w-full p-2 border-2 text-white border-pink-300 bg-transparent placeholder-pink-200 rounded"
                    />
                    <input
                      type="url"
                      name="url"
                      placeholder="https://URL.com"
                      value={formData.url}
                      onChange={handleChange}
                      className="w-full p-2 border-2 text-white border-pink-300 bg-transparent placeholder-pink-200 rounded"
                    />
                    <textarea
                      name="location"
                      placeholder="Location(s)"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-2 border-2 text-white border-pink-300 bg-transparent placeholder-pink-200 rounded h-20"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border-2 text-white border-pink-300 bg-transparent placeholder-pink-200 rounded"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 border-2 text-white border-pink-300 bg-transparent placeholder-pink-200 rounded"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        name="categoryTags"
                        placeholder="Category Tag(s)"
                        value={formData.categoryTags}
                        onChange={handleChange}
                        className="w-full p-2 border-2 text-white bg-purple-200 text-black-800 placeholder-purple-600 rounded"
                      />
                      <input
                        type="text"
                        placeholder="... Tag(s)"
                        name="extraTags"
                        value={formData.extraTags}
                        onChange={handleChange}
                        className="w-full p-2 border-2 text-white bg-purple-200 text-black-800 placeholder-purple-600 rounded"
                      />
                    </div>
                    <textarea
                      placeholder="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full p-2 border-2 text-white bg-transparent rounded h-40"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-purple-300 hover:bg-purple-400 text-purple-900 font-bold py-2 px-6 rounded shadow"
                  >
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddYours;
