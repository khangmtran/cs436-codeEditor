import { Box, HStack, Button, Text } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import Output from "./Output";
import Chat from "./Chat";
import GetLinkButton from "./GetLinkButton";
import { executeCode } from "./api";

const CodeEditor = ({ userName }) => {
  // Accept userName as a prop
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  return (
    <Box>
      <HStack spacing={5}>
        {/* Code Editor section */}
        <Box w="33%">
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
        <Output output={output} isError={isError} /> {/* output section */}
        <Chat userName={userName} /> {/* Pass userName to Chat */}
      </HStack>

      {/* Run Code button */}
      <Box textAlign="center" mr="40%" mt={2}>
        <Button
          variant="outline"
          colorScheme="green"
          isLoading={isLoading}
          onClick={runCode}
        >
          Run Code
        </Button>
      </Box>

      {/* GetLinkButton Component */}
      <Box textAlign="center" mt={5}>
        <GetLinkButton />
      </Box>
    </Box>
  );
};

export default CodeEditor;
