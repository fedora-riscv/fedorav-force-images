import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OpticalDisk from "./OpticalDisk";
import { apiUrl } from "./config";
import BoardList from "./BoardList";
import ProductDetails from "./ProductDetails";
import { formatDate } from "./utils";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (!data) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <ChakraProvider>
      <Router>
        <Box p={6} bg="#f4f4f4" minHeight="100vh">
          <Flex
            as="header"
            bg="white"
            boxShadow="sm"
            p={4}
            mb={6}
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
          >
            <OpticalDisk height={32} width={32} />
            <Heading ml={2} size="lg" color="#444">
              Fedora-V Force Images
            </Heading>
          </Flex>
          <Flex direction={["column", "column", "row"]}>
            <BoardList data={data} />
            <Box flex="1" p={6} bg="white" boxShadow="md" borderRadius="md">
              <Routes>
                <Route path="/" element={
                  <Flex align="center" justify="center" direction="column" p={6}>
                    <InfoIcon boxSize={8} color="gray.500" mb={4} />
                    <Text fontSize="lg" color="gray.500" textAlign="center">
                      Select an item from the left to see details.
                    </Text>
                  </Flex>
                } />
                <Route path="/:productName" element={
                  <ProductDetails data={data} />
                } />
              </Routes>
            </Box>
          </Flex>
          <Box textAlign="center" mt={6}>
            <Text fontSize="sm" color="gray.500">
              Last Updated: {formatDate(data.latest_updated)}
            </Text>
          </Box>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;