import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

const Output = ({ output, isError }) => {
  return (
    <Box w="40%">
      <Text mb={2} fontSize="lg" fontWeight="bold">
        Output
      </Text>
      <Box
        height="73vh"
        p={2}
        backgroundColor="#1e1e1e"
        color={isError ? "red.500" : "white"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};

export default Output;
