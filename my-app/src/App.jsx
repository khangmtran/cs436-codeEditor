import { useState } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import CodeEditor from "./CodeEditor";
import axios from "axios";
import Dashboard from "./Dashboard"; 
const App = () => {
  const baseUrl = "http://localhost:4000";
  const [isNameSet, setIsNameSet] = useState(false); // Track whether the name is set
  const [userName, setUserName] = useState(""); // Store the user's name
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isRegistering, setIsRegistering] = useState(false); // Track if user is registering
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Track selected project

  const handleNameSubmit = () => {
    if (userName.trim() !== "") {
      setIsNameSet(true); // Set name only if it's not empty
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      alert("Registration successful");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data : error.message
      );
      alert("Registration failed");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      setIsAuthenticated(true);
      alert("Login successful");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
      alert("Login failed");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box bg="black" px={5} py={20} height="100vh">
      {isAuthenticated ? (
        <>
          {!selectedProject ? (
            <Dashboard setSelectedProject={setSelectedProject} /> // Pass setSelectedProject to Dashboard
          ) : (
            <CodeEditor
              userName={userName}
              project={selectedProject}
              setSelectedProject={setSelectedProject}
            /> // Pass selectedProject to CodeEditor
          )}
          {/* Modal that appears when user lands on the page */}
          <Modal
            isOpen={!isNameSet}
            onClose={() => {}}
            isClosable={false}
            closeOnOverlayClick={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Please Enter Your Name</ModalHeader>
              <ModalBody>
                <Input
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleNameSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <Box>
          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit}>
              <Input
                type="text"
                name="fname"
                placeholder="First Name"
                onChange={handleChange}
              />
              <Input
                type="text"
                name="lname"
                placeholder="Last Name"
                onChange={handleChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
              <div style={{ position: "relative" }}>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
                <span
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <Button type="submit" colorScheme="blue">
                Register
              </Button>
              <Button onClick={() => setIsRegistering(false)}>
                Already have an account? Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
              />
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <Button type="submit" colorScheme="blue">
                Login
              </Button>
              <Button onClick={() => setIsRegistering(true)}>
                Don't have an account? Register
              </Button>
            </form>
          )}
        </Box>
      )}
    </Box>
  );
};

export default App;
