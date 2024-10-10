import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../themeContext"; // Import ThemeContext
import Spinner from "../components/Spinner";

const CreateContest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noProblems, setNoProblems] = useState(false); // Track if there are no problems
  const navigate = useNavigate();
  const { theme } = useTheme(); // Access theme from context

  useEffect(() => {
    // Fetch problems from the backend when the component mounts
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/problems/allProblems"
        );
        const data = await response.json();
        if (data.problems && data.problems.length === 0) {
          setNoProblems(true);
        } else {
          setProblems(data.problems || []);
        }
      } catch (error) {
        console.error("Error fetching problems:", error);
        setError("Error fetching problems. Please try again later.");
      }
      setLoading(false);
    };
    fetchProblems();
  }, []);

  const handleProblemSelect = (problemId) => {
    setSelectedProblems((prev) => {
      if (prev.includes(problemId)) {
        return prev.filter((id) => id !== problemId);
      } else {
        return [...prev, problemId];
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const contestData = {
      title,
      description,
      problems: selectedProblems,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/contests/createContest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contestData),
        }
      );

      if (response.ok) {
        navigate("/contests"); // Redirect to the contests page on successful creation
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create contest.");
      }
    } catch (error) {
      console.error("Error creating contest:", error);
      setError("Error creating contest. Please try again later.");
    }
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
  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <h1 className="text-4xl font-bold mb-6 text-center capitalize">
        Create a New Contest
      </h1>
      <div
        className={`max-w-4xl mx-auto p-6 rounded-lg shadow-lg ${
          theme === "light" ? "bg-gray-50" : "bg-gray-800 text-gray-100"
        }`}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded">{error}</div>
        )}
        {noProblems ? (
          <div className="mb-4 p-3 bg-yellow-600 text-white rounded">
            <p>
              No problems available. Please{" "}
              <a href="/create-problem" className="underline">
                create new problems
              </a>{" "}
              before creating a contest.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full p-3 border ${
                  theme === "light"
                    ? "border-gray-300 bg-gray-100 text-gray-900"
                    : "border-gray-700 bg-gray-900 text-gray-100"
                } rounded`}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
              >
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full p-3 border ${
                  theme === "light"
                    ? "border-gray-300 bg-gray-100 text-gray-900"
                    : "border-gray-700 bg-gray-900 text-gray-100"
                } rounded `}
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="problems"
                className="block text-sm font-medium mb-2"
              >
                Select Problems:
              </label>
              <div
                className={`max-h-60 overflow-y-auto p-4 rounded ${
                  theme === "light" ? "bg-gray-100" : "bg-gray-800"
                }`}
              >
                {problems.map((problem) => (
                  <div key={problem._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={problem._id}
                      checked={selectedProblems.includes(problem._id)}
                      onChange={() => handleProblemSelect(problem._id)}
                      className="mr-2"
                    />
                    <label
                      htmlFor={problem._id}
                      className={` ${
                        theme === "light" ? "bg-gray-100" : "bg-gray-800"
                      }`}
                    >
                      {problem.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="startTime"
                className="block text-sm font-medium mb-2"
              >
                Start Time:
              </label>
              <input
                type="datetime-local"
                id="startTime"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`w-full p-3 border ${
                  theme === "light"
                    ? "border-gray-300 bg-gray-100 text-gray-900"
                    : "border-gray-700 bg-gray-900 text-gray-100"
                } rounded `}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="endTime"
                className="block text-sm font-medium mb-2"
              >
                End Time:
              </label>
              <input
                type="datetime-local"
                id="endTime"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`w-full p-3 border ${
                  theme === "light"
                    ? "border-gray-300 bg-gray-100 text-gray-900"
                    : "border-gray-700 bg-gray-900 text-gray-100"
                } rounded `}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded ${
                theme === "light"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              } transition`}
            >
              Create Contest
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateContest;
