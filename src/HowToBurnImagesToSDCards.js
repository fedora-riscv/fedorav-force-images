import { Box, Heading, OrderedList, ListItem, Link, Image } from "@chakra-ui/react";

export default function HowToBurnImagesToSDCards() {
    return (
        <Box>
            <Heading as="h1" mb={4}>How to burn images to SD cards</Heading>
            <OrderedList spacing={6}>
                <ListItem>
                    Open <Link href="https://images.fedoravforce.org" isExternal color="blue.500">images.fedoravforce.org</Link> to download the image. Choose GNOME or XFCE as your desktop. We'll use GNOME in this example.
                    <Image src="images/burn-images-to-sd-01.png" alt="Download Fedora image" mt={2} borderRadius="md" />
                </ListItem>
                
                <ListItem>
                    Visit <Link href="https://etcher.balena.io" isExternal color="blue.500">etcher.balena.io</Link> to download and install balenaEtcher (available for Windows, Linux, or macOS).
                    <Image src="images/burn-images-to-sd-02.png" alt="Download balenaEtcher" mt={2} borderRadius="md" />
                </ListItem>
                
                <ListItem>
                    Open balenaEtcher, click "Flash from file", and select the image you just downloaded.
                    <Image src="images/burn-images-to-sd-03.png" alt="Open balenaEtcher" mt={2} borderRadius="md" />
                    <Image src="images/burn-images-to-sd-04.png" alt="Select image file" mt={2} borderRadius="md" />
                </ListItem>
                
                <ListItem>
                    Insert your SD card into your computer and click "Select target".
                    <Image src="images/burn-images-to-sd-05.png" alt="Select target 1" mt={2} borderRadius="md" />
                    <Image src="images/burn-images-to-sd-06.png" alt="Select target 2" mt={2} borderRadius="md" />
                </ListItem>
                
                <ListItem>
                    Click "Flash". Once completed, the SD card will be ready for booting.
                    <Image src="images/burn-images-to-sd-07.png" alt="Flash SD card" mt={2} borderRadius="md" />
                </ListItem>
            </OrderedList>
        </Box>
    );
}
