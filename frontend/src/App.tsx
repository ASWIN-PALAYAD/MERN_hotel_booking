import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <p>home page</p>
              </Layout>
            }
          />

          <Route
            path="/search"
            element={
              <Layout>
                <p>Search page</p>
              </Layout>
            }
          />

          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />

          <Route
            path="/sign-in"
            element={
              <Layout>
                <SignIn/>
              </Layout>
            }
          />




        </Routes>
      </Router>
    </>
  );
}

export default App;
