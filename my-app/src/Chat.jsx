import React, { useState, useRef, useEffect } from "react";
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

const Chat = ({ userName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [zoomedImage, setZoomedImage] = useState(null);
  const messagesEndRef = useRef(null);

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: userName, text: input, type: "text" },
    ]);
    setInput("");
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
      setInput((prevInput) => prevInput + "  ");
    }
  };

  const handleImageClick = (imageUrl) => {
    setZoomedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setZoomedImage(null);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      const lastMessage = messages[messages.length - 1];
      const delay = lastMessage && lastMessage.type === "image" ? 100 : 0;

      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, delay);
    }
  }, [messages]);

  return (
    <Box w="20%">
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Chat
      </Text>
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
              <Text fontWeight="bold">{msg.user}:</Text>
              {msg.type === "text" ? (
                <Text>
                  {msg.text.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </Text>
              ) : msg.type === "image" ? (
                <Image
                  src={msg.fileUrl}
                  alt={msg.fileName}
                  maxH="150px"
                  cursor="pointer"
                  onClick={() => handleImageClick(msg.fileUrl)}
                />
              ) : (
                <a
                  href={msg.fileUrl}
                  download={msg.fileName}
                  style={{ color: "lightblue", textDecoration: "underline" }}
                >
                  {msg.fileName}
                </a>
              )}
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>

        <HStack>
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            size="sm"
            resize="none"
          />
          <Button onClick={handleSendMessage} colorScheme="blue" size="sm">
            Send
          </Button>
          <Input
            type="file"
            onChange={handleFileUpload}
            accept=".doc,.pdf,.png,.jpg,.jpeg,.py"
            display="none"
            id="fileUpload"
          />
          <Button
            as="label"
            cursor="pointer"
            htmlFor="fileUpload"
            colorScheme="blue"
            size="sm"
          >
            Upload
          </Button>
        </HStack>
      </VStack>

      {/* Modal for Zoomed Image */}
      <Modal isOpen={!!zoomedImage} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            display="flex"
            justifyContent="center"
            alignItems="center"
            p={0}
          >
            <Image
              src={zoomedImage}
              alt="Zoomed In"
              maxW="100vw"
              maxH="100vh"
              objectFit="contain"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Chat;
