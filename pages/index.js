import Head from "next/head";
import { useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import {
  Heading,
  Box,
  Flex,
  Input,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import Character from "../components/Character";
import {
  SearchIcon,
  CloseIcon,
  ArrowForwardIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";

export default function Home(results) {
  const initialState = results;
  const [characters, setCharacters] = useState(initialState.characters);
  const [search, setSearch] = useState("");
  const toast = useToast();
  return (
    <Flex direction="column" justify="center" align="center">
      <Head>
        <title>Rick&Morty</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box mb={4} flexDirection="column" align="center" justify="center" py={8}>
        <Heading as="h1" size="2xl" mb={8}>
          Rick and Morty
        </Heading>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const results = await fetch("/api/SearchCharacter", {
              method: "post",
              body: search,
            });
            const { characters, error } = await results.json();
            if (error) {
              toast({
                position: "bottom",
                title: "An error ocurred",
                description: error,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            } else {
              setCharacters(characters);
            }
          }}
        >
          <Stack maxWidth="350px" width="100%" isInline mb={8}>
            <Input
              placeholder="Search"
              border="none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></Input>
            <IconButton
              colorScheme="blue"
              aria-label="Search Database"
              icon={<SearchIcon />}
              disabled={search === ""}
              type="submit"
            />
            <IconButton
              colorScheme="red"
              aria-label="Reset Button"
              icon={<CloseIcon />}
              disabled={search === ""}
              onClick={async () => {
                setSearch("");
                setCharacters(initialState.characters);
              }}
            />
          </Stack>
        </form>
        <Character characters={characters} />
        <IconButton
          mx={10}
          mt={4}
          colorScheme="blue"
          aria-label="Previous Page"
          icon={<ArrowBackIcon />}
          // disabled={search === ""}
          // type="submit"
        />
        <IconButton
          mx={10}
          mt={4}
          colorScheme="blue"
          aria-label="Next Page"
          icon={<ArrowForwardIcon />}
          // disabled={search === ""}
          // type="submit"
        />
      </Box>
    </Flex>
  );
}

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql/",
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              id
              name
            }
            origin {
              id
              name
            }
            episode {
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `,
  });
  return {
    props: {
      characters: data.characters.results,
    },
  };
};
