import { Box, HStack, Button, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import Output from "./Output";
import Chat from "./Chat";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Box>
      <HStack spacing={5}>
        {" "}
        {/* Horizontal stack layout for code editor, output, and chat */}
        <Box w="33%">
          {" "}
          {/* Code Editor section */}
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Code
          </Text>
          <Editor
            height="75vh"
            theme="vs-dark"
            defaultLanguage="python"
            defaultValue="project = 'Hello CS436'
print(project)"
            onMount={onMount}
            value={value}
            onChange={(value) => setValue(value)}
          />
        </Box>
        <Output /> {/* output section */}
        <Chat /> {/* chat section */}
      </HStack>
      <Box textAlign="center" mr="40%" mt={2}>
        {" "}
        {/* Run Code button */}
        <Button variant="outline" colorScheme="green">
          Run Code
        </Button>
      </Box>
    </Box>
  );
};

export default CodeEditor;
