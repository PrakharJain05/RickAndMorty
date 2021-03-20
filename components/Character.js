import Image from "next/image";
import { Heading, Text, SimpleGrid } from "@chakra-ui/react";

export const Character = ({ characters }) => {
  return (
    <SimpleGrid columns={[1, 2, 3]} spacing="40px">
      {characters.map((character) => {
        return (
          <div key={character.id}>
            <Image src={character.image} width={300} height={300} />
            <Heading as="h4" alignItems="center" size="md">
              {character.name}
            </Heading>
            <Text alignItems="center">Origin : {character.origin.name}</Text>
            <Text alignItems="center">
              Location : {character.location.name}
            </Text>
          </div>
        );
      })}
    </SimpleGrid>
  );
};

export default Character;
