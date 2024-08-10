import { useEffect, useState } from "react";
import { useUser } from "../userContext";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../themeContext";
import image from "../assets/image_dummy.png";
import Modal from "./ProfileModal";  // Import the Modal component
import Spinner from "../Components/Spinner";

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
  const { theme } = useTheme(); // Access theme from context
  console.log(user);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
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
          console.log(data);
          setName(data.name);
          setEmail(data.email);
          setProblemCount(data.noOfProblems);
          setTotalProblems(data.totalProblems);

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

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "light"
          ? "bg-gray-100 text-gray-900"
          : "bg-gray-900 text-gray-100"
      }`}
    >
      <h1 className="text-4xl font-bold mb-6 text-center">Profile</h1>
      
      {/* Card Container with Hover Effect */}
      <div
        className={`flex flex-col items-center max-w-lg mx-auto p-8 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl ${
          theme === "light" ? "bg-gray-50" : "bg-gray-800"
        }`}
      >
        {/* Image and Information Section */}
        <div className="flex flex-col items-center mb-6">
          {/* Image Section */}
          <img
            src={image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          {/* User Information */}
          <div className="text-center mb-4">
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
          {/* Connect Buttons */}
          <div className="flex space-x-4 mt-4">
            {!codeforcesUrl ? (
              <button
                onClick={() => openModal("Codeforces")}
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transform transition-transform duration-300"
              >
                Connect to Codeforces
              </button>
            ) : (
              <a
                href={codeforcesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transform transition-transform duration-300"
              >
                Codeforces Profile
              </a>
            )}
            {!leetcodeUrl ? (
              <button
                onClick={() => openModal("Leetcode")}
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transform transition-transform duration-300"
              >
                Connect to Leetcode
              </button>
            ) : (
              <a
                href={leetcodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transform transition-transform duration-300"
              >
                Leetcode Profile
              </a>
            )}
          </div>
        </div>
      </div>

      {/* List of Problems Solved */}
      {problems.length > 0 && (
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4 text-center">Problems Solved</h2>
            <div
              className={`overflow-x-auto rounded-lg ${
                theme === "light" ? "bg-gray-200" : "bg-gray-800"
              }`}
            >
              <table
                className={`w-full rounded-lg ${
                  theme === "light" ? "border-gray-300" : "border-gray-700"
                }`}
              >
                <thead>
                  <tr>
                    <th
                      className={`py-4 px-6 border-b text-center font-bold ${
                        theme === "light" ? "text-gray-800" : "text-gray-300"
                      }`}
                    >
                      Title
                    </th>
                    <th
                      className={`py-4 px-6 border-b text-center font-bold ${
                        theme === "light" ? "text-gray-800" : "text-gray-300"
                      }`}
                    >
                      Description
                    </th>
                    <th
                      className={`py-4 px-6 border-b text-center font-bold ${
                        theme === "light" ? "text-gray-800" : "text-gray-300"
                      }`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem) => (
                    <tr key={problem._id}>
                      <td
                        className={`py-4 px-6 border-b text-center ${
                          theme === "light" ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {problem.title}
                      </td>
                      <td
                        className={`py-4 px-6 border-b text-center ${
                          theme === "light" ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {problem.description}
                      </td>
                      <td
                        className={`py-4 px-6 border-b text-center ${
                          theme === "light" ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        <div className="flex space-x-2">
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
