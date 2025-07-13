import { useState } from "react"; // State for toggling dropdowns
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import Footer from "../../components/Footer.jsx";
import Navbar from "../../components/Navbar.jsx";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null); // Tracks which FAQ is open

  const toggleDropdown = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is UrbanNest?",
      answer:
        "UrbanNest is an online platform that allows users to rent flats and apartments with ease. It connects property owners with potential renters, providing an easy-to-use interface for browsing available listings, managing bookings, and making payments securely.",
    },
    {
      question: "How do I make a booking?",
      answer:
        "To make a booking, sign up for an account, browse available properties, select one, choose rental dates, enter payment details, and confirm your booking. You will receive a confirmation email once the booking is successfully made.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking, but cancellation policies may vary depending on the property owner. Please refer to the terms and conditions provided by the property owner for their specific cancellation policy.",
    },
    {
      question: "Are the rental listings on UrbanNest.com verified?",
      answer:
        "Yes, UrbanNest verifies rental listings by partnering with property owners and performing quality checks to ensure authenticity.",
    },
    {
      question: "How can I list my property for rent on UrbanNest.com?",
      answer:
        "You can list your property by creating an account, providing property details, uploading images, setting a rental price, and submitting the listing for review.",
    },
    {
      question: "Can I search for properties based on specific criteria?",
      answer:
        "Yes, UrbanNest.com allows users to filter properties based on location, price range, number of bedrooms, amenities, and more.",
    },
    {
      question: "Is it safe to rent a property through UrbanNest.com?",
      answer:
        "UrbanNest takes safety seriously by ensuring all listings are verified, providing secure payment options, and allowing user reviews to maintain transparency.",
    },
    {
      question: "Can I negotiate rental terms with property owners on UrbanNest.com?",
      answer:
        "Yes, you can communicate with property owners through the UrbanNest messaging system to discuss rental terms before making a booking.",
    },
    {
      question: "Are there any fees associated with using UrbanNest.com?",
      answer:
        "UrbanNest.com does not charge renters a fee for searching and booking properties, but there may be service fees for certain transactions.",
    },
    {
      question: "Can I schedule property viewings through UrbanNest.com?",
      answer:
        "Yes, many property owners offer scheduled viewings, which can be arranged through the platform.",
    },
    {
      question: "How can I get assistance if I have questions or need support?",
      answer:
        "You can contact UrbanNest support via email, live chat, or phone for assistance with any issues or inquiries.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 md:px-6 py-10 flex-grow">
        <h1 className="text-3xl font-bold text-center mb-8 text-orange-600">
          Frequently Asked Questions (FAQ)
        </h1>

        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <div
              className="flex justify-between items-center bg-orange-100 p-4 rounded-lg cursor-pointer shadow-md"
              onClick={() => toggleDropdown(index)}
            >
              <h2 className="text-xl font-semibold text-gray-700">
                {faq.question}
              </h2>
              <button className="text-orange-500 hover:text-orange-700 transition duration-200">
                {openIndex === index ? (
                  <FaChevronUp className="text-xl" />
                ) : (
                  <FaChevronDown className="text-xl" />
                )}
              </button>
            </div>

            {openIndex === index && (
              <div className="p-4 bg-white rounded-b-lg shadow-inner">
                <p className="text-lg text-gray-700">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
