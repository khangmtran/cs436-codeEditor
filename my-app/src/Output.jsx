import { Box, Text } from "@chakra-ui/react";
import React from "react";

const Output = ({ output, isError }) => {
  return (
    <Box h="100%">
      <Text mb={2} fontSize="lg" fontWeight="bold">
        Output
      </Text>
      <Box
        height="73vh"
        p={4}
        backgroundColor="#1e1e1e"
        color={isError ? "red.500" : "white"}
        overflowY="auto"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.600"
      >
        {output ? (
          output.map((line, i) => (
            <Text key={i} whiteSpace="pre-wrap">
              {line}
            </Text>
          ))
        ) : (
          <Text color="gray.400">Click "Run Code" to see the output here</Text>
        )}
      </Box>
    </Box>
  );
};

export default Output;
