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

const App = () => {
  const [isNameSet, setIsNameSet] = useState(false); // Track whether the name is set
  const [userName, setUserName] = useState(""); // Store the user's name

  const handleNameSubmit = () => {
    if (userName.trim() !== "") {
      setIsNameSet(true); // Set name only if it's not empty
    }
  };

  return (
    <Box bg="black" px={5} py={20} height="100vh">
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
    </Box>
  );
};

export default App;
