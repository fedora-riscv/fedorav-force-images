import React, { useContext } from "react";
import { Box, Heading, Text, VStack, Stat, StatLabel, StatNumber, Button, SimpleGrid, Badge, Flex } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { PlatformContext } from "./App";

export default function HomePage({ data }) {
  const { platform } = useContext(PlatformContext);

  if (!data || !data.result) {
    return null;
  }

  const totalBoards = data.result.reduce((total, category) => {
    return total + category.soc.reduce((socTotal, soc) => {
      return socTotal + soc.boards.length;
    }, 0);
  }, 0);

  const totalImages = data.result.reduce((total, category) => {
    return total + category.soc.reduce((socTotal, soc) => {
      return socTotal + soc.boards.reduce((boardTotal, board) => {
        return boardTotal + board.images.length;
      }, 0);
    }, 0);
  }, 0);

  const newBoards = data.result.reduce((total, category) => {
    return total + category.soc.reduce((socTotal, soc) => {
      return socTotal + soc.boards.filter(board => board.new_product).length;
    }, 0);
  }, 0);

  const categories = data.result.length;

  const platformName = platform === 'arm' ? 'ARM' : 'RISC-V';

  return (
    <VStack spacing={8} align="stretch" p={6}>
      <Box textAlign="center">
        <Heading size="xl" color="#444" mb={4}>
          Welcome to Fedora-V Force Images
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="600px" mx="auto">
          Your gateway to {platformName} development board images. Browse, download, and deploy
          Fedora Linux images optimized for various {platformName} hardware platforms.
        </Text>
      </Box>

      <SimpleGrid columns={[2, 2, 4]} spacing={6}>
        <Stat textAlign="center" p={4} bg="blue.50" borderRadius="md">
          <StatNumber fontSize="3xl" color="blue.600">{totalBoards}</StatNumber>
          <StatLabel color="blue.800">Development Boards</StatLabel>
        </Stat>
        <Stat textAlign="center" p={4} bg="green.50" borderRadius="md">
          <StatNumber fontSize="3xl" color="green.600">{totalImages}</StatNumber>
          <StatLabel color="green.800">Available Images</StatLabel>
        </Stat>
        <Stat textAlign="center" p={4} bg="purple.50" borderRadius="md">
          <StatNumber fontSize="3xl" color="purple.600">{categories}</StatNumber>
          <StatLabel color="purple.800">Vendors</StatLabel>
        </Stat>
        <Stat textAlign="center" p={4} bg="orange.50" borderRadius="md">
          <StatNumber fontSize="3xl" color="orange.600">{newBoards}</StatNumber>
          <StatLabel color="orange.800">New Boards</StatLabel>
        </Stat>
      </SimpleGrid>

      <Box>
        <Heading size="md" color="#444" mb={4}>
          Quick Start
        </Heading>
        <SimpleGrid columns={[1, 2]} spacing={4}>
          <Box p={6} border="1px" borderColor="gray.200" borderRadius="md">
            <Heading size="sm" color="#444" mb={2}>
              🔍 Browse Boards
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Explore development boards by category and find the perfect match for your project.
            </Text>
            <Text fontSize="xs" color="gray.500">
              Use the navigation panel on the left to browse by vendor and SoC type.
            </Text>
          </Box>
          <Box p={6} border="1px" borderColor="gray.200" borderRadius="md">
            <Heading size="sm" color="#444" mb={2}>
              💾 Download Images
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Get ready-to-use Fedora Linux images with MD5 verification.
            </Text>
            <Button
              as={RouterLink}
              to="/how-to-burn-images-to-sd-cards"
              size="sm"
              colorScheme="blue"
              variant="outline"
            >
              Installation Guide
            </Button>
          </Box>
        </SimpleGrid>
      </Box>

      <Box>
        <Heading size="md" color="#444" mb={4}>
          Chip Vendors
        </Heading>
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {data.result.map((category, index) => (
            <Box
              key={index}
              as={RouterLink}
              to={`/vendor/${encodeURIComponent(category.name)}`}
              p={4}
              border="1px"
              borderColor="gray.200"
              borderRadius="md"
              _hover={{ bg: "gray.50", textDecoration: "none", transform: "translateY(-2px)", boxShadow: "md" }}
              transition="all 0.2s"
              cursor="pointer"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm" color="#444">
                  {category.name}
                </Heading>
                <Badge colorScheme="gray" variant="outline">
                  {category.soc.reduce((total, soc) => total + soc.boards.length, 0)} boards
                </Badge>
              </Flex>
              <Text fontSize="xs" color="gray.600">
                {category.soc.length} SoC {category.soc.length === 1 ? 'family' : 'families'}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      <Box textAlign="center" pt={4}>
        <Text fontSize="sm" color="gray.500">
          Need help? Check out our{" "}
          <Button
            as={RouterLink}
            to="/how-to-burn-images-to-sd-cards"
            variant="link"
            size="sm"
            color="teal.500"
          >
            installation guide
          </Button>
          {" "}or browse the board categories on the left.
        </Text>
      </Box>
    </VStack>
  );
}