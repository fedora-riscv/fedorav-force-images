import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Link,
  Image,
  Badge,
  Button,
  Separator,
  SimpleGrid,
  Flex
} from "@chakra-ui/react";
import { ExternalLink, Download, TriangleAlert, CircleCheck, Info } from "lucide-react";

export default function HowToBurnImagesToSDCards() {
    const steps = [
        {
            title: "Download Fedora Image",
            description: "Choose your preferred desktop environment",
            content: "Visit the images portal to download the latest Fedora RISC-V image. GNOME and XFCE desktop environments are available.",
            image: "/images/burn-images-to-sd-01.webp",
            links: [
                { text: "Download Images", url: "https://images.fedoravforce.org", icon: Download }
            ]
        },
        {
            title: "Get balenaEtcher",
            description: "Cross-platform image flashing tool",
            content: "Download and install balenaEtcher, a reliable tool for flashing OS images to SD cards and USB drives.",
            image: "/images/burn-images-to-sd-02.webp",
            links: [
                { text: "Download balenaEtcher", url: "https://etcher.balena.io", icon: Download }
            ]
        },
        {
            title: "Select Image File",
            description: "Load your downloaded image",
            content: "Open balenaEtcher and click 'Flash from file' to select the Fedora image you downloaded.",
            image: "/images/burn-images-to-sd-03.webp",
            images: ["/images/burn-images-to-sd-03.webp", "/images/burn-images-to-sd-04.webp"]
        },
        {
            title: "Choose Target Device",
            description: "Select your SD card",
            content: "Insert your SD card and click 'Select target' to choose it as the destination device.",
            images: ["/images/burn-images-to-sd-05.webp", "/images/burn-images-to-sd-06.webp"]
        },
        {
            title: "Flash the Image",
            description: "Write image to SD card",
            content: "Click 'Flash' to begin writing the image to your SD card. This process may take several minutes.",
            image: "/images/burn-images-to-sd-07.webp"
        }
    ];

    return (
        <VStack gap={8} align="stretch">
            <Box textAlign="center">
                <Heading size="xl" color="#444" mb={4}>
                    How to Flash Images to SD Cards
                </Heading>
                <Text fontSize="lg" color="gray.600" maxW="600px" mx="auto">
                    Follow this step-by-step guide to flash Fedora RISC-V images to your SD card
                    and get your development board up and running.
                </Text>
            </Box>

            <Box bg="blue.50" p={4} borderRadius="md">
                <Flex align="center" gap={3}>
                    <Box color="blue.500"><Info size={20} /></Box>
                    <Box>
                        <Text fontWeight="bold">Before You Start</Text>
                        <Text fontSize="sm" color="gray.600">
                            Make sure you have an SD card with at least 8GB capacity and a reliable internet connection.
                            Back up any important data on the SD card as it will be completely overwritten.
                        </Text>
                    </Box>
                </Flex>
            </Box>

            <SimpleGrid columns={[1, 1, 2]} gap={6} mb={6}>
                <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="md">
                    <HStack mb={3}>
                        <Box color="green.500"><CircleCheck size={16} /></Box>
                        <Heading size="sm" color="#444">Requirements</Heading>
                    </HStack>
                    <VStack align="start" gap={2}>
                        <Text fontSize="sm">SD card (8GB+ recommended)</Text>
                        <Text fontSize="sm">Computer with SD card reader</Text>
                        <Text fontSize="sm">Internet connection</Text>
                        <Text fontSize="sm">balenaEtcher software</Text>
                    </VStack>
                </Box>
                <Box p={6} border="1px solid" borderColor="gray.200" borderRadius="md">
                    <HStack mb={3}>
                        <Box color="orange.500"><TriangleAlert size={16} /></Box>
                        <Heading size="sm" color="#444">Important Notes</Heading>
                    </HStack>
                    <VStack align="start" gap={2}>
                        <Text fontSize="sm">All data on SD card will be erased</Text>
                        <Text fontSize="sm">Flashing process may take 10-30 minutes</Text>
                        <Text fontSize="sm">Don't remove SD card during flashing</Text>
                        <Text fontSize="sm">Verify MD5 checksum if available</Text>
                    </VStack>
                </Box>
            </SimpleGrid>

            <Box>
                <Heading size="lg" color="#444" mb={6}>
                    Step-by-Step Instructions
                </Heading>

                <VStack gap={8}>
                    {steps.map((step, index) => (
                        <Box key={index} w="100%">
                            <Flex
                                direction={["column", "column", index % 2 === 0 ? "row" : "row-reverse"]}
                                align="center"
                                gap={8}
                            >
                                <VStack align="start" gap={4} flex="1">
                                    <HStack>
                                        <Badge
                                            colorPalette="blue"
                                            variant="solid"
                                            fontSize="md"
                                            px={3}
                                            py={1}
                                            borderRadius="full"
                                        >
                                            {index + 1}
                                        </Badge>
                                        <Heading size="md" color="#444">
                                            {step.title}
                                        </Heading>
                                    </HStack>

                                    <Text color="gray.600" fontSize="sm">
                                        {step.description}
                                    </Text>

                                    <Text color="#444">
                                        {step.content}
                                    </Text>

                                    {step.links && (
                                        <VStack align="start" gap={2}>
                                            {step.links.map((link, linkIndex) => (
                                                <Button
                                                    key={linkIndex}
                                                    asChild
                                                    colorPalette="blue"
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                        <link.icon size={14} />
                                                        {link.text}
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </Button>
                                            ))}
                                        </VStack>
                                    )}
                                </VStack>

                                <Box flex="1">
                                    {step.images ? (
                                        <SimpleGrid columns={[1, 2]} gap={4}>
                                            {step.images.map((img, imgIndex) => (
                                                <Image
                                                    key={imgIndex}
                                                    src={img}
                                                    alt={`${step.title} ${imgIndex + 1}`}
                                                    borderRadius="md"
                                                    boxShadow="md"
                                                    _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }}
                                                />
                                            ))}
                                        </SimpleGrid>
                                    ) : (
                                        <Image
                                            src={step.image}
                                            alt={step.title}
                                            borderRadius="md"
                                            boxShadow="md"
                                            _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }}
                                        />
                                    )}
                                </Box>
                            </Flex>
                            {index < steps.length - 1 && <Separator mt={8} />}
                        </Box>
                    ))}
                </VStack>
            </Box>

            <Box bg="green.50" p={4} borderRadius="md">
                <Flex align="center" gap={3}>
                    <Box color="green.500"><CircleCheck size={20} /></Box>
                    <Box>
                        <Text fontWeight="bold">You're Done!</Text>
                        <Text fontSize="sm" color="gray.600">
                            Your SD card is now ready to boot on your RISC-V development board.
                            Insert it into your board and power it on to start using Fedora Linux.
                        </Text>
                    </Box>
                </Flex>
            </Box>

            <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                <Heading size="md" color="#444" mb={3}>
                    Need Help?
                </Heading>
                <Text color="gray.600">
                    If you encounter any issues during the flashing process, check the board-specific
                    documentation or reach out to the development board community for support.
                </Text>
            </Box>
        </VStack>
    );
}
