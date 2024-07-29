// src/App.js

import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  Button,
  Text,
  Link,
  Spinner,
  VStack,
  Divider,
  Badge,
  Image,
} from "@chakra-ui/react";
import { ExternalLinkIcon, DownloadIcon } from "@chakra-ui/icons";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

function App() {
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("https://image.fedoravforce.com/stats/")
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

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "GA":
        return "green";
      case "EOL":
        return "red";
      case "DEV":
        return "yellow";
      default:
        return "gray";
    }
  };

  const imageMap = {
    "BeagleV Ahead": "images/beaglev-ahead.png",
    "Duo 256M": "images/duo-256m.webp",
    "Duo-S": "images/duo-s.webp",
    Duo: "images/duo.webp",
    Jupiter: "images/jupiter.webp",
    "LicheePi 3A": "images/lichee-pi-3a.png",
    "LicheePi 4A": "images/lichee-pi-4a.png",
    "LicheePi 5A": "images/lichee-pi-5a.png",
    "LicheeRV Nano": "images/licheerv-nano.png",
    Mars: "images/mars.webp",
    Meles: "images/meles.webp",
    "Muse book": "images/musebook.webp",
    Pioneer: "images/pionner.webp",
    "ROMA II": "images/roma-ii.webp",
    "VisionFive V2": "images/vision-five-2.jpg",
  };

  return (
    <ChakraProvider>
      <Box p={4}>
        <Flex
          as="header"
          bg="white"
          boxShadow="sm"
          p={4}
          mb={6}
          justifyContent="center"
        >
          <Heading size="lg">Fedora-V Force Images</Heading>
        </Flex>
        <Flex>
          <Box
            w="300px"
            p={4}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            mr={6}
          >
            {data.result.map((category, index) => (
              <Box key={index} mb={4}>
                <Heading size="sm" mb={2}>
                  {category.link ? (
                    <Link href={category.link} isExternal>
                      {category.name} <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    category.name
                  )}
                </Heading>
                {category.soc.map((subCategory, subIndex) => (
                  <Accordion allowToggle key={subIndex}>
                    <AccordionItem>
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {subCategory.link ? (
                            <Link href={subCategory.link} isExternal>
                              {subCategory.name} <ExternalLinkIcon mx="2px" />
                            </Link>
                          ) : (
                            subCategory.name
                          )}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <List spacing={2}>
                          {subCategory.boards.map((product, productIndex) => (
                            <ListItem key={productIndex}>
                              <Button
                                variant="link"
                                onClick={() => setSelectedProduct(product)}
                              >
                                {product.name}
                              </Button>
                            </ListItem>
                          ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}
              </Box>
            ))}
          </Box>
          <Box flex="1" p={6} bg="white" boxShadow="md" borderRadius="md">
            {selectedProduct ? (
              <VStack align="start" spacing={4}>
                <Heading size="lg">
                  {selectedProduct.link ? (
                    <Link href={selectedProduct.link} isExternal>
                      {selectedProduct.name} <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    selectedProduct.name
                  )}
                </Heading>
                <Divider />
                {imageMap[selectedProduct.name] && (
                  <Image
                    src={`${imageMap[selectedProduct.name]}`}
                    alt={selectedProduct.name}
                    maxH="400px"
                    objectFit="contain"
                    borderRadius="md"
                    mb={4}
                  />
                )}
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    Vendor:
                  </Text>
                  {selectedProduct.vendor_link ? (
                    <Link href={selectedProduct.vendor_link} isExternal>
                      {selectedProduct.vendor} <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    <Text>{selectedProduct.vendor}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="lg" fontWeight="bold">
                    Status:
                  </Text>
                  <Badge
                    colorScheme={getStatusBadgeColor(
                      selectedProduct.board_status,
                    )}
                    fontSize="md"
                  >
                    {selectedProduct.board_status}
                  </Badge>
                </Box>
                <Box width="100%">
                  <Text fontSize="lg" fontWeight="bold" mt={4}>
                    Images:
                  </Text>
                  <List spacing={2} mt={2}>
                    {selectedProduct.images.length > 0 ? (
                      selectedProduct.images.map((image, imageIndex) => (
                        <ListItem key={imageIndex}>
                          {image.link ? (
                            <Button
                              as={Link}
                              href={image.link}
                              isExternal
                              rightIcon={<DownloadIcon />}
                              colorScheme="blue"
                              variant="outline"
                              width="100%"
                              justifyContent="space-between"
                            >
                              {image.name}
                            </Button>
                          ) : (
                            <Text>{image.name} (Coming soon)</Text>
                          )}
                        </ListItem>
                      ))
                    ) : (
                      <Text>No images available (Coming soon)</Text>
                    )}
                  </List>
                </Box>
              </VStack>
            ) : (
              <Text fontSize="lg">Select an item from the left...</Text>
            )}
          </Box>
        </Flex>
        <Box textAlign="center" mt={6}>
          <Text fontSize="sm" color="gray.500">
            Last Updated: {formatDate(data.latest_updated)}
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
