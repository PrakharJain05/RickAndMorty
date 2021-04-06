import Head from "next/head";
import { useEffect, useState } from "react";
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
  ArrowUpIcon,
} from "@chakra-ui/icons";

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [pagination, setPagination] = useState({
    hasNext: null,
    hasPrev: null,
  });
  const [search, setSearch] = useState("");
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(async () => {
    const results = await fetch("/api/GetCharacters", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: search, page: page }),
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
      setCharacters(characters.results);
      setPagination({
        hasNext: characters.info.next,
        hasPrev: characters.info.prev,
      });
    }
  }, [page, isSearching]);
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
          onSubmit={(e) => {
            e.preventDefault();
            setIsSearching(!isSearching);
            setPage(1);
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
              onClick={() => {
                setSearch("");
                setPage(1);
                setIsSearching(!isSearching);
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
          disabled={pagination.hasPrev === null}
          onClick={() => setPage((prev) => prev - 1)}
        />
        <IconButton
          mx={10}
          mt={4}
          colorScheme="blue"
          aria-label="scroll to top"
          icon={<ArrowUpIcon />}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        />
        <IconButton
          mx={10}
          mt={4}
          colorScheme="blue"
          aria-label="Next Page"
          icon={<ArrowForwardIcon />}
          disabled={pagination.hasNext === null}
          onClick={() => setPage((prev) => prev + 1)}
        />
      </Box>
    </Flex>
  );
}
