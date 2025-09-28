import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from "react-router-dom";
import { apiUrl } from "./config";
import BoardList from "./BoardList";
import ProductDetails from "./ProductDetails";
import { formatDate } from "./utils";
import HowToBurnImagesToSDCards from "./HowToBurnImagesToSDCards";
import HelpList from "./HelpList";
import RecentUpdates from "./RecentUpdates";
import HomePage from "./HomePage";
import VendorDetails from "./VendorDetails";

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
        <Spinner thickness="3px" width="50px" height="50px" />
      </Flex>
    );
  }

  return (
    <ChakraProvider>
      <Router>
        <Box p={6} bg="#f4f4f4" minHeight="100vh">
          <Flex
            as={RouterLink}
            to="/"
            bg="white"
            boxShadow="sm"
            p={4}
            mb={6}
            justifyContent="center"
            alignItems="center"
            borderRadius="md"
            cursor="pointer"
            _hover={{ boxShadow: "md", transform: "translateY(-1px)" }}
            transition="all 0.2s"
          >
            <img src="/images/fvf-logo.webp" alt="Fedora-V Force Logo" width="5%" />
            <Heading mx={4} size="lg" color="#444">
              Fedora-V Force Images
            </Heading>
            <img src="/images/fedora-remix.webp" alt="Fedora Remix" width="5%" />
          </Flex>
          <RecentUpdates data={data} />
          <Flex direction={["column", "column", "row"]}>
            <Box>
              <HelpList />
              <BoardList data={data} />
            </Box>
            <Box flex="1" p={6} bg="white" boxShadow="md" borderRadius="md">
              <Routes>
                <Route path="/" element={
                  <HomePage data={data} />
                } />
                <Route path="/how-to-burn-images-to-sd-cards" element={
                  <Flex align="center" justify="center" direction="column" p={6}>
                      <HowToBurnImagesToSDCards />
                  </Flex>
                } />
                <Route path="/vendor/:vendorName" element={
                  <VendorDetails data={data} />
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
