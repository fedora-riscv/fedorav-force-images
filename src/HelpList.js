import React from 'react';
import { Box, Heading, Button, Flex } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { QuestionIcon } from '@chakra-ui/icons';

const HelpList = () => {
  return (
    <Box p={4} bg="white" boxShadow="md" borderRadius="md" mr={[0, 0, 6]} mb={6}>
      <Flex align="center" mb={2}>
        <QuestionIcon color="#444" mr={2} />
        <Heading size="sm" color="#444">Help</Heading>
      </Flex>
      <Button
        variant="link"
        as={RouterLink}
        to="/how-to-burn-images-to-sd-cards"
      >
        How to burn images to SD cards
      </Button>
    </Box>
  );
};

export default HelpList;
