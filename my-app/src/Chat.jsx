import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Textarea,
  Button,
  VStack,
  HStack,
  Text,
  Input,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";

const Chat = ({ userName, project }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`/api/chat/${project._id}`);
        console.log(response.data.chats);
        setMessages(response.data.chats || []); // Set the fetched chats as previous messages or an empty array
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (project) {
      fetchChats();
    }
  }, [project]);

  
  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const newMessage = { user: userName, text: input, type: "text" };

    try {
      const response = await axios.post(`/api/chat/${project._id}/message`, newMessage);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setInput("");
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith("image/") ? "image" : "file";
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user: userName,
          fileName: file.name,
          fileUrl,
          type: fileType,
        },
      ]);
    }
  };

  const handleEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage();
      event.preventDefault();
    } else if (event.key === "Enter" && event.shiftKey) {
      setInput((prevInput) => prevInput + "\n");
    } else if (event.key === "Tab") {
      event.preventDefault();
      setInput((prevInput) => prevInput + "\t");
    }
  };

  const handleImageClick = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setZoomedImage(null);
  };

  return (
    <Box>
      {project ? (
        <Text>Project: {project.name}</Text>
      ) : (
        <Text color="red">No project prop passed!</Text>
      )}
      <VStack
        height="73vh"
        p={2}
        border="1px solid"
        borderRadius={4}
        borderColor="gray.200"
        spacing={2}
        align="stretch"
      >
        <Box flexGrow={1} overflowY="auto" whiteSpace="pre-wrap">
          {messages.map((msg, index) => (
            <Box key={index} mb={2}>
              <Text fontWeight="bold">
                {msg.user}: {msg.text}
              </Text>
              {msg.type === "image" && (
                <Image
                  src={msg.fileUrl}
                  alt="Chat Image"
                  onClick={() => handleImageClick(msg.fileUrl)}
                  cursor="pointer"
                />
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        <HStack>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Type your message..."
            size="sm"
            resize="none"
          />
          <Button onClick={handleSendMessage} colorScheme="blue">
            Send
          </Button>
          <Input type="file" onChange={handleFileUpload} />
        </HStack>
      </VStack>
      <Modal isOpen={zoomedImage !== null} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Image src={zoomedImage} alt="Zoomed Chat Image" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Chat;