import { Button, useToast, Input, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";

const GetLinkButton = ({ projectId }) => {
  const toast = useToast(); // To show a success or error message
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");

  const handleAddUser = async () => {
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem('token'); 

      const response = await axios.post(`http://localhost:4000/api/project/addUser/${projectId}`, { email }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Show a toast notification on success
      toast({
        title: "User added!",
        description: `User with email ${email} has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close the modal
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error adding the user. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.log(error)
    }
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add User by Email
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter user email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddUser}>
              Add User
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GetLinkButton;