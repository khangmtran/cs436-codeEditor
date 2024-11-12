import {
  Box,
  HStack,
  Button,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  IconButton,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { CloseIcon } from "@chakra-ui/icons";
import Output from "./Output";
import Chat from "./Chat";
import GetLinkButton from "./GetLinkButton";
import { executeCode } from "./api";

const CodeEditor = ({ userName }) => {
  const editorRefs = useRef({}); // Create a ref object to store refs for each tab's editor
  const [tabs, setTabs] = useState([{ id: 1, name: "file1.py", content: "" }]);
  const [currentTab, setCurrentTab] = useState(1);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const runCode = async () => {
    const currentEditor = editorRefs.current[currentTab];
    if (!currentEditor) return;

    const sourceCode = currentEditor.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onMount = (editor, tabId) => {
    editorRefs.current[tabId] = editor; // Store each editor instance by tab ID
    editor.focus();
  };

  const downloadFile = () => {
    const currentFile = tabs.find((tab) => tab.id === currentTab);
    const blob = new Blob([currentFile.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentFile.name}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addNewTab = () => {
    const newTab = {
      id: tabs.length + 1,
      name: `file${tabs.length + 1}.py`,
      content: "",
    };
    setTabs([...tabs, newTab]);
    setCurrentTab(newTab.id);
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
  };

  const handleContentChange = (value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === currentTab ? { ...tab, content: value } : tab
      )
    );
  };

  const deleteTab = (tabId) => {
    const updatedTabs = tabs.filter((tab) => tab.id !== tabId);

    if (updatedTabs.length > 0) {
      const newCurrentTab =
        tabId === currentTab ? updatedTabs[0].id : currentTab;
      setTabs(updatedTabs);
      setCurrentTab(newCurrentTab);
    } else {
      setTabs([{ id: 1, name: "file1.py", content: "" }]);
      setCurrentTab(1);
    }

    delete editorRefs.current[tabId]; // Remove the deleted tab's editor reference
  };

  const handleTabDoubleClick = (tabId) => {
    const tab = tabs.find((tab) => tab.id === tabId);
    setNewTabName(tab.name);
    onOpen(); // Open modal for renaming
  };

  const handleRenameSubmit = () => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === currentTab ? { ...tab, name: newTabName } : tab
      )
    );
    onClose();
  };

  return (
    <Box>
      <HStack spacing={5}>
        <Box w="33%" mt="-35">
          <HStack spacing={3} mb={2}>
            <Text fontSize="lg" fontWeight="bold">
              Code
            </Text>
            <Button size="sm" onClick={addNewTab}>
              +
            </Button>
            <Button size="sm" onClick={downloadFile}>
              &#x2B73;
            </Button>
          </HStack>

          <Tabs
            isFitted
            variant="enclosed"
            index={tabs.findIndex((tab) => tab.id === currentTab)}
          >
            <TabList
              style={{
                overflowX: "auto", // Enable horizontal scroll
                overflowY: "hidden", // Disable vertical scroll
                maxWidth: "100%", // Limit the width of the tab area
                whiteSpace: "nowrap", // Prevent tabs from wrapping to a new line
              }}
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  onDoubleClick={() => handleTabDoubleClick(tab.id)} // Handle double-click
                >
                  {tab.name}
                  <IconButton
                    size="xs"
                    icon={<CloseIcon />}
                    ml={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTab(tab.id);
                    }}
                  />
                </Tab>
              ))}
            </TabList>
            <TabPanels>
              {tabs.map((tab) => (
                <TabPanel key={tab.id} p={0}>
                  <Editor
                    height="73vh"
                    theme="vs-dark"
                    defaultLanguage="python"
                    value={tab.content}
                    onMount={(editor) => onMount(editor, tab.id)}
                    onChange={(value) => handleContentChange(value)}
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>

        <Output output={output} isError={isError} />
        <Chat userName={userName} />
      </HStack>

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
      <Box textAlign="center" mt={5}>
        <GetLinkButton />
      </Box>

      {/* Rename Tab Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Tab</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="Enter new tab name"
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleRenameSubmit}>
              Rename
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CodeEditor;
