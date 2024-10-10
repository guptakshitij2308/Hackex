/* eslint-disable react/prop-types */
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Playground from "./pages/Playground";
import ProblemList from "./pages/ProblemList";
import ProblemDetail from "./pages/ProblemDetail";
import ProblemSubmit from "./pages/ProblemSubmit";
import Login from "./pages/Login";
// import UserProfile from "./pages/Userprofile";
import Signup from "./pages/Signup";
// import Navbar from "./components/Navbar.jsx";
// import LeaderBoard from "./pages/LeaderBoard";
import Contest from "./pages/Contest";
import Contests from "./pages/Contests";
import CreateContest from "./pages/CreateContest";
import { Navigate } from "react-router-dom";
import Home from "./pages/Home";
// import Footer from "./components/Footer";
import Profile from "./pages/Userprofile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />

        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/home"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/problem/:id"
          element={
            <Layout>
              <ProblemDetail />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/playground"
          element={
            <Layout>
              <Playground />
            </Layout>
          }
        />

        <Route
          path="/submit"
          element={
            <Layout>
              <ProblemSubmit />
            </Layout>
          }
        />

        {/* <Route
          path="/leaderboard"
          element={
            <Layout>
              <LeaderBoard />
            </Layout>
          }
        /> */}

        <Route
          path="/contests"
          element={
            <Layout>
              <Contests />
            </Layout>
          }
        />
        <Route
          path="/problems"
          element={
            <Layout>
              <ProblemList />
            </Layout>
          }
        />

        <Route
          path="/contest/:id"
          element={
            <Layout>
              <Contest />
            </Layout>
          }
        />
        <Route
          path="/create-contest"
          element={
            <Layout>
              <CreateContest />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default App;
