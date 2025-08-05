import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const [course, setCourse] = useState(null);

  const token = JSON.parse(localStorage.getItem("user"));

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/api/v1/course/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        toast.error("Failed to fetch course details");
      }
    };
    fetchCourse();
  }, [courseId]);

  // Purchase Handler
  const handlePurchased = async () => {
    if (!token) {
      toast.error('Please login to purchase the course');
      return navigate("/login");
    }

    if (!cardNumber || !month || !year || !cvv) {
      return setError("Please fill all payment details.");
    }

    if (cardNumber.length !== 12) {
      return setError("Card number must be 12 digits.");
    }

    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
      return setError("Invalid month (01-12).");
    }

    if (cvv.length !== 3) {
      return setError("CVV must be 3 digits.");
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4001/api/v1/course/buy/${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );


      toast.success(response.data.message || 'Course purchased successfully');
      navigate("/purchases");
    } catch (error) {
      if (error.response.status === 400) {
        toast.success("You have already purchased this course");
        navigate("/purchases");
      } else {
        toast.error(error.response?.data?.errors || "Purchase failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Input Handlers
  const handleCardChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCardNumber(value);
    setError("");
  };

  const handleMonthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setMonth(value);
    if (value && (parseInt(value) < 1 || parseInt(value) > 12)) {
      setError("Invalid month (01-12).");
    } else {
      setError("");
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setYear(value);
    setError("");
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Order Summary */}
        {course && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <p className="text-gray-700 mb-2">You're about to purchase this course:</p>
            <h3 className="text-lg font-bold">Course: {course.title} </h3>
            <span>Price: </span><span className="text-green-700 font-semibold text-sm"> 
            ₹ {course.price -course.price*20/100} only
            </span>
          </div>
        )}

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Payment Details</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Card Number (12 digits)"
              value={cardNumber}
              onChange={handleCardChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="MM"
                value={month}
                onChange={handleMonthChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="YY"
                value={year}
                onChange={handleYearChange}
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
            </div>
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={handleCvvChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handlePurchased}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Buy;
