import React, { useState, useEffect, createContext } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Text,
  Spinner,
  VStack,
  Button,
  ButtonGroup,
  Fade,
} from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from "react-router-dom";
import { getApiUrl, getPlatformFromDomain, isDomainSpecific } from "./config";
import BoardList from "./BoardList";
import ProductDetails from "./ProductDetails";
import HowToBurnImagesToSDCards from "./HowToBurnImagesToSDCards";
import HelpList from "./HelpList";
import RecentUpdates from "./RecentUpdates";
import HomePage from "./HomePage";
import VendorDetails from "./VendorDetails";

export const PlatformContext = createContext({
  platform: 'riscv',
  setPlatform: () => {},
  isSpecificDomain: true,
});

function App() {
  const [data, setData] = useState(null);
  const [platform, setPlatform] = useState(getPlatformFromDomain());
  const [isSpecificDomain] = useState(isDomainSpecific());
  const [isLoading, setIsLoading] = useState(true);

  const handlePlatformChange = (newPlatform) => {
    if (newPlatform === platform) return;

    if (!isSpecificDomain) {
      localStorage.setItem('platform', newPlatform);
    }

    if (isSpecificDomain) {
      const newHostname = newPlatform === 'arm'
        ? 'images.arm.fedoravforce.org'
        : 'images.fedoravforce.org';
      window.location.href = `${window.location.protocol}//${newHostname}/`;
    } else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetch(getApiUrl(platform))
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, [platform]);

  useEffect(() => {
    document.title = `Fedora-V Force Images For ${platform === 'arm' ? 'ARM' : 'RISC-V'}`;
  }, [platform]);

  if (isLoading || !data) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100vh">
        <VStack spacing={3}>
          <Spinner thickness="3px" width="50px" height="50px" />
          <Text color="gray.600" fontSize="sm">
            Loading {platform === 'arm' ? 'ARM' : 'RISC-V'} boards...
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <ChakraProvider>
      <PlatformContext.Provider value={{ platform, setPlatform: handlePlatformChange, isSpecificDomain }}>
        <Router>
          <Fade in={!isLoading} transition={{ enter: { duration: 0.5 } }}>
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
                  Fedora-V Force Images For {platform === 'arm' ? 'ARM' : 'RISC-V'}
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
                <Text fontSize="sm" color="gray.500" mb={3}>
                  Last Updated: {new Date(data.latest_updated * 1000).toLocaleString()}
                </Text>

                <Box display="inline-block" bg="white" p={2} borderRadius="lg" boxShadow="md">
                  <ButtonGroup size="md" isAttached spacing={0}>
                    {['riscv', 'arm'].map(p => (
                      <Button
                        key={p}
                        onClick={() => handlePlatformChange(p)}
                        fontWeight="bold"
                        px={8}
                        bg={platform === p ? 'blue.500' : 'gray.100'}
                        color={platform === p ? 'white' : 'gray.600'}
                        _hover={{ bg: platform === p ? 'blue.600' : 'gray.200' }}
                        borderRadius="md"
                        transition="all 0.2s"
                        ml={p === 'arm' ? 2 : 0}
                      >
                        {p === 'riscv' ? 'RISC-V' : 'ARM'}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Router>
      </PlatformContext.Provider>
    </ChakraProvider>
  );
}

export default App;
