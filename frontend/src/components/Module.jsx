import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Load user info from localStorage
const user = JSON.parse(localStorage.getItem("user")) || {};
const courseName = user.courseName || "Course Name";
const userName = user.name || "User Name";
console.log(user);


const modules = [
  { id: 1, title: "Introduction to React", content: "React is a JavaScript library for building user interfaces." },
  { id: 2, title: "Components and Props", content: "Components let you split the UI into independent, reusable pieces." },
  { id: 3, title: "State and Lifecycle", content: "State is similar to props, but it is private and fully controlled by the component." },
];

function Module() {
  const [selectedModule, setSelectedModule] = useState(modules[0]);
  const [completedModules, setCompletedModules] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const certRef = useRef(null);

  // Load completed modules from localStorage
  useEffect(() => {
    const savedCompleted = JSON.parse(localStorage.getItem("completedModules")) || [];
    setCompletedModules(savedCompleted);

    if (savedCompleted.length === modules.length) {
      setShowCertificate(true);
    }
  }, []);

  // Save to localStorage whenever completedModules change
  useEffect(() => {
    localStorage.setItem("completedModules", JSON.stringify(completedModules));
  }, [completedModules]);

  const handleModuleClick = (mod) => {
    setSelectedModule(mod);
    if (!completedModules.includes(mod.id)) {
      const updatedCompleted = [...completedModules, mod.id];
      setCompletedModules(updatedCompleted);

      if (updatedCompleted.length === modules.length) {
        setTimeout(() => setShowCertificate(true), 500);
      }
    }
  };

  const progressPercent = Math.round((completedModules.length / modules.length) * 100);

  const handleDownloadPDF = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${userName}-certificate.pdf`);
  };

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Modules</h2>
        <ul className="space-y-2">
          {modules.map((mod) => (
            <li
              key={mod.id}
              onClick={() => handleModuleClick(mod)}
              className={`cursor-pointer px-3 py-2 rounded-md flex justify-between items-center ${
                selectedModule.id === mod.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
              }`}
            >
              {mod.title}
              {completedModules.includes(mod.id) && (
                <span className="text-green-500 text-sm ml-2">✓</span>
              )}
            </li>
          ))}
        </ul>

        {/* Progress Bar */}
        <div className="mt-6">
          <p className="text-sm mb-1">Progress: {progressPercent}%</p>
          <div className="w-full bg-gray-300 h-3 rounded-full">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex items-center justify-center">
        {!showCertificate ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">{selectedModule.title}</h1>
            <p className="text-gray-700 text-lg">{selectedModule.content}</p>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div
              ref={certRef}
              className="bg-white border-4 border-yellow-500 p-10 w-[800px] h-[550px] shadow-xl rounded-xl flex flex-col items-center justify-center space-y-6"
            >
              <h1 className="text-4xl font-bold text-blue-700">Certificate of Completion</h1>
              <p className="text-xl">This certifies that</p>
              <p className="text-3xl font-bold">{userName}</p>
              <p className="text-xl">has successfully completed the course</p>
              <p className="text-2xl font-semibold text-green-700">{courseName}</p>
              <p className="text-sm text-gray-500 mt-6">Issued on {new Date().toLocaleDateString()}</p>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Download Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Module;
