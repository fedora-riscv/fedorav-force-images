import React, { useState, useMemo } from "react";
import {
  Box,
  Heading,
  Link,
  Badge,
  Input,
  VStack,
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
  AccordionItemIndicator,
  List,
} from "@chakra-ui/react";
import { Search, ExternalLink } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function BoardList({ data }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleVendorClick = (categoryName) => {
    navigate(`/vendor/${encodeURIComponent(categoryName)}`);
  };

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
      <VStack gap={4} align="stretch">
        <Box position="relative">
          <Box position="absolute" left="3" top="50%" transform="translateY(-50%)" zIndex="1" pointerEvents="none" color="gray.300">
            <Search size={14} />
          </Box>
          <Input
            size="sm"
            pl="9"
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
        </Box>

        <Box>
          {filteredData.length === 0 && searchTerm.trim() ? (
            <Box p={4} textAlign="center">
              <Box color="gray.300" mb={2}>
                <Search size={16} />
              </Box>
              <Box fontSize="sm" color="gray.500">
                No boards found matching "{searchTerm}"
              </Box>
            </Box>
          ) : (
            filteredData.map((category, index) => (
              <Box key={index} mb={4}>
                <Heading size="sm" mb={2} color="#444">
                  {category.link ? (
                    <Link href={category.link} target="_blank" rel="noopener noreferrer">
                      {category.name} <ExternalLink size={12} style={{display: "inline", verticalAlign: "middle"}} />
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
                  <AccordionRoot collapsible key={subIndex}>
                    <AccordionItem value={subCategory.name}>
                      <AccordionItemTrigger pl={4} onClick={() => handleVendorClick(category.name)} cursor="pointer" _hover={{ bg: "gray.100" }} borderRadius="md">
                        <Box flex="1" textAlign="left" color="#444">
                          {subCategory.name}
                          {searchTerm.trim() && (
                            <Badge ml={2} colorPalette="blue" variant="outline" fontSize="xs">
                              {subCategory.boards.length}
                            </Badge>
                          )}
                        </Box>
                        <AccordionItemIndicator />
                      </AccordionItemTrigger>
                      <AccordionItemContent pb={2} pl={6}>
                        <List.Root gap={1} listStyle="none">
                          {subCategory.boards.map((product, productIndex) => (
                            <List.Item key={productIndex}>
                              <Link
                                asChild
                                color="gray.500"
                                fontWeight="semibold"
                                fontSize="md"
                                _hover={{ textDecoration: "underline" }}
                              >
                                <RouterLink to={`/${product.name}`}>
                                  {product.name}
                                </RouterLink>
                              </Link>
                              {product["new_product"] && (
                                <Badge colorPalette="blue" variant="solid" ml={1}>
                                  New
                                </Badge>
                              )}
                            </List.Item>
                          ))}
                        </List.Root>
                      </AccordionItemContent>
                    </AccordionItem>
                  </AccordionRoot>
                ))}
              </Box>
            ))
          )}
        </Box>
      </VStack>
    </Box>
  );
}
