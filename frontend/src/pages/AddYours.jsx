import React, { useState } from "react";

const AddYours = () => {
  //form state
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

  const [successMsg, setSuccessMsg] = useState('');

  //FOR FUTURE USE: adding JSON to backend Database
  const addToBackend = async (data) => {
    try {
      const response = await fetch("https://your-api.com/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),  //puts data into JSON 
      });
  
      if (!response.ok) throw new Error("Failed to sync");
  
      console.log("Synced to backend!");
    } catch (err) {
      console.error("Error syncing:", err);
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target; //destructures, gets the name and then the value
    setFormData((prev) => ({
      //updates form data
      ...prev, //includes old values
      [name]: value, //updates just the field containing the name
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //destructure form data
    const { orgName, url, location, email, phone, categoryTags, extraTags, description } = formData;

    //checking that all fields  are filled out and that 
    const isEmpty = !orgName || !url || !location || !email || !phone || !categoryTags || !extraTags || !description;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s\-().]{7,20}$/;
  
    if (isEmpty) {
      alert("❌ All fields must be filled out.");
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

    //Standardize phone number to put in DB (E.164)
    let digits = phone.replace(/\D/g, "");
    if (digits.length === 10) digits = "1" + digits;
    const standardizedPhone = "+" + digits;
  
    //updated object with standardized phone
    //Also adds time stamp in case an organization has repeats. 
    const cleanedFormData = { ...formData, phone: standardizedPhone,submittedAt: new Date().toISOString(), };

    let key = cleanedFormData.orgName
    localStorage.setItem(key, JSON.stringify(cleanedFormData)) //turn form data into JSON
    console.log("Form submitted:", cleanedFormData);


    //If you want to access a JSON org's data from local storage
    //const data = JSON.parse(localStorage.getItem("Your Org Name"));

    //When we actually connect to the Database
    addToBackend(cleanedFormData); // doesn't work right now

    //CLEAR FORM
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

    setSuccessMsg(`✅Form successfully submitted for "${key}"`);
    //Clear message after 3 seconds
    setTimeout(() => setSuccessMsg(''), 3000);

  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Section / Hero */}
      <section className="bg-indigo-950 text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Add Your Own</h1>
        <h2 className="text-2xl">The SafetyNet of Community Care</h2>
      </section>

    
      <section className="bg-indigo-950 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <h3 className="text-xl text-white font-bold mb-2">
              Add Your Resource
            </h3>
          
            {successMsg ? (
  <div className="bg-green-100 border border-green-400 text-green-800 px-6 py-10 rounded-lg mt-6 text-2xl font-bold shadow-md text-center">
    {successMsg}
  </div>
) : (
  <form onSubmit={handleSubmit} className="space-y-2">
    <div className="grid grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Org name"
          name="orgName"
          value={formData.orgName}
          onChange={handleChange}
          className="w-full p-2 border-2 text-white border-pink-300 bg-transparent  placeholder-pink-200 rounded"
        />
        <input
          type="url"
          name="url"
          placeholder="URL.com"
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

      {/* Right column */}
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

    {/* Submit button */}
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
