import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://rickandmortyapi.com/graphql/",
  cache: new InMemoryCache(),
});
export default async (req, res) => {
  const page = req.body.page;
  const search = req.body.search;
  try {
    const { data } = await client.query({
      query: gql`
      query {
        characters(filter: { name: "${search}"}, page: ${page} ) {
          info {
            count
            pages
            next
            prev
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
    res.status(200).json({ characters: data.characters, error: null });
  } catch (error) {
    if (error.message === "404: Not Found") {
      res.status(400).json({
        characters: null,
        error: "No Character Found",
      });
    } else {
      res.status(500).json({
        characters: null,
        error: "Internal Server Error",
      });
    }
  }
};
