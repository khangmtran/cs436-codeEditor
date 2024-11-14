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
import axios from 'axios';

const App = () => {
  const [isNameSet, setIsNameSet] = useState(false); // Track whether the name is set
  const [userName, setUserName] = useState(""); // Store the user's name
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication status
  const [isRegistering, setIsRegistering] = useState(false); // Track if user is registering
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    password: ''
  });

  const handleNameSubmit = () => {
    if (userName.trim() !== "") {
      setIsNameSet(true); // Set name only if it's not empty
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/authRoutes/register', formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      alert('Registration successful');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      alert('Registration failed');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/authRoutes/login', formData);
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      alert('Login successful');
    } catch (error) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
      alert('Login failed');
    }
  };

  return (
    <Box bg="black" px={5} py={20} height="100vh">
      {isAuthenticated ? (
        <>
          <CodeEditor userName={userName} /> {/* Pass userName here */}
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
              <Input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
              />
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
                type="password"
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