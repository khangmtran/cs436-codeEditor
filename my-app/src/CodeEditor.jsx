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
  HStack,
} from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { CloseIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Output from "./Output";
import Chat from "./Chat";
import GetLinkButton from "./GetLinkButton";
import { executeCode } from "./pistonAPI";
import axios from "axios";

const baseUrl = "http://localhost:4000";

const ResizeHandle = () => (
  <PanelResizeHandle className="panel-resize-handle">
    <div
      style={{
        width: "5px",
        height: "100%",
        cursor: "col-resize",
      }}
    />
  </PanelResizeHandle>
);

const CodeEditor = ({ userName, project, setSelectedProject }) => {
  const editorRefs = useRef({});
  const panelGroupRef = useRef(null);
  const ws = useRef(null);
  const debounceTimeout = useRef(null);
  const [tabs, setTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const DEFAULT_LAYOUT = [33, 33, 33];

  const resetPanels = () => {
    if (panelGroupRef.current) {
      panelGroupRef.current.setLayout(DEFAULT_LAYOUT);
    }
  };

  useEffect(() => {
    const fetchProjectFiles = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/project/${project._id}/files`
        );
        const files = response.data;
        if (files.length === 0) {
          // If no files, create a placeholder file
          await addNewTab();
        } else {
          // Set the fetched files as tabs
          setTabs(
            files.map((file, index) => ({
              id: index + 1,
              name: file.name,
              content: file.content,
              fileId: file._id,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch files", error);
      }
    };

    fetchProjectFiles();

    // Establish WebSocket connection
    ws.current = new WebSocket("ws://localhost:4000");
    ws.current.onopen = () => {
      console.log("WebSocket connected");
      // Join the project room
      ws.current.send(
        JSON.stringify({
          event: "join-project",
          data: { projectId: project._id, userName },
        })
      );
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.event === "file-update") {
        const { updatedTabId, updatedContent } = message.data;
        console.log(message.data)
        // Update the content for the appropriate tab
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.fileId === updatedTabId ? { ...tab, content: updatedContent } : tab
          )
        );
      }
    };
    
    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current.close();
    };
  }, [project._id, userName]);

  // Save files on page unload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      saveAllFiles();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [tabs]);

  const saveAllFiles = async () => {
    try {
      for (const tab of tabs) {
        await axios.put(`${baseUrl}/api/file/${tab.fileId}`, {
          projectId: project._id,
          name: tab.name,
          content: tab.content,
        });
      }
      console.log("All files saved successfully");
    } catch (error) {
      console.error("Failed to save files", error.response?.data || error.message);
    }
  };

  const saveCurrentTab = async () => {
    const currentFile = tabs.find((tab) => tab.id === currentTab);
    if (currentFile) {
      try {
        await axios.put(`${baseUrl}/api/file/${currentFile.fileId}`, {
          projectId: project._id,
          name: currentFile.name,
          content: currentFile.content,
        });
        console.log("Current tab saved successfully");
      } catch (error) {
        console.error("Failed to save current tab", error.response?.data || error.message);
      }
    }
  };

  const handleBackToDashboard = async () => {
    await saveAllFiles();
    setSelectedProject(null);
  };

  const handleContentChange = (value) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === currentTab ? { ...tab, content: value } : tab
      )
    );
    const currentFile = tabs.find((tab) => tab.id === currentTab);
    if (currentFile) debounceSendUpdate(currentFile.fileId, value);
  };

  const debounceSendUpdate = (fileId, content) => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      ws.current.send(
        JSON.stringify({
          event: "file-update",
          data: {
            projectId: project._id,
            updatedTabId: fileId,
            updatedContent: content,
          },
        })
      );
    }, 300);
  };

  const addNewTab = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/file/${project._id}/file`,
        {
          name: `file${tabs.length + 1}.py`,
          content: "",
          type: "python",
          parentFolder: null,
        }
      );
      const newFile = response.data;
      const newTab = {
        id: tabs.length + 1,
        name: newFile.name,
        content: newFile.content,
        fileId: newFile._id,
      };
      setTabs([...tabs, newTab]);
      setCurrentTab(newTab.id);
    } catch (error) {
      console.error("Failed to create new file", error);
    }
  };

  const runCode = async () => {
    const currentEditor = editorRefs.current[currentTab];
    if (!currentEditor) return;

    const sourceCode = currentEditor.getValue();
    if (!sourceCode) return;

    try {
      setIsLoading(true);
      const { run: result } = await executeCode(sourceCode);
      setOutput(result.output.split("\n"));
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

  
  const getFileIdFromTab = (tabs, currentTabId) => {
    const tab = tabs.find(tab => tab.id === currentTabId);
    return tab ? tab.fileId : null;
  };

  const handleTabChange = (tabId) => {
    setCurrentTab(tabId);
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

  const handleRenameSubmit = async () => {
    const currentTabData = tabs.find((tab) => tab.id === currentTab);
    await axios.post(
      `${baseUrl}/api/file/${currentTabData.fileId}/rename/${newTabName}`
    );

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
        onClick={handleBackToDashboard} // Ensure the function is called
      >
        Back to Dashboard
      </Button>
      </Box>

      <PanelGroup ref={panelGroupRef} direction="horizontal">
        <Panel defaultSize={33} minSize={10}>
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
                      height="68.5vh"
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

        <Panel defaultSize={33} minSize={10}>
          <Output output={output} isError={isError} />
        </Panel>

        <ResizeHandle />

        <Panel defaultSize={33} minSize={10}>
          <Chat userName={userName} project={project} />
        </Panel>
      </PanelGroup>

      <Box mt={2}>
        <HStack spacing={2}>
          <Button
            variant="outline"
            colorScheme="green"
            isLoading={isLoading}
            onClick={runCode}
          >
            Run Code
          </Button>
          <Button variant="outline" colorScheme="green" onClick={resetPanels}>
            Reset Windows
          </Button>
        </HStack>
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
