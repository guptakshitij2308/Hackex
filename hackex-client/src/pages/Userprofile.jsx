import { useEffect, useState } from "react";
import { useUser } from "../userContext";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../themeContext";
import image from "../assets/image_dummy.png";
import Modal from "./ProfileModal";
import Spinner from "../Components/Spinner";
import PieChartComponent from "./PieChart"; // Import the PieChartComponent

const Profile = () => {
  const { isLoggedIn, user } = useUser();
  const [problemCount, setProblemCount] = useState(0);
  const [problems, setProblems] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [totalProblems, setTotalProblems] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalPlatform, setModalPlatform] = useState("");
  const [codeforcesUrl, setCodeforcesUrl] = useState("");
  const [leetcodeUrl, setLeetcodeUrl] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:3000/api/v1/problems/allProblems`
        );
        const tot = await res.json();
        console.log(tot);
        setTotalProblems(tot.results);
        console.log(totalProblems);

        const response = await fetch(
          `http://localhost:3000/api/v1/users/userProblems`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
            }),
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setEmail(data.email);
          setProblemCount(data.noOfProblems);

          const fetchedProblems = await Promise.all(
            data.problems.map(async (problemId) => {
              const problemResponse = await fetch(
                `http://localhost:3000/api/v1/problems/getProblem/${problemId}`
              );
              const problemData = await problemResponse.json();
              return problemData.problem;
            })
          );
          setProblems(fetchedProblems);
        } else {
          console.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      setLoading(false);
    };

    if (user) {
      fetchUserData();
    }
  }, [isLoggedIn, user, navigate]);

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

  const openModal = (platform) => {
    setModalPlatform(platform);
    setShowModal(true);
  };

  const handleUrlSubmit = (url) => {
    if (modalPlatform === "Codeforces") {
      setCodeforcesUrl(url);
    } else if (modalPlatform === "Leetcode") {
      setLeetcodeUrl(url);
    }
  };

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
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Profile</h1>

      {/* Flexbox Container for Image, User Information, and Pie Chart */}
      <div
        className={`flex flex-col lg:flex-row items-center justify-between max-w-3xl mx-auto p-8 rounded-lg shadow-lg ${
          theme === "light" ? "bg-gray-50" : "bg-gray-800"
        }`}
      >
        {/* Image and Information Section */}
        <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
          {/* Image Section */}
          <img
            src={image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          {/* User Information */}
          <div className="text-start">
            <p className="text-xl mb-2">
              <strong>Name:</strong> {name}
            </p>
            <p className="text-xl mb-2">
              <strong>Email:</strong> {email}
            </p>
            <p className="text-xl">
              <strong>Problems Solved:</strong> {problemCount}
            </p>
          </div>
        </div>

        {/* Pie Chart Section */}
        <div className="lg:ml-8 mt-6 lg:mt-0">
          <PieChartComponent
            problemCount={problemCount}
            totalProblems={totalProblems}
          />
        </div>
      </div>

      {/* List of Problems Solved */}
      {problems.length > 0 && (
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-3xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Problems Solved
            </h2>
            <div
              className={`overflow-x-auto rounded-lg ${
                theme === "light" ? "bg-gray-200" : "bg-gray-800"
              }`}
            >
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
                    <th className="p-4 text-center font-semibold capitalize">
                      Title
                    </th>
                    <th className="p-4 text-center font-semibold low capitalize">
                      Tag
                    </th>
                    <th className="px-4 py-4 text-center font-semibold capitalize">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr
                      key={problem._id}
                      className={`lowercase border-b ${
                        theme === "light"
                          ? "border-gray-300"
                          : "border-gray-600"
                      }`}
                    >
                      <td
                        className={`capitalize p-4 text-center ${
                          theme === "light" ? "text-gray-900" : "text-gray-100"
                        }`}
                      >
                        {problem.title}
                      </td>
                      <td
                        className={` ${getTagStyle(
                          problem.tag
                        )} p-4 text-center ${
                          theme === "light" ? "text-gray-900" : "text-gray-100"
                        }`}
                      >
                        <strong>{problem.tag || "Not Specified"}</strong>
                      </td>
                      <td
                        className={`px-4 py-4 text-start ${
                          theme === "light" ? "text-gray-900" : "text-gray-100"
                        }`}
                      >
                        <div className="flex flex-0 gap-4">
                          <Link to={`/problem/${problem._id}`}>
                            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 truncate w-32">
                              View
                            </button>
                          </Link>
                          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 truncate w-32">
                            Add Cases
                          </button>
                          <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 truncate w-32">
                            Discuss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleUrlSubmit}
        platform={modalPlatform}
      />
    </div>
  );
};

export default Profile;
