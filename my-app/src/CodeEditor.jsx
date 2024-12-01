import { useRef, useState, useEffect } from "react";
import {
  Box,
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
import { Editor } from "@monaco-editor/react";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Output from "./Output";
import Chat from "./Chat";
import GetLinkButton from "./GetLinkButton";
import { executeCode } from "./pistonAPI";

// Custom resize handle component
const ResizeHandle = () => {
  return (
    <PanelResizeHandle className="panel-resize-handle">
      <div
        style={{
          width: "2px",
          height: "100%",
          cursor: "col-resize",
          backgroundColor: "transparent",
          transition: "background-color 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4A5568")}
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      />
    </PanelResizeHandle>
  );
};

const CodeEditor = ({ userName, project, setSelectedProject }) => {
  const editorRefs = useRef({});
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
    editorRefs.current[tabId] = editor;
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

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        downloadFile();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

    delete editorRefs.current[tabId];
  };

  const handleTabDoubleClick = (tabId) => {
    const tab = tabs.find((tab) => tab.id === tabId);
    setNewTabName(tab.name);
    onOpen();
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
      <Box position="absolute" top={4} right={4}>
        <Button
          leftIcon={<ArrowBackIcon />}
          colorScheme="gray"
          variant="outline"
          onClick={() => setSelectedProject(null)}
        >
          Back to Dashboard
        </Button>
      </Box>

      <PanelGroup direction="horizontal">
        <Panel defaultSize={40} minSize={10}>
          <Box>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Text fontSize="lg" fontWeight="bold">
                Code
              </Text>
              <Button size="sm" onClick={addNewTab}>
                +
              </Button>
              <Button size="sm" onClick={downloadFile}>
                &#x2B73;
              </Button>
            </Box>

            <Tabs
              isFitted
              variant="enclosed"
              index={tabs.findIndex((tab) => tab.id === currentTab)}
            >
              <TabList
                style={{
                  overflowX: "auto",
                  overflowY: "hidden",
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    onDoubleClick={() => handleTabDoubleClick(tab.id)}
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
                      height="69vh"
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
        </Panel>

        <ResizeHandle />

        <Panel defaultSize={30} minSize={10}>
          <Output output={output} isError={isError} />
        </Panel>

        <ResizeHandle />

        <Panel defaultSize={30} minSize={10}>
          <Chat userName={userName} project={project} />
        </Panel>
      </PanelGroup>

      <Box mt={2}>
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
        <GetLinkButton projectId={project._id} />
      </Box>

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
