import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../userContext";
import { ToastContainer, toast } from "react-toastify";
import { FaCopy, FaDownload, FaPlay, FaPaperPlane } from "react-icons/fa";
import { saveAs } from "file-saver"; // Import file-saver for downloading files
import Spinner from "../components/Spinner.jsx";
import CodeHighlighter from "./CodeHighlighter.jsx";
import useScreenSize from "../hooks/useScreenSize.js";
import { useTheme } from "../themeContext"; // Import ThemeContext

const boilerplateCode = {
  java: `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    
    return 0;
}`,
  c: `#include <stdio.h>

int main() {
    // Write your code here
    return 0;
}`,
  python: `def main():
    # Write your code here
    pass

if __name__ == "__main__":
    main()`,
  js: `function main() {
    // Write your code here
}

main();`,
};

const ProblemDetail = () => {
  const { id } = useParams();
  const [code, setCode] = useState(boilerplateCode.cpp); // Default boilerplate code
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
          `http://localhost:3000/api/v1/problems/getProblem/${id}`
        );

        if (response.ok) {
          const data = await response.json();
          setProblem(data.problem);
          setInput(data.problem.sampleInput);
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

  useEffect(() => {
    setCode(boilerplateCode[selectedLanguage] || boilerplateCode.cpp);
  }, [selectedLanguage]);

  const handleRunCode = async () => {
    if (!isLoggedIn) {
      alert("You need to be logged in to run code.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          langName: selectedLanguage,
          executionCode: code,
          customInput: input,
        }),
      });

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
      const runResponse = await fetch("http://localhost:8000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          langName: selectedLanguage,
          executionCode: code,
          customInput: problem.sampleInput,
        }),
      });

      const runResult = await runResponse.json();

      if (runResponse.ok) {
        console.log("Run Output:", runResult.out);
        console.log("Expected Output:", problem.sampleOutput);
        const normalizeOutput = (output) => output.trim().replace(/\s+/g, " ");

        if (
          normalizeOutput(runResult.out) ===
          normalizeOutput(problem.sampleOutput)
        ) {
          const submitResponse = await fetch(
            "http://localhost:3000/api/v1/users/submitCode",
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

          if (submitResponse.ok) {
            toast.success("Code submitted and verified successfully.");
          } else {
            toast.error("Error submitting code. Please try again.");
          }
        } else {
          setOutput(
            `Expected Output:\n${problem.sampleOutput}\n\nYour Output:\n${runResult.out}`
          );
          toast.error("Code did not produce the expected output.");
        }
      } else {
        setOutput(runResult.message || "Error executing code.");
        toast.error("Error executing code during submission.");
      }
    } catch (err) {
      console.error("Error during code submission or execution:", err);
      toast.error("An error occurred. Please try again.");
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
        <h1 className="text-3xl font-bold my-4">{problem.title}</h1>
        <h2 className="text-xl  my-2 p-4 text-start">{problem.description}</h2>
        <h2 className="text-xl font-semibold my-6">
          Constraints : {problem.constraints}
        </h2>
        <div className="my-6 relative">
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
        <div className="my-6 relative">
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
        className={`overflow-hidden flex-1 p-6 rounded-lg ${
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
              <option value="js">JavaScript</option>
            </select>
            <select
              className={`p-2  rounded ${
                theme === "light"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-700 text-gray-100"
              }`}
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
              <option value="xcodeDark">XcodeDark</option>
              <option value="xcodeLight">XcodeLight</option>
              <option value="duotoneLight">DuoTone Light</option>
              <option value="okaidia">Okaidia</option>
            </select>
          </div>
          <div className="flex gap-8">
            <button
              onClick={handleRunCode}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <FaPlay className="mr-2" />
              Run
            </button>
            <button
              onClick={handleSubmitCode}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg  flex items-center"
            >
              <FaPaperPlane className="mr-2" />
              Submit
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <CodeHighlighter
            language={selectedLanguage}
            code={code}
            setCode={setCode}
            height={String(parseInt(height) * 0.55) + "px"}
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
          <div className="flex justify-between items-center my-2">
            <h3 className="text-xl font-semibold">Input</h3>

            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="mt-2"
            />
          </div>
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

            <button
              onClick={() => copyToClipboard(input)}
              className="absolute top-1 right-1 p-2 hover:text-gray-100"
              aria-label="Copy input to clipboard"
            >
              <FaCopy />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center my-2">
          <h3 className="text-xl font-semibold">Output</h3>

          <button
            onClick={() => downloadFile("output.txt", output)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded-lg flex items-center justify-between"
          >
            <FaDownload className="mr-2" />
            Output
          </button>
        </div>

        <div className="relative">
          <textarea
            value={output}
            rows="4"
            className={`w-full p-3 rounded-lg mb-4 ${
              theme === "light"
                ? "bg-gray-200 text-gray-900"
                : "bg-gray-700 text-gray-100"
            } ${isError ? "text-red-500" : ""}`}
            placeholder="Output appears here..."
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProblemDetail;
