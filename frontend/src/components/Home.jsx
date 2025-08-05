import React, { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import logo from "../../public/logo.webp";
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import toast from 'react-hot-toast';

function Home() {

    const [courses, setCourses] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);


     // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
            "http://localhost:4001/api/v1/course/all",
            {
                withCredentials: true,
            }
        );
        // console.log("Courses fetched successfully", response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);


    // logout
    const handleLogout = async () => {
      try {
        const response = await axios.post("http://localhost:4001/api/v1/user/logout", {}, {
          withCredentials: true,
        });
    
        toast.success(response.data.message);
        localStorage.removeItem("user");
        setIsLoggedIn(false);
      } catch (error) {
        console.log("Error in logging out ", error);
        toast.error(error?.response?.data?.errors || "Error in logging out");
      }
    };
    


  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };



  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
        <div className='h-[1250px] md:h-[1050px] text-white container mx-auto'>
            {/* header  */}
            <header className='flex items-center justify-between p-6'>
                <div className='flex items-center space-x-2'> 
                    <img src={logo} alt="" className='w-7 h-7 md:w-10 md:h-10 rounded-full'/>
                    <h2 className='md:text-2xl text-orange-500 font-bold'>Coursopia</h2>
                </div>
                <div className='space-x-4'>
                   { isLoggedIn ? (
                        <button onClick={handleLogout} 
                        className='bg-transparent border border-gray-500 p-1 text-sm md:text-md md:py-2 md:px-4 rounded-md hover:scale-x-110 duration-300 hover:bg-orange-500'>
                        Logout
                        </button>
                   ) : (
                        <>
                        <Link to={'/signup'} className='bg-transparent text-white py-2 px-4 border border-white rounded hover:scale-x-110 duration-300 hover:bg-orange-500'>
                        User
                        </Link>
                        <Link to={'/admin/signup'} className='bg-transparent text-white py-2 px-4 border border-white rounded hover:scale-x-110 duration-300 hover:bg-orange-500'>
                        Admin
                        </Link>
                        </>
                   )}
                </div>
            </header>

            {/* main section  */}
            <section className='text-center py-20'>
                <h1 className='text-4xl font-semibold text-orange-500'>Coursopia</h1>
                <br />
                <p className='text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione aliquid</p>
                <div className='space-x-4 mt-6'>
                    <Link to={"/all"} className='bg-green-500 text-white py-2 px-4 rounded font-semibold hover:bg-white duration-300 hover:text-black'>
                        Get Started
                    </Link>
                    <Link to={"/all"} className='bg-white text-black py-2 px-4 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white'>
                        Explore Courses
                    </Link>
                </div>
            </section>

            <section className="p-10">
                <Slider {...settings}>
                    {
                        courses.map((course) => (
                            <div key={course._id} className='px-4'>
                                <div className="relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                                    <div className='bg-gray-900 rounded-lg shadow-lg overflow-hidden'>
                                        <img className='h-32 w-full object-contain' src={course?.image?.url} alt="" />
                                        <div className="p-6 text-center">
                                            <h2 className='text-xl font-bold text-white'>{course?.title}</h2>
                                            <div className="">
                                                <Link 
                                                to={"/all"}
                                                className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300"
                                                >
                                                Buy Now
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </Slider>
            </section>
            
            <hr />
            {/* footer  */}
            <footer className='my-12'>
                <div className='grid grid-cols-1 md:grid-cols-3'>
                    {/* left side */}
                    <div>
                        <div className='flex items-center space-x-2'> 
                            <img src={logo} alt="" className='w-10 h-10 rounded-full bg-white'/>
                            <h1 className='text-2xl text-orange-500 font-bold'>Coursopia</h1>
                        </div>
                        <div className='mt-3 ml-2 md:ml-8'>
                            <p className='mb-2'>Follow us</p>
                            <div className='flex space-x-4'>
                                <a href=""><FaFacebook className='text-2xl hover:text-blue-400' /></a>
                                <a href=""><FaTwitter className='text-2xl hover:text-pink-200'/></a>
                                <a href=""><FaGithub className='text-2xl hover:text-blue-600'/></a>
                            </div>
                        </div>
                    </div>

                    {/* center size */}
                    <div className='items-center flex flex-col'>
                        <h3 className='text-lg font-semibold mb-4'>Connects</h3>
                        <ul className='space-y-2 text-gray-400'>
                            <li className='hover:text-white cursor-pointer duration-300'>
                                Youtube
                            </li>
                            <li className='hover:text-white cursor-pointer duration-300'>
                                Instagram
                            </li>
                            <li className='hover:text-white cursor-pointer duration-300'>
                                Email
                            </li>
                        </ul>
                    </div>

                    {/* right side  */}
                    <div className='items-center flex flex-col'>
                        <h3 className='text-lg font-semibold mb-4'>Copyrights &#169; 2025</h3>
                        <ul className='space-y-2 text-gray-400'>
                            <li className='hover:text-white cursor-pointer duration-300'>
                                Terms & Conditions
                            </li>
                            <li className='hover:text-white cursor-pointer duration-300'>
                                Privacy Policy
                            </li>
                            <li className='hover:text-white cursor-pointer duration-300'>
                                Refund & Cancellation
                            </li>
                        </ul>
                    </div>

                </div>
            </footer>
        </div>
    </div>
  )
}

export default Home