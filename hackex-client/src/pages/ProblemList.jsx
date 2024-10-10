import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTheme } from "../themeContext"; // Adjust path as needed
import Spinner from "../components/Spinner";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:3000/api/v1/problems/allProblems"
        );
        const data = await response.json();
        console.log(data); // Log data to check its structure
        setProblems(data.problems || []); // Adjust based on the actual structure of the response
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
      setLoading(false);
    };

    fetchProblems();
  }, []);

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

  // Function to determine the border color based on the tag
  const getTagStyle = (tag) => {
    switch (tag) {
      case "easy":
        return ` ${
          theme === "light" ? "text-green-700" : "text-green-500"
        } uppercase`;
      case "medium":
        return `${
          theme === "light" ? "text-yellow-500" : " text-yellow-300"
        } uppercase`;
      case "hard":
        return " text-red-500 uppercase";
      default:
        return " text-gray-600";
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        theme !== "light"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1
        className={`uppercase text-4xl font-bold mb-8 text-center ${
          theme !== "light" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Problems
      </h1>
      <div className="overflow-x-auto">
        <table
          className={`min-w-full ${
            theme !== "light"
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-300"
          } border rounded-lg shadow-md`}
        >
          <thead
            className={`${
              theme !== "light"
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-200 border-gray-300"
            }`}
          >
            <tr>
              <th
                className={`p-4 text-left ${
                  theme !== "light" ? "rounded-tl-lg" : ""
                }`}
              >
                Title
              </th>
              <th className={`p-4 text-left`}>Description</th>
              <th className={`p-4 text-left`}>Tag</th>{" "}
              {/* New column for tag */}
              <th
                className={`p-4 text-left ${
                  theme !== "light" ? "rounded-tr-lg" : ""
                }`}
              >
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem) => (
              <tr
                key={problem._id}
                className={`${
                  theme !== "light"
                    ? "border-gray-700 hover:bg-gray-700"
                    : "border-gray-200 hover:bg-gray-100"
                } transition-colors duration-300`}
              >
                <td className="p-4 capitalize">{problem.title}</td>
                <td
                  className={`p-4 ${
                    theme !== "light" ? "text-gray-300" : "text-gray-900"
                  } truncate capitalize`}
                  style={{ maxWidth: "300px" }} // You can adjust max-width as per your layout
                  title={problem.description} // This adds a tooltip showing the full description
                >
                  {problem.description}
                </td>
                <td
                  className={`p-4 ${getTagStyle(
                    problem.tag
                  )} borderpx-3 py-1 text-md `}
                >
                  <strong>{problem.tag || "Not Specified"}</strong>
                </td>
                <td className="p-4">
                  <Link to={`/problem/${problem._id}`}>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        theme !== "light"
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-blue-400 hover:bg-blue-500 text-white"
                      }`}
                    >
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
