import React, { useState } from 'react';

const AddYours = () => {
    //form state
    const [formData, setFormData] = useState({
        orgName: '',
        url: '',
        location: '',
        email: '',
        phone: '',
        categoryTags: '',
        extraTags: '',
        description: '',
      });
    

      const handleChange = (e) => {
        const { name, value } = e.target; //destructures, gets the name and then the value
        setFormData((prev) => ({ //updates form data
          ...prev, //includes old values 
          [name]: value, //updates just the field containing the name
        }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
       
      };
    
  return (
    <div className="flex flex-col min-h-screen">

      {/* Top Section / Hero */}
      <section className="bg-indigo-950 text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-2">Add Your Own</h1>
        <h2 className="text-2xl">The SafetyNet of Community Care</h2>
      </section>

      {/* Main Content Section */}
      <section className="bg-indigo-950 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
         
          <div>
            <h3 className="text-xl text-white font-bold mb-2">Add Your Resource</h3>
            <p className="text-gray-700">
            
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
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


          </div>

          
        </div>
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

export default AddYours;
  
