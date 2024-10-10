import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../themeContext"; // Import ThemeContext
import Spinner from "../components/Spinner";

const LeaderBoard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { theme } = useTheme(); // Access theme from context
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/users/leaderboard"
        );
        const sortedData = response.data.users.sort(
          (a, b) => b.noOfProblems - a.noOfProblems
        );
        setLeaderboardData(sortedData);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
      setLoading(false);
    };
    fetchLeaderboardData();
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

  return (
    <div
      className={`min-h-screen p-8 flex flex-col items-center ${
        theme !== "light" ? " bg-gray-900" : " "
      }`}
    >
      <h1
        className={`text-4xl font-bold mb-8 text-center ${
          theme === "light" ? " text-gray-900" : " text-gray-100"
        }`}
      >
        LEADERBOARD
      </h1>
      <div className="overflow-x-auto w-full max-w-3xl">
        <table
          className={`min-w-full ${
            theme === "light"
              ? "bg-gray-50 border-gray-300"
              : "bg-gray-800 border-gray-700"
          } border rounded-lg shadow-md`}
        >
          <thead
            className={`${
              theme === "light"
                ? "bg-gray-200 border-gray-300 text-gray-700"
                : "bg-gray-700 border-gray-600 text-gray-200"
            }`}
          >
            <tr>
              <th className="p-4 text-center font-semibold capitalize">RANK</th>
              <th className="p-4 text-center font-semibold low capitalize">
                USERNAME
              </th>
              <th className="p-4 text-center font-semibold capitalize">
                PROBLEMS SOLVED
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((user, index) => (
              <tr
                key={user.email}
                className={`lowercase border-b ${
                  theme === "light" ? "border-gray-300" : "border-gray-600"
                }`}
              >
                <td
                  className={`p-4 text-center ${
                    theme === "light" ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  {index + 1}
                </td>
                <td
                  className={`p-4 text-center ${
                    theme === "light" ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  {user.name}
                </td>
                <td
                  className={`p-4 text-center ${
                    theme === "light" ? "text-gray-900" : "text-gray-100"
                  }`}
                >
                  {user.noOfProblems}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderBoard;
