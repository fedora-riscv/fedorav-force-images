import React from 'react';
import { Box, Heading, Button, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { CircleHelp } from 'lucide-react';

const HelpList = () => {
  return (
    <Box p={4} bg="white" boxShadow="md" borderRadius="md" mr={[0, 0, 6]} mb={6}>
      <Flex align="center" mb={2}>
        <Box asChild color="#444" mr={2}>
          <CircleHelp size={16} />
        </Box>
        <Heading size="sm" color="#444">Help</Heading>
      </Flex>
      <Button asChild variant="plain" size="sm" color="teal.500">
        <RouterLink to="/how-to-burn-images-to-sd-cards">
          How to burn images to SD cards
        </RouterLink>
      </Button>
    </Box>
  );
};

export default HelpList;
