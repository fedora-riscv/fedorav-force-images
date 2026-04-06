import React from 'react';
import { Box, Heading, Link, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';

const HelpList = () => {
  return (
    <Box p={4} bg="white" boxShadow="md" borderRadius="md" mr={[0, 0, 6]} mb={6}>
      <Flex align="center" mb={2}>
        <Box asChild color="gray.700" mr={2}>
          <CircleHelp size={16} />
        </Box>
        <Heading size="sm" color="gray.700">Help</Heading>
      </Flex>
      <Link asChild color="gray.500" fontSize="md" _hover={{ textDecoration: "underline" }}>
        <RouterLink to="/how-to-burn-images-to-sd-cards">
          How to burn images to SD cards
        </RouterLink>
      </Link>
    </Box>
  );
};

export default HelpList;
