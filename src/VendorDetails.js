import React from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  Button,
  Image,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Link
} from "@chakra-ui/react";
import { ExternalLinkIcon, InfoIcon } from "@chakra-ui/icons";
import { imageMap } from "./config";

export default function VendorDetails({ data }) {
  const { vendorName } = useParams();

  if (!data || !data.result) {
    return null;
  }

  // Find the vendor category
  const vendorCategory = data.result.find(category =>
    category.name.toLowerCase() === vendorName.toLowerCase()
  );

  if (!vendorCategory) {
    return (
      <Flex align="center" justify="center" direction="column" p={6}>
        <InfoIcon boxSize={8} color="gray.500" mb={4} />
        <Text fontSize="lg" color="gray.500" textAlign="center">
          Vendor not found.
        </Text>
      </Flex>
    );
  }

  // Calculate statistics
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
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardBody>
          <VStack align="start" spacing={4}>
            <HStack spacing={3}>
              <Heading size="xl" color="#444">
                {vendorCategory.name}
              </Heading>
              {vendorCategory.link && (
                <Button
                  as={Link}
                  href={vendorCategory.link}
                  isExternal
                  size="sm"
                  variant="ghost"
                  rightIcon={<ExternalLinkIcon />}
                >
                  Official Website
                </Button>
              )}
            </HStack>

            {/* Statistics */}
            <SimpleGrid columns={[2, 2, 4]} spacing={6} w="100%">
              <Stat textAlign="center" p={4} bg="blue.50" borderRadius="md">
                <StatNumber fontSize="2xl" color="blue.600">{totalBoards}</StatNumber>
                <StatLabel color="blue.800">Development Boards</StatLabel>
              </Stat>
              <Stat textAlign="center" p={4} bg="green.50" borderRadius="md">
                <StatNumber fontSize="2xl" color="green.600">{totalSoCs}</StatNumber>
                <StatLabel color="green.800">SoC Families</StatLabel>
              </Stat>
              <Stat textAlign="center" p={4} bg="purple.50" borderRadius="md">
                <StatNumber fontSize="2xl" color="purple.600">{availableImages}</StatNumber>
                <StatLabel color="purple.800">Available Images</StatLabel>
              </Stat>
              <Stat textAlign="center" p={4} bg="orange.50" borderRadius="md">
                <StatNumber fontSize="2xl" color="orange.600">{newBoards}</StatNumber>
                <StatLabel color="orange.800">New Boards</StatLabel>
              </Stat>
            </SimpleGrid>
          </VStack>
        </CardBody>
      </Card>

      {/* SoC Families and Boards */}
      <Box>
        <Heading size="lg" color="#444" mb={6}>
          SoC Families & Development Boards
        </Heading>
        <VStack spacing={6} align="stretch">
          {vendorCategory.soc.map((soc, socIndex) => (
            <Card key={socIndex} variant="outline">
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <Heading size="md" color="#444">
                        {soc.link ? (
                          <Link href={soc.link} isExternal color="teal.500">
                            {soc.name} <ExternalLinkIcon mx="1px" />
                          </Link>
                        ) : (
                          soc.name
                        )}
                      </Heading>
                      <Text fontSize="sm" color="gray.600">
                        {soc.boards.length} board{soc.boards.length !== 1 ? 's' : ''} available
                      </Text>
                    </VStack>
                    <Badge colorScheme="gray" variant="outline" px={3} py={1}>
                      SoC Family
                    </Badge>
                  </HStack>

                  {soc.boards.length > 0 && (
                    <SimpleGrid columns={[1, 2, 3]} spacing={4}>
                      {soc.boards.map((board, boardIndex) => (
                        <Card
                          key={boardIndex}
                          variant="outline"
                          as={RouterLink}
                          to={`/${board.name}`}
                          _hover={{ bg: "gray.50", transform: "translateY(-2px)", boxShadow: "lg" }}
                          transition="all 0.2s"
                          cursor="pointer"
                          textDecoration="none"
                        >
                          <CardBody p={4}>
                            <HStack spacing={3} align="start">
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

                              <VStack spacing={2} align="start" flex="1">
                                <HStack spacing={2} flexWrap="wrap">
                                  <Text
                                    fontWeight="bold"
                                    color="teal.500"
                                    fontSize="sm"
                                    noOfLines={2}
                                  >
                                    {board.name}
                                  </Text>
                                  {board.new_product && (
                                    <Badge colorScheme="blue" variant="solid" fontSize="xs">
                                      NEW
                                    </Badge>
                                  )}
                                </HStack>

                                <Text fontSize="xs" color="gray.600">
                                  {board.images.filter(img => img.link).length} image{board.images.filter(img => img.link).length !== 1 ? 's' : ''}
                                </Text>

                                <Badge
                                  colorScheme={getStatusBadgeColor(board.board_status)}
                                  fontSize="xs"
                                  px={2}
                                  py={1}
                                >
                                  {board.board_status}
                                </Badge>
                              </VStack>
                            </HStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  )}

                  {soc.boards.length === 0 && (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <AlertTitle>No Boards Available</AlertTitle>
                        <AlertDescription>
                          No development boards are currently available for this SoC family.
                        </AlertDescription>
                      </Box>
                    </Alert>
                  )}
                </VStack>
              </CardBody>
            </Card>
          ))}
        </VStack>
      </Box>

      {vendorCategory.soc.length === 0 && (
        <Alert status="warning" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>No SoC Information Available</AlertTitle>
            <AlertDescription>
              No SoC families or development boards are currently listed for this vendor.
            </AlertDescription>
          </Box>
        </Alert>
      )}
    </VStack>
  );
}