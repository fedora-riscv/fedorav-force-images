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
  HStack,
  Divider,
  Badge,
  Image,
} from "@chakra-ui/react";
import { ExternalLinkIcon, DownloadIcon, InfoIcon } from "@chakra-ui/icons";
import { BrowserRouter as Router, Routes, Route, useParams, Link as RouterLink } from "react-router-dom";
import OpticalDisk from "./OpticalDisk";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
};

function BoardList({ data }) {
  return (
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
                    {subCategory.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <List spacing={2}>
                    {subCategory.boards.map((product, productIndex) => (
                      <ListItem key={productIndex}>
                        <Button
                          variant="link"
                          as={RouterLink}
                          to={`/${product.name}`}
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
  );
}

function ProductDetails({ data }) {
  const { productName } = useParams();
  // assuming product name exists
  let selectedProduct = null;
  let selectedSoc = null;
  for (let category of data.result) {
    for (let subCategory of category.soc) {
      for (let board of subCategory.boards) {
        if (board.name === productName) {
          selectedProduct = board;
          selectedSoc = subCategory;
          break;
        }
      }
    }
  }

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
    'EIC7700-EVB': 'images/eic7700fg-evb.jpg',
  };

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

  if (!selectedProduct) {
    return (
      <Flex align="center" justify="center" direction="column" p={6}>
        <InfoIcon boxSize={8} color="gray.500" mb={4} />
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Item not found.
        </Text>
      </Flex>
    );
  }

  return (
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
      <VStack align="start" spacing={1}>
        <HStack spacing={2}>
          <Text fontWeight="bold" fontSize="lg" color="#444">
            Vendor:
          </Text>
          {selectedProduct.vendor_link ? (
            <Link href={selectedProduct.vendor_link} isExternal color="teal.500">
              {selectedProduct.vendor} <ExternalLinkIcon mx="2px" />
            </Link>
          ) : (
            <Text color="#444">{selectedProduct.vendor}</Text>
          )}
        </HStack>

        <HStack spacing={2}>
          <Text fontWeight="bold" fontSize="lg" color="#444">
            SoC:
          </Text>
          {selectedSoc.link ? (
            <Link
              href={selectedSoc.link}
              isExternal
              color="teal.500"
            >
              {selectedSoc.name} <ExternalLinkIcon mx="2px" />
            </Link>
          ) : (
            <Text color="#444">{selectedSoc.name}</Text>
          )}
        </HStack>

        {selectedProduct.wiki_page && (
          <HStack spacing={2}>
            <Text fontWeight="bold" fontSize="lg" color="#444">
              Wiki Page:
            </Text>
            <Link href={selectedProduct.wiki_page} isExternal color="teal.500">
              Link <ExternalLinkIcon mx="2px" />
            </Link>
          </HStack>
        )}

        <HStack spacing={2}>
          <Text fontWeight="bold" fontSize="lg" color="#444">
            Status:
          </Text>
          <Badge
            colorScheme={getStatusBadgeColor(selectedProduct.board_status)}
            fontSize="md"
          >
            {selectedProduct.board_status}
          </Badge>
        </HStack>
      </VStack>
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
                  <Text color="#444">{image.name} {selectedProduct.board_status === 'EOL' ? '(Not available)' : '(Coming soon)'}</Text>
                )}
              </ListItem>
            ))
          ) : (
            <Text color="#444">
              No images available {selectedProduct.board_status !== 'EOL' && '(Coming soon)'}
            </Text>
          )}
        </List>
      </Box>
    </VStack>
  );
}

function App() {
  const [data, setData] = useState(null);

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
