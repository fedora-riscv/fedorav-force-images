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
  Flex,
  Code,
  StatRoot,
  StatLabel,
  StatValueText,
  StatHelpText,
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseTrigger,
  PopoverHeader,
  PopoverBody,
  PopoverPositioner,
  List,
} from "@chakra-ui/react";
import {
  ExternalLink,
  Download as DownloadIcon,
  Info,
  Copy,
  History,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { imageMap, mdMap, testReportMap } from "./config";
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
        <Box color="gray.500" mb={4}>
          <Info size={32} />
        </Box>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Board not found.
        </Text>
      </Flex>
    );
  }

  const availableImages = selectedProduct.images.filter(img => img.link);
  const unavailableImages = selectedProduct.images.filter(img => !img.link);

  const tabItems = [
    { value: "overview", label: "Overview & Downloads" },
    ...(mdMap[selectedProduct.name] ? [{ value: "docs", label: "Documentation" }] : []),
    ...(testReportMap[selectedProduct.name] ? [{ value: "tests", label: "Test Reports" }] : []),
    { value: "discussion", label: "Discussion" },
  ];

  return (
    <VStack gap={6} align="stretch">
      <Box borderWidth="1px" borderRadius="md" p={5}>
        <SimpleGrid columns={[1, 1, 2]} gap={6}>
          <VStack align="start" gap={4}>
            <HStack gap={3}>
              <Heading size="xl" color="#444">
                {selectedProduct.name}
              </Heading>
              {selectedProduct.new_product && (
                <Badge colorPalette="blue" variant="solid" fontSize="sm">
                  NEW
                </Badge>
              )}
              {selectedProduct.link && (
                <Button asChild size="sm" variant="ghost">
                  <a href={selectedProduct.link} target="_blank" rel="noopener noreferrer">
                    Product Page <ExternalLink size={14} />
                  </a>
                </Button>
              )}
            </HStack>

            <SimpleGrid columns={1} gap={4} w="100%">
              <StatRoot>
                <StatLabel>Vendor</StatLabel>
                <StatValueText fontSize="lg">
                  {selectedProduct.vendor_link ? (
                    <Link href={selectedProduct.vendor_link} target="_blank" rel="noopener noreferrer" color="teal.500">
                      {selectedProduct.vendor}
                    </Link>
                  ) : (
                    selectedProduct.vendor
                  )}
                </StatValueText>
              </StatRoot>

              <StatRoot>
                <StatLabel>SoC</StatLabel>
                <StatValueText fontSize="lg">
                  {selectedSoc.link ? (
                    <Link href={selectedSoc.link} target="_blank" rel="noopener noreferrer" color="teal.500">
                      {selectedSoc.name}
                    </Link>
                  ) : (
                    selectedSoc.name
                  )}
                </StatValueText>
                <StatHelpText>{categoryInfo.name}</StatHelpText>
              </StatRoot>

              <StatRoot>
                <StatLabel>Status</StatLabel>
                <StatValueText>
                  <Badge
                    colorPalette={getStatusBadgeColor(selectedProduct.board_status)}
                    fontSize="md"
                    px={3}
                    py={1}
                  >
                    {selectedProduct.board_status}
                  </Badge>
                </StatValueText>
                <StatHelpText>
                  {selectedProduct.board_status === 'GA' && 'Generally Available'}
                  {selectedProduct.board_status === 'DEV' && 'Development'}
                  {selectedProduct.board_status === 'EOL' && 'End of Life'}
                </StatHelpText>
              </StatRoot>

              {selectedProduct.wiki_page && (
                <StatRoot>
                  <StatLabel>Documentation</StatLabel>
                  <StatValueText>
                    <Button asChild size="sm" colorPalette="teal" variant="outline">
                      <a href={selectedProduct.wiki_page} target="_blank" rel="noopener noreferrer">
                        Wiki Page <ExternalLink size={14} />
                      </a>
                    </Button>
                  </StatValueText>
                </StatRoot>
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
      </Box>

      <TabsRoot defaultValue="overview" variant="enclosed" colorPalette="blue">
        <TabsList>
          {tabItems.map(item => (
            <TabsTrigger key={item.value} value={item.value}>{item.label}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" px={0}>
          <VStack gap={8} align="stretch">
            {selectedProduct.features && Object.keys(selectedProduct.features).length > 0 && (
              <Box>
                <Heading size="lg" color="#444" mb={6}>
                  Hardware Features
                </Heading>
                <Flex flexWrap="wrap" gap={3}>
                  {Object.entries(selectedProduct.features).map(([feature, status]) =>
                    status !== null ? (
                      <Badge
                        key={feature}
                        colorPalette={getFeatureTagColor(status)}
                        px={3}
                        py={2}
                        fontSize="sm"
                      >
                        {feature}
                      </Badge>
                    ) : null
                  )}
                </Flex>
              </Box>
            )}

            <Box>
              <Heading size="lg" color="#444" mb={6}>
                Images & Downloads
              </Heading>
              <VStack gap={6} align="stretch">
                {availableImages.length > 0 && (
                  <Box>
                    <Heading size="md" color="#444" mb={4}>
                      Available Images
                    </Heading>
                    <VStack gap={4}>
                      {availableImages.map((image, index) => (
                        <Box key={index} w="100%" borderWidth="1px" borderRadius="md" p={5}>
                          <VStack gap={4} align="stretch">
                            <Flex justify="space-between" align="start" direction={["column", "row"]} gap={4}>
                              <VStack align="start" gap={2} flex="1">
                                <Heading size="sm" color="#444">
                                  {image.name}
                                </Heading>
                                <HStack gap={4} flexWrap="wrap">
                                  {image.latest_updated && (
                                    <HStack gap={1}>
                                      <Box color="gray.500"><Clock size={14} /></Box>
                                      <Text fontSize="sm" color="gray.600">
                                        {new Date(image.latest_updated).toLocaleDateString()}
                                      </Text>
                                    </HStack>
                                  )}
                                  {image.release && (
                                    <Badge colorPalette="green" variant="outline">
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

                              <VStack gap={2} align={["stretch", "end"]}>
                                <Button asChild colorPalette="blue" size="md" minW={["100%", "160px"]}>
                                  <a href={image.link} target="_blank" rel="noopener noreferrer">
                                    <DownloadIcon size={14} /> Download
                                  </a>
                                </Button>
                                {image.link && (
                                  <Button asChild variant="outline" size="sm" minW={["100%", "160px"]}>
                                    <a href={new URL(image.link.substring(0, image.link.lastIndexOf('/') + 1)).href} target="_blank" rel="noopener noreferrer">
                                      <History size={14} /> All Versions
                                    </a>
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
                                    colorPalette={copiedMd5 === image.md5 ? "green" : "gray"}
                                    variant="outline"
                                  >
                                    <Copy size={14} />
                                    {copiedMd5 === image.md5 ? "Copied!" : "Copy"}
                                  </Button>
                                  <PopoverRoot>
                                    <PopoverTrigger asChild>
                                      <Button size="sm" variant="ghost">
                                        <Info size={14} />
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverPositioner>
                                      <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseTrigger />
                                        <PopoverHeader>Verify MD5</PopoverHeader>
                                        <PopoverBody>
                                          <Box as="ol" fontSize="sm" pl={4}>
                                            <Box as="li" mb={1}>Download the file</Box>
                                            <Box as="li" mb={1}>Run <Code>md5sum ./downloaded_file</Code></Box>
                                            <Box as="li">Compare with MD5 provided here</Box>
                                          </Box>
                                        </PopoverBody>
                                      </PopoverContent>
                                    </PopoverPositioner>
                                  </PopoverRoot>
                                </HStack>
                              </Box>
                            )}
                          </VStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

                {unavailableImages.length > 0 && (
                  <Box>
                    <Heading size="md" color="#444" mb={4}>
                      Upcoming Images
                    </Heading>
                    <Box bg="blue.50" p={4} borderRadius="md">
                      <Flex align="center" gap={3}>
                        <Box color="blue.500"><Info size={20} /></Box>
                        <Box>
                          <Text fontWeight="bold">Images in Development</Text>
                          <Text fontSize="sm" color="gray.600">
                            The following images are planned but not yet available for download.
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                    <VStack gap={2} mt={4}>
                      {unavailableImages.map((image, index) => (
                        <Box key={index} p={3} border="1px solid" borderColor="gray.200" borderRadius="md" w="100%">
                          <Text color="gray.600">
                            {image.name} {selectedProduct.board_status === 'EOL' ? '(Not available - EOL)' : '(Coming soon)'}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}

                {availableImages.length === 0 && unavailableImages.length === 0 && (
                  <Box bg="orange.50" p={4} borderRadius="md">
                    <Flex align="center" gap={3}>
                      <Box color="orange.500"><Info size={20} /></Box>
                      <Box>
                        <Text fontWeight="bold">No Images Available</Text>
                        <Text fontSize="sm" color="gray.600">
                          No images are currently available for this board.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )}
              </VStack>
            </Box>
          </VStack>
        </TabsContent>

        {mdMap[selectedProduct.name] && (
          <TabsContent value="docs" px={0}>
            <Box>
              <ReactMarkdown
                children={mdMap[selectedProduct.name]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({ node, ...props }) => (
                    <Link {...props} color="teal.500" target="_blank" rel="noopener noreferrer" />
                  ),
                  details({ node, ...props }) {
                    return (
                      <Box
                        as="details"
                        p={4}
                        border="1px solid"
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
                      <Code colorPalette="gray" fontSize="inherit" {...props}>
                        {children}
                      </Code>
                    );
                  },
                  ul({ node, ...props }) {
                    return <Box as="ul" pl={4} mt={2} css={{ "& > li": { marginBottom: "0.5rem" } }} {...props} />;
                  },
                  ol({ node, ...props }) {
                    return <Box as="ol" pl={4} mt={2} css={{ "& > li": { marginBottom: "0.5rem" } }} {...props} />;
                  },
                  li({ node, ...props }) {
                    return <Box as="li" {...props} />;
                  },
                }}
              />
            </Box>
          </TabsContent>
        )}

        {testReportMap[selectedProduct.name] && (
          <TabsContent value="tests" px={0}>
            <Box borderWidth="1px" borderRadius="md" p={5}>
              <VStack gap={4}>
                <Heading size="md" color="#444">
                  Test Report
                </Heading>
                <Text color="gray.600" textAlign="center">
                  View detailed test results and compatibility information for this board.
                </Text>
                <Button asChild colorPalette="teal" size="lg">
                  <a href={testReportMap[selectedProduct.name]} target="_blank" rel="noopener noreferrer">
                    View Test Report <ExternalLink size={16} />
                  </a>
                </Button>
              </VStack>
            </Box>
          </TabsContent>
        )}

        <TabsContent value="discussion" px={0}>
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
        </TabsContent>
      </TabsRoot>
    </VStack>
  );
}
