import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Button,
  Image,
  Flex,
  Link,
  StatRoot,
  StatLabel,
  StatValueText,
} from "@chakra-ui/react";
import { ExternalLink, Info } from "lucide-react";
import { imageMap } from "./config";

export default function VendorDetails({ data }) {
  const { vendorName } = useParams();

  if (!data || !data.result) {
    return null;
  }

  const vendorCategory = data.result.find(category =>
    category.name.toLowerCase() === vendorName.toLowerCase()
  );

  if (!vendorCategory) {
    return (
      <Flex align="center" justify="center" direction="column" p={6}>
        <Box color="gray.500" mb={4}>
          <Info size={32} />
        </Box>
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Vendor not found.
        </Text>
      </Flex>
    );
  }

  const totalBoards = vendorCategory.soc.reduce((total, soc) => total + soc.boards.length, 0);
  const totalSoCs = vendorCategory.soc.length;
  const newBoards = vendorCategory.soc.reduce((total, soc) =>
    total + soc.boards.filter(board => board.new_product).length, 0
  );
  const availableImages = vendorCategory.soc.reduce((total, soc) =>
    total + soc.boards.reduce((boardTotal, board) =>
      boardTotal + board.images.filter(img => img.link).length, 0
    ), 0
  );

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "GA": return "green";
      case "EOL": return "red";
      case "DEV": return "yellow";
      default: return "gray";
    }
  };

  return (
    <VStack gap={6} align="stretch">
      <Box borderWidth="1px" borderRadius="md" p={5}>
        <VStack align="start" gap={4}>
          <HStack gap={3}>
            <Heading size="xl" color="#444">
              {vendorCategory.name}
            </Heading>
            {vendorCategory.link && (
              <Button asChild size="sm" variant="ghost">
                <a href={vendorCategory.link} target="_blank" rel="noopener noreferrer">
                  Official Website <ExternalLink size={14} />
                </a>
              </Button>
            )}
          </HStack>

          <SimpleGrid columns={[2, 2, 4]} gap={6} w="100%">
            <StatRoot textAlign="center" p={4} bg="blue.50" borderRadius="md">
              <StatValueText fontSize="2xl" color="blue.600">{totalBoards}</StatValueText>
              <StatLabel color="blue.800">Development Boards</StatLabel>
            </StatRoot>
            <StatRoot textAlign="center" p={4} bg="green.50" borderRadius="md">
              <StatValueText fontSize="2xl" color="green.600">{totalSoCs}</StatValueText>
              <StatLabel color="green.800">SoC Families</StatLabel>
            </StatRoot>
            <StatRoot textAlign="center" p={4} bg="purple.50" borderRadius="md">
              <StatValueText fontSize="2xl" color="purple.600">{availableImages}</StatValueText>
              <StatLabel color="purple.800">Available Images</StatLabel>
            </StatRoot>
            <StatRoot textAlign="center" p={4} bg="orange.50" borderRadius="md">
              <StatValueText fontSize="2xl" color="orange.600">{newBoards}</StatValueText>
              <StatLabel color="orange.800">New Boards</StatLabel>
            </StatRoot>
          </SimpleGrid>
        </VStack>
      </Box>

      <Box>
        <Heading size="lg" color="#444" mb={6}>
          SoC Families & Development Boards
        </Heading>
        <VStack gap={6} align="stretch">
          {vendorCategory.soc.map((soc, socIndex) => (
            <Box key={socIndex} borderWidth="1px" borderRadius="md" p={5}>
              <VStack gap={4} align="stretch">
                <HStack justify="space-between" align="center">
                  <VStack align="start" gap={1}>
                    <Heading size="md" color="#444">
                      {soc.link ? (
                        <Link href={soc.link} target="_blank" rel="noopener noreferrer" color="teal.500">
                          {soc.name} <ExternalLink size={12} style={{display: "inline", verticalAlign: "middle"}} />
                        </Link>
                      ) : (
                        soc.name
                      )}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {soc.boards.length} board{soc.boards.length !== 1 ? 's' : ''} available
                    </Text>
                  </VStack>
                  <Badge colorPalette="gray" variant="outline" px={3} py={1}>
                    SoC Family
                  </Badge>
                </HStack>

                {soc.boards.length > 0 && (
                  <SimpleGrid columns={[1, 2, 3]} gap={4}>
                    {soc.boards.map((board, boardIndex) => (
                      <Box
                        key={boardIndex}
                        asChild
                        borderWidth="1px"
                        borderRadius="md"
                        p={4}
                        _hover={{ bg: "gray.50", transform: "translateY(-2px)", boxShadow: "lg" }}
                        transition="all 0.2s"
                        cursor="pointer"
                        textDecoration="none"
                      >
                        <RouterLink to={`/${board.name}`}>
                          <HStack gap={3} align="start">
                            <Flex justify="center" align="center" w="80px" h="80px" flexShrink={0}>
                              {imageMap[board.name] ? (
                                <Image
                                  src={imageMap[board.name]}
                                  alt={board.name}
                                  maxH="70px"
                                  maxW="70px"
                                  objectFit="contain"
                                  borderRadius="md"
                                />
                              ) : (
                                <Box
                                  w="70px"
                                  h="70px"
                                  bg="gray.100"
                                  borderRadius="md"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                >
                                  <Text color="gray.400" fontSize="xs">
                                    No image
                                  </Text>
                                </Box>
                              )}
                            </Flex>

                            <VStack gap={2} align="start" flex="1">
                              <HStack gap={2} flexWrap="wrap">
                                <Text
                                  fontWeight="bold"
                                  color="teal.500"
                                  fontSize="sm"
                                  lineClamp={2}
                                >
                                  {board.name}
                                </Text>
                                {board.new_product && (
                                  <Badge colorPalette="blue" variant="solid" fontSize="xs">
                                    NEW
                                  </Badge>
                                )}
                              </HStack>

                              <Text fontSize="xs" color="gray.600">
                                {board.images.filter(img => img.link).length} image{board.images.filter(img => img.link).length !== 1 ? 's' : ''}
                              </Text>

                              <Badge
                                colorPalette={getStatusBadgeColor(board.board_status)}
                                fontSize="xs"
                                px={2}
                                py={1}
                              >
                                {board.board_status}
                              </Badge>
                            </VStack>
                          </HStack>
                        </RouterLink>
                      </Box>
                    ))}
                  </SimpleGrid>
                )}

                {soc.boards.length === 0 && (
                  <Box bg="blue.50" p={4} borderRadius="md">
                    <Flex align="center" gap={3}>
                      <Box color="blue.500"><Info size={20} /></Box>
                      <Box>
                        <Text fontWeight="bold">No Boards Available</Text>
                        <Text fontSize="sm" color="gray.600">
                          No development boards are currently available for this SoC family.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                )}
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {vendorCategory.soc.length === 0 && (
        <Box bg="orange.50" p={4} borderRadius="md">
          <Flex align="center" gap={3}>
            <Box color="orange.500"><Info size={20} /></Box>
            <Box>
              <Text fontWeight="bold">No SoC Information Available</Text>
              <Text fontSize="sm" color="gray.600">
                No SoC families or development boards are currently listed for this vendor.
              </Text>
            </Box>
          </Flex>
        </Box>
      )}
    </VStack>
  );
}
