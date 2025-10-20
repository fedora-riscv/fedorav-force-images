import React, { useState, useMemo } from "react";
import { Box, Heading, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, List, ListItem, Button, Link, Badge, Input, InputGroup, InputLeftElement, VStack } from "@chakra-ui/react";
import { ExternalLinkIcon, SearchIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function BoardList({ data }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleVendorClick = (categoryName) => {
    navigate(`/vendor/${encodeURIComponent(categoryName)}`);
  };

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) {
      return data.result;
    }

    const term = searchTerm.toLowerCase().trim();

    return data.result.map((category) => ({
      ...category,
      soc: category.soc.map((soc) => ({
        ...soc,
        boards: soc.boards.filter((board) =>
          board.name.toLowerCase().includes(term) ||
          category.name.toLowerCase().includes(term) ||
          soc.name.toLowerCase().includes(term)
        )
      })).filter((soc) => soc.boards.length > 0)
    })).filter((category) => category.soc.length > 0);
  }, [data.result, searchTerm]);

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
      <VStack spacing={4} align="stretch">
        {/* Search Input */}
        <InputGroup size="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search boards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            _focus={{
              bg: "white",
              borderColor: "blue.300",
              boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
            }}
          />
        </InputGroup>

        {/* Board List */}
        <Box>
          {filteredData.length === 0 && searchTerm.trim() ? (
            <Box p={4} textAlign="center">
              <SearchIcon color="gray.300" mb={2} />
              <Box fontSize="sm" color="gray.500">
                No boards found matching "{searchTerm}"
              </Box>
            </Box>
          ) : (
            filteredData.map((category, index) => (
              <Box key={index} mb={4}>
                <Heading size="sm" mb={2} color="#444">
                  {category.link ? (
                    <Link href={category.link} isExternal>
                      {category.name} <ExternalLinkIcon mx="2px" />
                    </Link>
                  ) : (
                    <Link
                      color="#444"
                      _hover={{ color: "teal.500", textDecoration: "underline" }}
                      onClick={() => handleVendorClick(category.name)}
                      cursor="pointer"
                    >
                      {category.name}
                    </Link>
                  )}
                </Heading>
                {category.soc.map((subCategory, subIndex) => (
                  <Accordion allowToggle key={subIndex}>
                    <AccordionItem>
                      <AccordionButton onClick={() => handleVendorClick(category.name)}>
                        <Box flex="1" textAlign="left" color="#444">
                          {subCategory.name}
                          {searchTerm.trim() && (
                            <Badge ml={2} colorScheme="blue" variant="outline" fontSize="xs">
                              {subCategory.boards.length}
                            </Badge>
                          )}
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
                              {product["new_product"] && (
                                <Badge colorScheme="blue" variant="solid" style={{marginLeft: 5}}>
                                  New
                                </Badge>
                              )}
                            </ListItem>
                          ))}
                        </List>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}
              </Box>
            ))
          )}
        </Box>
      </VStack>
    </Box>
  );
}