import { useState, useEffect } from "react";
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
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
const Dashboard = ({ setSelectedProject }) => {
  const [projects, setProjects] = useState([]); // User's projects
  const [newProjectName, setNewProjectName] = useState(""); // New project name
  const [isCreating, setIsCreating] = useState(false); // Modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // Error messages
  const baseUrl = "http://localhost:4000"

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/api/auth/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setProjects(response.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setErrorMessage("Could not load projects. Try again later.");
      }
    };

    fetchProjects();
  }, []);

  // Handle project creation
  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setErrorMessage("Project name cannot be empty.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseUrl}/api/project/create`,
        { name: newProjectName }, // Only send the project name
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects((prev) => [...prev, response.data]); // Add new project to the list
      setNewProjectName(""); // Clear input
      setIsCreating(false); // Close modal
      setErrorMessage("");
    } catch (error) {
      console.error("Failed to create project:", error);
      setErrorMessage("Failed to create project. Please try again.");
    }
  };
  

  return (
    <Box>
      <Text fontSize="xl" mb={4}>
        Your Projects
      </Text>
      {errorMessage && <Text color="red.500">{errorMessage}</Text>}
      
      {projects.length === 0 ? (
        <Box>
          <Text>No projects found. Create one to get started!</Text>

        </Box>
      ) : (
        <List spacing={3}>
          {projects.map((project) => (
            <ListItem
              key={project._id}
              border="1px solid"
              borderColor="gray.300"
              p={3}
              borderRadius="md"
              cursor="pointer"
              onClick={() => setSelectedProject(project)}
            >
              {project.name}
            </ListItem>
          ))}
        </List>
      )}          
       {/* Add spacing between the list and the button */}
  <Box mt={4}>
    <Button colorScheme="blue" onClick={() => setIsCreating(true)}>
      Create New Project
    </Button>
  </Box>

      {/* Modal for creating a new project */}
      <Modal isOpen={isCreating} onClose={() => setIsCreating(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Project</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Enter project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateProject}>
              Create
            </Button>
            <Button variant="ghost" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;
