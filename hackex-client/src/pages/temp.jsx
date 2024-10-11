import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../userContext";
import { ToastContainer, toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import { saveAs } from "file-saver"; // Import file-saver for downloading files
import Spinner from "../Components/Spinner.jsx";
import CodeHighlighter from "./CodeHighlighter.jsx";
import useScreenSize from "../hooks/useScreenSize.js";

import { useTheme } from "../themeContext"; // Import ThemeContext

const ProblemDetail = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [problem, setProblem] = useState(null);
  const { isLoggedIn, user } = useUser();
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [themes, setThemes] = useState("vscodeDark");
  const { height } = useScreenSize();
  const { theme } = useTheme(); // Access theme from context
  const [isError, setError] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://hackex.onrender.com/api/v1/problems/getProblem/${id}`
        );

        if (response.ok) {
          const data = await response.json();
          setProblem(data.problem);
        } else {
          console.error("Problem not found");
        }
      } catch (err) {
        console.error("Error fetching problem:", err);
      }
      setLoading(false);
    };

    fetchProblem();
  }, [id]);

  const handleRunCode = async () => {
    if (!isLoggedIn) {
      alert("You need to be logged in to run code.");
      return;
    }

    try {
      const response = await fetch(
        "hhttps://hackex-compiler.onrender.com/execute",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            langName: selectedLanguage,
            executionCode: code,
            customInput: input,
          }),
        }
      );

      const result = await response.json();

      if (result?.status === "fail") {
        let errorMessage = result.message;

        if (selectedLanguage === "cpp") {
          const lastErrorIndex = errorMessage
            .toLowerCase()
            .lastIndexOf("error");
          if (lastErrorIndex !== -1) {
            errorMessage = errorMessage.substring(lastErrorIndex);
          }
        } else if (selectedLanguage === "python") {
          const lineIndex = errorMessage.toLowerCase().indexOf("line");
          if (lineIndex !== -1) {
            errorMessage = errorMessage.substring(lineIndex);
          }
        } else if (selectedLanguage === "js") {
          // For JavaScript, display a generic error message
          errorMessage = "Compilation or Execution Error";
        }

        setError(true);
        setOutput(errorMessage);
      } else {
        setError(false);
        setOutput(result.out);
      }
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("Network error: Unable to execute code.");
      setOutput("Error executing code.");
    }
  };

  const handleSubmitCode = async () => {
    if (!isLoggedIn) {
      alert("You need to be logged in to submit code.");
      return;
    }

    try {
      const response = await fetch(
        "https://hackex.onrender.com/api/v1/users/submitCode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            problemId: id,
            email: user.email,
          }),
          credentials: "include",
        }
      );

      if (response.ok) {
        // const data = await response.json();
        toast.success("Code submitted successfully.");
      } else {
        toast.error("Error submitting code. Please try again.");
      }
    } catch (err) {
      console.error("Error submitting code:", err);
      toast.error("Error submitting code. Please try again.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy text:", err);
        toast.error("Failed to copy text.");
      }
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setInput(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  };

  if (loading)
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
            lea
            <Spinner
              size={"4/5"}
              color={theme === "light" ? "gray" : "white"}
              width={2}
            />
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen p-4 gap-4 ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <div
        className={`flex-1 p-6 rounded-lg ${
          theme === "light" ? "bg-gray-50" : "bg-gray-800"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
        <h2 className="text-xl font-semibold mb-2">{problem.description}</h2>
        <div className="mb-6 relative">
          <h2 className="text-xl font-semibold mb-2">Sample Input</h2>
          <pre
            className={` p-2 rounded ${
              theme !== "light"
                ? "text-gray-100  bg-gray-700 "
                : "text-gray-900  bg-gray-200"
            }`}
          >
            {problem.sampleInput}
          </pre>
          <button
            onClick={() => copyToClipboard(problem.sampleInput)}
            className="absolute top-2 right-2 p-2 hover:text-gray-100"
            aria-label="Copy sample input to clipboard"
          >
            <FaCopy />
          </button>
        </div>
        <div className="mb-6 relative">
          <h2 className="text-xl font-semibold mb-2">Sample Output</h2>
          <pre
            className={` p-2 rounded ${
              theme !== "light"
                ? "text-gray-100  bg-gray-700 "
                : "text-gray-900  bg-gray-200"
            }`}
          >
            {problem.sampleOutput}
          </pre>
          <button
            onClick={() => copyToClipboard(problem.sampleOutput)}
            className="absolute top-2 right-2 p-2 hover:text-gray-100"
            aria-label="Copy sample output to clipboard"
          >
            <FaCopy />
          </button>
        </div>
      </div>
      <div
        className={`flex-1 p-6 rounded-lg ${
          theme === "light" ? "bg-gray-50" : "bg-gray-800"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-between items-center gap-8">
            <select
              className={`ml-4 p-2 rounded-lg ${
                theme === "light"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-700 text-gray-100"
              }`}
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="js">Javascript</option>
            </select>
            <select
              className="p-2 bg-gray-700 text-gray-300 border border-gray-600 rounded"
              value={themes}
              onChange={(e) => setThemes(e.target.value)}
            >
              <option value="vscodeDark">VsCode Dark</option>
              <option value="oneDark">One Dark</option>
              <option value="solarizedDark">Solarized Dark</option>
              <option value="solarizedLight">Solarized Light</option>
              <option value="githubLight">GitHub Light</option>
              <option value="bespin">Bespin</option>
              <option value="duotoneDark">Duotone Dark</option>
              <option value="dracula">Dracula</option>
              <option value="githubLight">GitHub Light</option>
              <option value="xcodeDark">XcodeDark</option>
              <option value="xcodeLight">XcodeLight</option>
              <option value="duotoneLight">DuoTone Light</option>
              <option value="okaidia">Okaidia</option>
            </select>
          </div>
          <div className="flex gap-8">
            <button
              onClick={handleRunCode}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            >
              Run
            </button>
            <button
              onClick={handleSubmitCode}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <CodeHighlighter
            language={selectedLanguage}
            code={code}
            setCode={setCode}
            height={String(parseInt(height) * 0.6) + "px"}
            theme={themes}
          />
          <button
            onClick={() => copyToClipboard(code)}
            className="absolute top-2 right-2 p-2 hover:text-gray-100"
            aria-label="Copy code to clipboard"
          >
            <FaCopy />
          </button>
        </div>
        <div className="flex justify-between items-center"></div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Input</h3>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="4"
              className={`w-full p-3 rounded-lg mb-4 ${
                theme === "light"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-700 text-gray-100"
              }`}
              placeholder="Enter input for your code..."
            />
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="mt-2"
            />
            <button
              onClick={() => copyToClipboard(input)}
              className="absolute top-1 right-1 p-2 hover:text-gray-100"
              aria-label="Copy input to clipboard"
            >
              <FaCopy />
            </button>
          </div>
        </div>

        <div
          className={` p-4 rounded-lg mt-4 relative ${
            theme === "light"
              ? "bg-gray-200 text-gray-900"
              : "bg-gray-800 text-gray-100"
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">Output</h3>
          <pre className={`text-gray-300 ${isError ? "text-red-500" : ""}`}>
            {output}
          </pre>
          <button
            onClick={() => copyToClipboard(output)}
            className="absolute top-2 right-2 p-2 hover:text-gray-100"
            aria-label="Copy output to clipboard"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => downloadFile("output.txt", output)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-2"
          >
            Download Output
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProblemDetail;
