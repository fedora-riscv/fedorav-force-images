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
import { ExternalLinkIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

function OpticalDisk(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="72"
      height="72"
      viewBox="0 0 72 72"
      {...props}
    >
      <path
        fill="#FFF"
        d="M37 6.96c-.08 0-.17 0-.25.01c-5.46.04-10.56 1.59-14.9 4.25a28.976 28.976 0 0 0-11.76 13.94A28.693 28.693 0 0 0 8 35.96c0 15.93 12.84 28.86 28.75 28.99c.02.01.03.01.04 0c.07.01.14.01.21.01c16.02 0 29-12.99 29-29c0-16.02-12.98-29-29-29m4.5 29c0 2.76-2.24 5-5 5s-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5"
      ></path>
      <path
        fill="#D0CFCE"
        d="M9.72 24.838a28.835 28.835 0 0 0-2.22 11.12c0 15.991 13.009 29.001 29 29.001c5.288 0 10.245-1.43 14.519-3.912zm53.416 22.577A28.833 28.833 0 0 0 65.5 35.958c0-15.99-13.009-29-29-29a28.82 28.82 0 0 0-14.837 4.095z"
      ></path>
      <g fill="none" stroke="#000" strokeMiterlimit="10">
        <path d="M37 6.96c-.08 0-.17 0-.25.01c-5.46.04-10.56 1.59-14.9 4.25a28.976 28.976 0 0 0-11.76 13.94A28.693 28.693 0 0 0 8 35.96c0 15.93 12.84 28.86 28.75 28.99c.02.01.03.01.04 0c.07.01.14.01.21.01c16.02 0 29-12.99 29-29c0-16.02-12.98-29-29-29zm4.5 29c0 2.76-2.24 5-5 5s-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5z"></path>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M64.59 28.71c-.24-.92-.52-1.83-.85-2.71c-.32-.89-.69-1.77-1.1-2.61A29.09 29.09 0 0 0 49.07 9.82c-.84-.41-1.72-.78-2.61-1.1c-.88-.33-1.79-.61-2.71-.85c-2.24-.57-4.58-.89-7-.9c-.08-.01-.17-.01-.25-.01c-.44 0-.88.01-1.32.04c-.11-.01-.22 0-.32.01c-.32.01-.64.04-.95.07c-.14.01-.28.02-.42.04c-.33.03-.65.07-.98.12c-.33.04-.65.09-.98.15c-.64.11-1.28.24-1.91.4c-.3.07-.6.15-.9.23c-.03 0-.07.01-.1.03c-.6.16-1.2.35-1.78.57c-.27.09-.54.19-.81.3a.56.56 0 0 0-.2.08c-.56.2-1.11.44-1.65.71c-.29.14-.57.28-.85.42c-.57.29-1.13.6-1.67.92l.017.015c-5.333 3.17-9.561 7.985-11.957 13.775c-.18.43-.35.86-.51 1.3c-.32.87-.6 1.77-.82 2.68c-.15.56-.27 1.12-.37 1.69c-.17.83-.29 1.68-.37 2.53c-.1.96-.15 1.94-.15 2.92c0 2.5.32 4.93.91 7.24c.24.93.52 1.83.85 2.72A28.804 28.804 0 0 0 16 56.46c.99 1 2.04 1.91 3.16 2.73c.74.57 1.51 1.09 2.3 1.57h.01c.79.49 1.61.93 2.46 1.34c3.8 1.83 8.06 2.86 12.57 2.86c.08 0 .17 0 .25-.01c.02.01.03.01.04 0c.33.01.65 0 .97-.02c.15 0 .31-.01.47-.03c.32-.01.63-.03.94-.07c.47-.03.93-.09 1.39-.16c.26-.03.53-.07.79-.12c.63-.1 1.25-.23 1.87-.38c.28-.06.56-.13.84-.21c.66-.17 1.31-.37 1.95-.61c.28-.09.55-.19.81-.29c.59-.21 1.16-.46 1.73-.73c.28-.13.56-.26.84-.4c.55-.28 1.09-.57 1.63-.88l-.013-.011c5.37-3.1 9.668-7.87 12.133-13.619c.01-.01.01-.01.01-.02a27.763 27.763 0 0 0 1.4-4.08c.1-.38.19-.77.28-1.16c.13-.56.23-1.13.32-1.71c.08-.49.14-.98.19-1.48c.04-.36.07-.73.09-1.1c.05-.63.07-1.27.07-1.91c0-2.5-.32-4.93-.91-7.25M31.5 35.96c0-2.76 2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5s-5-2.24-5-5"
        ></path>
      </g>
    </svg>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch("https://api.fedoravforce.org/stats/")
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
          <Box
            w={["100%", "100%", "300px"]}
            p={4}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            mr={[0, 0, 6]}
            mb={[6, 6, 0]}
          >
            {data.result.map((category, index) => (
              <Box key={index} mb={4}>
                <Heading size="sm" mb={2} color="#444">
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
                        <Box flex="1" textAlign="left" color="#444">
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
                <Heading size="lg" color="#444">
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
                    maxH="260px"
                    objectFit="contain"
                    borderRadius="md"
                    mb={4}
                  />
                )}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" color="#444">
                    Vendor:
                  </Text>
                  {selectedProduct.vendor_link ? (
                    <Link
                      href={selectedProduct.vendor_link}
                      isExternal
                      color="teal.500"
                    >
                      {selectedProduct.vendor} <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    <Text color="#444">{selectedProduct.vendor}</Text>
                  )}
                </Box>
                <Box>
                  <Text fontSize="lg" fontWeight="bold" color="#444">
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
                  <Text fontSize="lg" fontWeight="bold" mt={4} color="#444">
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
                            <Text color="#444">{image.name} (Coming soon)</Text>
                          )}
                        </ListItem>
                      ))
                    ) : (
                      <Text color="#444">
                        No images available (Coming soon)
                      </Text>
                    )}
                  </List>
                </Box>
              </VStack>
            ) : (
              <Flex align="center" justify="center" direction="column" p={6}>
                <InfoIcon boxSize={8} color="gray.500" mb={4} />
                <Text fontSize="lg" color="gray.500" textAlign="center">
                  Select an item from the left to see details.
                </Text>
              </Flex>
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
