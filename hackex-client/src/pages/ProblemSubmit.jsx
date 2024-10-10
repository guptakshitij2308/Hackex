/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../themeContext"; // Import ThemeContext
import Spinner from "../components/Spinner";
// import { saveAs } from "file-saver";
// import { FaDownload, FaUpload } from "react-icons/fa";

const AddProblem = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [constraints, setConstraints] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [tag, setTag] = useState(""); // New state for tag
  // const [inputFile, setInputFile] = useState(null); // New state for input file
  // const [outputFile, setOutputFile] = useState(null); // New state for output file
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access theme from context
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // const formData = new FormData();
      // formData.append("title", title);
      // formData.append("description", description);
      // formData.append("constraints", constraints);
      // formData.append("sampleInput", sampleInput);
      // formData.append("sampleOutput", sampleOutput);
      // formData.append("tag", tag); // Include tag in the submission data

      // if (inputFile) formData.append("inputFile", inputFile);
      // if (outputFile) formData.append("outputFile", outputFile);

      const response = await fetch(
        "http://localhost:3000/api/v1/problems/addProblem",
        {
          method: "POST",
          // body: formData,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            constraints,
            sampleInput,
            sampleOutput,
            tag, // Include tag in the submission data
          }),
        }
      );

      if (response.ok) {
        navigate("/");
      } else {
        setError("Failed to add problem. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        className={`flex flex-col lg:flex-row min-h-screen p-4 gap-4 ${
          theme === "light"
            ? "bg-gray-100 text-gray-900"
            : "bg-gray-900 text-gray-100"
        }`}
      >
        <div
          className={`flex-1 p-6 rounded-lg relative ${
            theme === "light" ? "bg-gray-50" : "bg-gray-800"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner
              size={"4/5"}
              color={theme === "light" ? "gray" : "white"}
              width={2}
            />
          </div>
        </div>
      </div>
    );
  }

  // const handleFileChange = (e, setter) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setter(file);
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       if (setter === setInputFile) {
  //         setSampleInput(reader.result);
  //       } else if (setter === setOutputFile) {
  //         setSampleOutput(reader.result);
  //       }
  //     };
  //     reader.readAsText(file);
  //   }
  // };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-8 ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-4xl p-8 rounded-lg shadow-lg ${
          theme === "light" ? "bg-gray-50" : "bg-gray-800"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center capitalize">
          Add a New Problem
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 mb-4 rounded-lg border ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-300 focus:border-blue-500"
              : "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          }`}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full p-3 mb-4 rounded-lg border ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-300 focus:border-blue-500"
              : "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          }`}
          placeholder="Description"
        />
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          className={`w-full p-3 mb-4 rounded-lg border ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-300 focus:border-blue-500"
              : "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          }`}
          placeholder="Constraints"
        />
        <textarea
          value={sampleInput}
          onChange={(e) => setSampleInput(e.target.value)}
          className={`w-full p-3 rounded-lg border ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-300 focus:border-blue-500"
              : "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          }`}
          placeholder="Sample Input"
        />

        {/* <div className="mb-4"> 
          <input
            type="file"
            accept=".txt"
            onChange={(e) => handleFileChange(e, setInputFile)}
            className="w-full mb-4"
          />
        </div> */}
        <textarea
          value={sampleOutput}
          onChange={(e) => setSampleOutput(e.target.value)}
          className={`w-full p-3  rounded-lg border ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-300 focus:border-blue-500"
              : "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          }`}
          placeholder="Sample Output"
        />
        {/* <div className="mb-6">
          <input
            type="file"
            accept=".txt"
            onChange={(e) => handleFileChange(e, setOutputFile)}
            className="w-full mb-4"
          />
        </div> */}
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className={`w-full p-3 mb-6 rounded-lg border ${
            theme === "light"
              ? "bg-gray-200 text-gray-900 border-gray-300 focus:border-blue-500"
              : "bg-gray-700 text-white border-gray-600 focus:border-blue-500"
          }`}
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition w-full"
        >
          Add Problem
        </button>
      </div>
    </div>
  );
};

export default AddProblem;
