// Chat.js
import React, { useState } from "react";
import { Box, Textarea, Button, VStack, HStack, Text } from "@chakra-ui/react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim() === "") return; // Prevent sending empty messages
    setMessages((prevMessages) => [...prevMessages, input]);
    setInput(""); // Clear the input field
  };

  const handleEnter = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      handleSendMessage();
      event.preventDefault(); // Prevent adding a new line in the textarea
    } else if (event.key === "Enter" && event.shiftKey) {
      // If Shift + Enter is pressed, allow new line
      setInput((prevInput) => prevInput + "\n");
    } else if (event.key === "Tab") {
      event.preventDefault(); // Prevent the default tab behavior
      setInput((prevInput) => prevInput + "  "); // Add two spaces for indentation
    }
  };

  return (
    <Box w="33%">
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Chat
      </Text>
      <VStack
        height="75vh"
        p={2}
        border="1px solid"
        borderRadius={4}
        borderColor="gray.200"
        spacing={2}
        align="stretch"
      >
        {/* Display chat messages */}
        <Box flexGrow={1} overflowY="auto" whiteSpace="pre-wrap">
          {messages.map((msg, index) => (
            <Text key={index}>
              {msg.split("\n").map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < msg.split("\n").length - 1 && <br />}{" "}
                  {/* Add <br /> for new lines */}
                </React.Fragment>
              ))}
            </Text>
          ))}
        </Box>

        {/* Send message input and button */}
        <HStack>
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter} // Add onKeyDown for Enter and Tab detection
            size="sm"
            resize="none"
          />
          <Button onClick={handleSendMessage} colorScheme="blue" size="sm">
            Send
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Chat;
