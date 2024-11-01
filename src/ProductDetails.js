import React from "react";
import { useParams } from "react-router-dom";
import { Box, VStack, Heading, Divider, Image, HStack, Text, Link, Badge, List, ListItem, Button, UnorderedList, OrderedList, Code, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Wrap, WrapItem, Tag, TagLabel } from "@chakra-ui/react";
import { ExternalLinkIcon, DownloadIcon, InfoIcon, CopyIcon } from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { imageMap, mdMap } from "./config";
import Giscus from '@giscus/react';

export default function ProductDetails({ data }) {
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

  const getFeatureTagColor = (status) => {
    switch (status.toLowerCase()) {
      case 'ok':
        return "green";
      case 'ng':
        return "red";
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
      {mdMap[selectedProduct.name] && (
        <Box width="100%">
          <Text fontSize="lg" fontWeight="bold" mb={4} color="#444">
            Additional Information:
          </Text>
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
                // e.g. "language-bash" -> "bash"
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
      )}
      <Box width="100%">
        <Text fontSize="lg" fontWeight="bold" mt={4} color="#444">
          Images:
        </Text>
        <List spacing={2} mt={2}>
          {selectedProduct.images.length > 0 ? (
            selectedProduct.images.map((image, imageIndex) => (
              <ListItem key={imageIndex}>
                {image.link ? (
                  <VStack align="stretch" width="100%">
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
                    {image.md5 && (
                      <HStack spacing={2} alignItems="center">
                        <Text fontSize="sm" color="gray.600">
                          MD5: {image.md5}
                        </Text>
                        <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(image.md5)}>
                          <CopyIcon />
                        </Button>
                          <Popover>
                            <PopoverTrigger>
                              <InfoIcon />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Validate MD5</PopoverHeader>
                              <PopoverBody>
                                <OrderedList>
                                  <ListItem>Download the file</ListItem>
                                  <ListItem>Run <Code>md5sum ./downloaded_file</Code></ListItem>
                                  <ListItem>Compare with MD5 provided here</ListItem>
                                </OrderedList>
                              </PopoverBody>
                            </PopoverContent>
                          </Popover>
                      </HStack>
                    )}
                  </VStack>
                ) : (
                  <Text color="#444">
                    {image.name} {selectedProduct.board_status === 'EOL' ? '(Not available)' : '(Coming soon)'}
                  </Text>
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

      {selectedProduct.features && Object.keys(selectedProduct.features).length > 0 && (
        <Box width="100%">
          <Text fontSize="lg" fontWeight="bold" mt={4} mb={2} color="#444">
            Features:
          </Text>
          <Wrap spacing={2}>
            {Object.entries(selectedProduct.features).map(([feature, status]) => (
              <WrapItem key={feature}>
                <Tag 
                  colorScheme={getFeatureTagColor(status)}
                  px={3}
                  py={1}
                >
                  <TagLabel>{feature}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      <Box>
        <Text fontSize="lg" fontWeight="bold" mt={4} color="#444">
          Changelog:
        </Text>
        <Text whiteSpace='pre-wrap'>
          {selectedProduct.changelog === '' ? 'None' : selectedProduct.changelog}
        </Text>
      </Box>

      <Box width="100%">
        <Text fontSize="lg" fontWeight="bold" mt={4} mb={4} color="#444">
          Comments:
        </Text>
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
          theme="light"
          lang="en"
          loading="lazy"
        />
      </Box>
    </VStack>
  );
}