import React from "react";
import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, List, ListItem, Button, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

export default function BoardList({ data }) {
  return (
    <Box
      w={["100%", "100%", "300px"]}
      p={4}
      bg="white"
      boxShadow="md"
      borderRadius="md"
      mr={[0, 0, 6]}
      mb={[6, 6, 0]}
    >
      {data.result.map((category, index) => (
        <Box key={index} mb={4}>
          <Heading size="sm" mb={2} color="#444">
            {category.link ? (
              <Link href={category.link} isExternal>
                {category.name} <ExternalLinkIcon mx="2px" />
              </Link>
            ) : (
              category.name
            )}
          </Heading>
          {category.soc.map((subCategory, subIndex) => (
            <Accordion allowToggle key={subIndex}>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left" color="#444">
                    {subCategory.name}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <List spacing={2}>
                    {subCategory.boards.map((product, productIndex) => (
                      <ListItem key={productIndex}>
                        <Button
                          variant="link"
                          as={RouterLink}
                          to={`/${product.name}`}
                        >
                          {product.name}
                        </Button>
                      </ListItem>
                    ))}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          ))}
        </Box>
      ))}
    </Box>
  );
}