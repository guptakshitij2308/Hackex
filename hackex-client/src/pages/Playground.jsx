import { useState, useEffect } from "react";
import CodeHighlighter from "./CodeHighlighter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useScreenSize from "../hooks/useScreenSize.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
import { saveAs } from "file-saver";
import { useTheme } from "../themeContext";
import Spinner from "../components/Spinner.jsx";

const boilerplateCode = {
  cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}",
  c: "#include <stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}",
  java: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  python:
    'def main():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    main()',
  js: "function main() {\n    // Write your code here\n}\n\nmain();",
};

const Playground = () => {
  const [input, setInput] = useState(boilerplateCode["cpp"]); // Initialize with C++ boilerplate code
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [testInput, setTestInput] = useState("");
  const { height } = useScreenSize();
  const { theme } = useTheme();
  const [themes, setThemes] = useState("vscodeDark");

  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // UseEffect to update the input code when language changes
  useEffect(() => {
    setInput(boilerplateCode[language]);
  }, [language]);

  const handleRunCode = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          langName: language,
          executionCode: input,
          customInput: testInput,
        }),
      });

      const result = await response.json();

      if (result?.status === "fail") {
        let errorMessage = result.message;

        if (Object.keys(errorMessage).length === 0) {
          errorMessage = "Uncaught error";
        } else {
          if (language === "cpp") {
            const lastErrorIndex = errorMessage
              .toLowerCase()
              .lastIndexOf("error");
            if (lastErrorIndex !== -1) {
              errorMessage = errorMessage.substring(lastErrorIndex);
            }
          } else if (language === "python") {
            const lineIndex = errorMessage.toLowerCase().indexOf("line");
            if (lineIndex !== -1) {
              errorMessage = errorMessage.substring(lineIndex);
            }
          } else if (language === "js") {
            errorMessage = "Compilation or Execution Error";
          }
        }

        setIsError(true);
        setOutput(errorMessage);
      } else {
        setIsError(false);
        setOutput(result.out);
      }
    } catch (error) {
      console.error("Error executing code:", error);
      toast.error("Network error: Unable to execute code.");
      setOutput("Error executing code.");
    }
    setLoading(false);
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
        setTestInput(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  };

  return (
    <div
      className={`p-6 min-h-screen ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-200"
      }`}
    >
      {loading && <Spinner />}
      <ToastContainer />
      <div className="max-w-10xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className={`shadow-lg rounded-lg pt-4 overflow-hidden ${
            theme === "light"
              ? "bg-gray-50 text-gray-900"
              : "bg-gray-800 text-gray-200"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <select
              className={`ml-4 p-2 border rounded ${
                theme === "light"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-700 text-gray-300"
              }`}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="python">Python</option>
              <option value="js">JavaScript</option>
            </select>
            <select
              className={`p-2 border rounded ${
                theme === "light"
                  ? "bg-gray-200 text-gray-900"
                  : "bg-gray-700 text-gray-300"
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
            <div className="flex space-x-2 mr-4">
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={handleRunCode}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                {loading ? "Running..." : "Run Code"}
              </button>
            </div>
          </div>

          <div className="relative">
            <CodeHighlighter
              language={language}
              code={input}
              setCode={setInput}
              height={String(parseInt(height) * 0.74) + "px"}
              theme={themes}
            />
            <button
              onClick={() => copyToClipboard(input)}
              className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-100"
              aria-label="Copy code to clipboard"
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        </div>

        <div
          className={`shadow-lg rounded-lg p-4 flex flex-col h-full ${
            theme === "light"
              ? "bg-gray-50 text-gray-900"
              : "bg-gray-800 text-gray-200"
          }`}
        >
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="input" className="block font-semibold">
                  Input
                </label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
              <div className="relative flex-1">
                <textarea
                  id="input"
                  className={`w-full h-full p-4 border rounded-lg ${
                    theme === "light"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-gray-700 text-gray-200"
                  }`}
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                />
                <button
                  onClick={() => copyToClipboard(testInput)}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-100"
                  aria-label="Copy input to clipboard"
                >
                  <FontAwesomeIcon icon={faCopy} />
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="output" className="block font-semibold">
                  Output
                </label>
                <button
                  onClick={() => downloadFile("output.txt", output)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Output
                </button>
              </div>
              <textarea
                id="output"
                className={`w-full h-full p-4 border rounded-lg ${
                  isError
                    ? "bg-red-50 text-red-800"
                    : theme === "light"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-gray-700 text-gray-200"
                }`}
                value={output}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
