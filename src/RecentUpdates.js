import React from "react";
import { Box, Heading, HStack, Text, Badge, Link, VStack, Flex, Image, SimpleGrid } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { imageMap } from "./config";

export default function RecentUpdates({ data }) {
  if (!data || !data.result) {
    return null;
  }

  // Extract all images with their board info and latest_updated timestamps
  const allImages = [];

  data.result.forEach((category) => {
    category.soc.forEach((soc) => {
      soc.boards.forEach((board) => {
        board.images.forEach((image) => {
          if (image.latest_updated) {
            allImages.push({
              ...image,
              boardName: board.name,
              boardVendor: board.vendor,
              isNewProduct: board.new_product,
              boardImage: imageMap[board.name]
            });
          }
        });
      });
    });
  });

  // Sort by latest_updated timestamp (most recent first) and take top 3
  const recentImages = allImages
    .sort((a, b) => {
      // Convert date strings to timestamps for comparison
      const dateA = new Date(a.latest_updated).getTime() || 0;
      const dateB = new Date(b.latest_updated).getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  if (recentImages.length === 0) {
    return null;
  }

  return (
    <Box
      bg="white"
      boxShadow="md"
      borderRadius="md"
      p={6}
      mb={6}
    >
      <Heading size="md" mb={4} color="#444">
        Recently Updated Images
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={4}>
        {recentImages.map((image, index) => (
          <Box
            key={`${image.boardName}-${image.name}-${index}`}
            as={RouterLink}
            to={`/${image.boardName}`}
            p={4}
            border="1px"
            borderColor="gray.200"
            borderRadius="md"
            _hover={{ bg: "gray.50", textDecoration: "none", transform: "translateY(-2px)", boxShadow: "lg" }}
            transition="all 0.2s"
            cursor="pointer"
            height="fit-content"
          >
            <Flex align="center" justify="space-between">
              <HStack spacing={3} flex="1">
                {image.boardImage && (
                  <Image
                    src={image.boardImage}
                    alt={image.boardName}
                    boxSize="50px"
                    objectFit="contain"
                    borderRadius="md"
                  />
                )}
                <VStack align="start" spacing={1} flex="1">
                  <HStack spacing={2}>
                    <Text
                      fontWeight="bold"
                      color="teal.500"
                      fontSize="sm"
                    >
                      {image.boardName}
                    </Text>
                    {image.isNewProduct && (
                      <Badge colorScheme="blue" variant="solid" fontSize="xs">
                        NEW
                      </Badge>
                    )}
                  </HStack>
                  <Text fontSize="xs" color="gray.600" noOfLines={1}>
                    {image.name}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {image.boardVendor}
                  </Text>
                </VStack>
              </HStack>
              <VStack align="end" spacing={1}>
                <Text fontSize="xs" fontWeight="medium" color="#444">
                  {new Date(image.latest_updated).toLocaleDateString()}
                </Text>
                {image.release && (
                  <Badge colorScheme="green" variant="outline" fontSize="xs">
                    Fedora {image.release}
                  </Badge>
                )}
              </VStack>
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}