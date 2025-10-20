import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Link,
  Badge,
  Button,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  Code,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  UnorderedList,
  OrderedList,
  ListItem
} from "@chakra-ui/react";
import {
  ExternalLinkIcon,
  DownloadIcon,
  InfoIcon,
  CopyIcon,
  RepeatClockIcon,
  TimeIcon
} from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { imageMap, mdMap, testReportMap } from "./config";
import { formatDate } from "./utils";
import Giscus from '@giscus/react';

export default function ProductDetails({ data }) {
  const { productName } = useParams();
  const [copiedMd5, setCopiedMd5] = useState(null);

  let selectedProduct = null;
  let selectedSoc = null;
  let categoryInfo = null;

  for (let category of data.result) {
    for (let subCategory of category.soc) {
      for (let board of subCategory.boards) {
        if (board.name === productName) {
          selectedProduct = board;
          selectedSoc = subCategory;
          categoryInfo = category;
          break;
        }
      }
    }
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "GA": return "green";
      case "EOL": return "red";
      case "DEV": return "yellow";
      default: return "gray";
    }
  };

  const getFeatureTagColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ok': return "green";
      case 'ng': return "red";
      case 'warning': return "yellow";
      default: return "gray";
    }
  };

  const handleCopyMd5 = (md5) => {
    navigator.clipboard.writeText(md5);
    setCopiedMd5(md5);
    setTimeout(() => setCopiedMd5(null), 2000);
  };

  if (!selectedProduct) {
    return (
      <Flex align="center" justify="center" direction="column" p={6}>
        <InfoIcon boxSize={8} color="gray.500" mb={4} />
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Board not found.
        </Text>
      </Flex>
    );
  }

  const availableImages = selectedProduct.images.filter(img => img.link);
  const unavailableImages = selectedProduct.images.filter(img => !img.link);

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardBody>
          <SimpleGrid columns={[1, 1, 2]} spacing={6}>
            <VStack align="start" spacing={4}>
              <HStack spacing={3}>
                <Heading size="xl" color="#444">
                  {selectedProduct.name}
                </Heading>
                {selectedProduct.new_product && (
                  <Badge colorScheme="blue" variant="solid" fontSize="sm">
                    NEW
                  </Badge>
                )}
                {selectedProduct.link && (
                  <Button
                    as={Link}
                    href={selectedProduct.link}
                    isExternal
                    size="sm"
                    variant="ghost"
                    rightIcon={<ExternalLinkIcon />}
                  >
                    Product Page
                  </Button>
                )}
              </HStack>

              <SimpleGrid columns={1} spacing={4} w="100%">
                <Stat>
                  <StatLabel>Vendor</StatLabel>
                  <StatNumber fontSize="lg">
                    {selectedProduct.vendor_link ? (
                      <Link href={selectedProduct.vendor_link} isExternal color="teal.500">
                        {selectedProduct.vendor}
                      </Link>
                    ) : (
                      selectedProduct.vendor
                    )}
                  </StatNumber>
                </Stat>

                <Stat>
                  <StatLabel>SoC</StatLabel>
                  <StatNumber fontSize="lg">
                    {selectedSoc.link ? (
                      <Link href={selectedSoc.link} isExternal color="teal.500">
                        {selectedSoc.name}
                      </Link>
                    ) : (
                      selectedSoc.name
                    )}
                  </StatNumber>
                  <StatHelpText>{categoryInfo.name}</StatHelpText>
                </Stat>

                <Stat>
                  <StatLabel>Status</StatLabel>
                  <StatNumber>
                    <Badge
                      colorScheme={getStatusBadgeColor(selectedProduct.board_status)}
                      fontSize="md"
                      px={3}
                      py={1}
                    >
                      {selectedProduct.board_status}
                    </Badge>
                  </StatNumber>
                  <StatHelpText>
                    {selectedProduct.board_status === 'GA' && 'Generally Available'}
                    {selectedProduct.board_status === 'DEV' && 'Development'}
                    {selectedProduct.board_status === 'EOL' && 'End of Life'}
                  </StatHelpText>
                </Stat>

                {selectedProduct.wiki_page && (
                  <Stat>
                    <StatLabel>Documentation</StatLabel>
                    <StatNumber>
                      <Button
                        as={Link}
                        href={selectedProduct.wiki_page}
                        isExternal
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        rightIcon={<ExternalLinkIcon />}
                      >
                        Wiki Page
                      </Button>
                    </StatNumber>
                  </Stat>
                )}
              </SimpleGrid>
            </VStack>

            <Box>
              {imageMap[selectedProduct.name] && (
                <Image
                  src={imageMap[selectedProduct.name]}
                  alt={selectedProduct.name}
                  w="100%"
                  maxH="300px"
                  objectFit="contain"
                  borderRadius="lg"
                />
              )}
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Overview & Downloads</Tab>
          {mdMap[selectedProduct.name] && <Tab>Documentation</Tab>}
          {testReportMap[selectedProduct.name] && <Tab>Test Reports</Tab>}
          <Tab>Discussion</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <VStack spacing={8} align="stretch">
              {/* Features Section */}
              {selectedProduct.features && Object.keys(selectedProduct.features).length > 0 && (
                <Box>
                  <Heading size="lg" color="#444" mb={6}>
                    Hardware Features
                  </Heading>
                  <Wrap spacing={3}>
                    {Object.entries(selectedProduct.features).map(([feature, status]) =>
                      status !== null ? (
                        <WrapItem key={feature}>
                          <Tag
                            colorScheme={getFeatureTagColor(status)}
                            px={3}
                            py={2}
                            size="lg"
                          >
                            <TagLabel>{feature}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ) : null
                    )}
                  </Wrap>
                </Box>
              )}

              {/* Images & Downloads Section */}
              <Box>
                <Heading size="lg" color="#444" mb={6}>
                  Images & Downloads
                </Heading>
                <VStack spacing={6} align="stretch">
                  {availableImages.length > 0 && (
                    <Box>
                      <Heading size="md" color="#444" mb={4}>
                        Available Images
                      </Heading>
                      <VStack spacing={4}>
                        {availableImages.map((image, index) => (
                          <Card key={index} w="100%" variant="outline">
                            <CardBody>
                              <VStack spacing={4} align="stretch">
                                <Flex justify="space-between" align="start" direction={["column", "row"]} gap={4}>
                                  <VStack align="start" spacing={2} flex="1">
                                    <Heading size="sm" color="#444">
                                      {image.name}
                                    </Heading>
                                    <HStack spacing={4} flexWrap="wrap">
                                      {image.latest_updated && (
                                        <HStack spacing={1}>
                                          <Icon as={TimeIcon} color="gray.500" />
                                          <Text fontSize="sm" color="gray.600">
                                            {formatDate(image.latest_updated)}
                                          </Text>
                                        </HStack>
                                      )}
                                      {image.release && (
                                        <Badge colorScheme="green" variant="outline">
                                          Fedora {image.release}
                                        </Badge>
                                      )}
                                    </HStack>
                                    {image.changelog && typeof image.changelog === 'string' && image.changelog.trim() && (
                                      <Box>
                                        <Text fontSize="sm" fontWeight="semibold" color="gray.700">
                                          Changelog:
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" whiteSpace="pre-line">
                                          {image.changelog}
                                        </Text>
                                      </Box>
                                    )}
                                  </VStack>

                                  <VStack spacing={2} align={["stretch", "end"]}>
                                    <Button
                                      as={Link}
                                      href={image.link}
                                      isExternal
                                      leftIcon={<DownloadIcon />}
                                      colorScheme="blue"
                                      size="md"
                                      minW={["100%", "160px"]}
                                    >
                                      Download
                                    </Button>
                                    {image.link && (
                                      <Button
                                        as={Link}
                                        href={new URL(image.link.substring(0, image.link.lastIndexOf('/') + 1))}
                                        isExternal
                                        leftIcon={<RepeatClockIcon />}
                                        variant="outline"
                                        size="sm"
                                        minW={["100%", "160px"]}
                                      >
                                        All Versions
                                      </Button>
                                    )}
                                  </VStack>
                                </Flex>

                                {image.md5 && (
                                  <Box p={3} bg="gray.50" borderRadius="md">
                                    <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                      MD5 Checksum:
                                    </Text>
                                    <HStack>
                                      <Code fontSize="sm" flex="1" p={2}>
                                        {image.md5}
                                      </Code>
                                      <Button
                                        size="sm"
                                        onClick={() => handleCopyMd5(image.md5)}
                                        leftIcon={<CopyIcon />}
                                        colorScheme={copiedMd5 === image.md5 ? "green" : "gray"}
                                        variant="outline"
                                      >
                                        {copiedMd5 === image.md5 ? "Copied!" : "Copy"}
                                      </Button>
                                      <Popover>
                                        <PopoverTrigger>
                                          <Button size="sm" variant="ghost">
                                            <InfoIcon />
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                          <PopoverArrow />
                                          <PopoverCloseButton />
                                          <PopoverHeader>Verify MD5</PopoverHeader>
                                          <PopoverBody>
                                            <OrderedList fontSize="sm">
                                              <ListItem>Download the file</ListItem>
                                              <ListItem>Run <Code>md5sum ./downloaded_file</Code></ListItem>
                                              <ListItem>Compare with MD5 provided here</ListItem>
                                            </OrderedList>
                                          </PopoverBody>
                                        </PopoverContent>
                                      </Popover>
                                    </HStack>
                                  </Box>
                                )}
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {unavailableImages.length > 0 && (
                    <Box>
                      <Heading size="md" color="#444" mb={4}>
                        Upcoming Images
                      </Heading>
                      <Alert status="info" borderRadius="md">
                        <AlertIcon />
                        <Box>
                          <AlertTitle>Images in Development</AlertTitle>
                          <AlertDescription>
                            The following images are planned but not yet available for download.
                          </AlertDescription>
                        </Box>
                      </Alert>
                      <VStack spacing={2} mt={4}>
                        {unavailableImages.map((image, index) => (
                          <Box key={index} p={3} border="1px" borderColor="gray.200" borderRadius="md" w="100%">
                            <Text color="gray.600">
                              {image.name} {selectedProduct.board_status === 'EOL' ? '(Not available - EOL)' : '(Coming soon)'}
                            </Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {availableImages.length === 0 && unavailableImages.length === 0 && (
                    <Alert status="warning" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>No Images Available</AlertTitle>
                        <AlertDescription>
                          No images are currently available for this board.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          {mdMap[selectedProduct.name] && (
            <TabPanel px={0}>
              <Box>
                <ReactMarkdown
                  children={mdMap[selectedProduct.name]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    a: ({ node, ...props }) => (
                      <Link {...props} color="teal.500" isExternal />
                    ),
                    details({ node, ...props }) {
                      return (
                        <Box
                          as="details"
                          p={4}
                          border="1px"
                          borderColor="gray.200"
                          borderRadius="md"
                          _open={{ bg: 'gray.100' }}
                          {...props}
                        />
                      );
                    },
                    summary({ node, ...props }) {
                      return (
                        <Box
                          as="summary"
                          cursor="pointer"
                          fontWeight="bold"
                          _hover={{ color: 'teal.500' }}
                          {...props}
                        />
                      );
                    },
                    p({ node, ...props }) {
                      return <Text mt={2} {...props} />;
                    },
                    h1({ node, ...props }) {
                      return <Heading as="h1" size="lg" mt={6} mb={4} {...props} />;
                    },
                    h2({ node, ...props }) {
                      return <Heading as="h2" size="md" mt={6} mb={4} {...props} />;
                    },
                    h3({ node, ...props }) {
                      return <Heading as="h3" size="sm" mt={6} mb={4} {...props} />;
                    },
                    h4({ node, ...props }) {
                      return <Heading as="h4" size="xs" mt={6} mb={4} {...props} />;
                    },
                    h5({ node, ...props }) {
                      return <Heading as="h5" size="xs" mt={6} mb={4} {...props} />;
                    },
                    h6({ node, ...props }) {
                      return <Heading as="h6" size="xs" mt={6} mb={4} {...props} />;
                    },
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={solarizedlight}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {children}
                        </SyntaxHighlighter>
                      ) : (
                        <Code colorScheme="gray" fontSize="inherit" {...props}>
                          {children}
                        </Code>
                      );
                    },
                    ul({ node, ...props }) {
                      return <UnorderedList spacing={2} pl={4} mt={2} {...props} />;
                    },
                    ol({ node, ...props }) {
                      return <OrderedList spacing={2} pl={4} mt={2} {...props} />;
                    },
                    li({ node, ...props }) {
                      return <ListItem {...props} />;
                    },
                  }}
                />
              </Box>
            </TabPanel>
          )}

          {testReportMap[selectedProduct.name] && (
            <TabPanel px={0}>
              <Card>
                <CardBody>
                  <VStack spacing={4}>
                    <Heading size="md" color="#444">
                      Test Report
                    </Heading>
                    <Text color="gray.600" textAlign="center">
                      View detailed test results and compatibility information for this board.
                    </Text>
                    <Button
                      as={Link}
                      href={testReportMap[selectedProduct.name]}
                      isExternal
                      colorScheme="teal"
                      size="lg"
                      rightIcon={<ExternalLinkIcon />}
                    >
                      View Test Report
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </TabPanel>
          )}

          <TabPanel px={0}>
            <Box>
              <Heading size="md" color="#444" mb={4}>
                Discussion & Support
              </Heading>
              <Giscus
                key={productName}
                id="comments"
                repo="fedora-riscv/fedorav-force-images-discussions"
                repoId="R_kgDONI_toQ"
                category="Q&A"
                categoryId="DIC_kwDONI_toc4Cj42F"
                mapping="pathname"
                emitMetadata="0"
                inputPosition="top"
                reactionsEnabled="0"
                theme="light"
                lang="en"
                loading="lazy"
              />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
}