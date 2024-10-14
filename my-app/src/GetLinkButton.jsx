import { Button, useToast } from "@chakra-ui/react";
import React from "react";

const GetLinkButton = () => {
  const toast = useToast(); // To show a success message after copying

  const handleCopyLink = () => {
    const pageUrl = window.location.href; // Get the current page URL

    // Copy the page URL to the clipboard
    navigator.clipboard
      .writeText(pageUrl)
      .then(() => {
        // Show a toast notification on success
        toast({
          title: "Link copied!",
          description: "URL copied to your clipboard.",
          status: "success",
          duration: 1500,
          isClosable: true,
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <Button colorScheme="blue" onClick={handleCopyLink}>
      Get Page Link
    </Button>
  );
};

export default GetLinkButton;
