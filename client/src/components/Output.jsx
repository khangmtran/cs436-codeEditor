import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";

const Output = () => {
  return (
    <Box w="33%">
      <Text mb={2} fontSize="lg" fontWeight="bold">
        Output
      </Text>
      <Box height="75vh" p={2} backgroundColor="#1e1e1e">
        Hello CS436
      </Box>
    </Box>
  );
};

export default Output;
