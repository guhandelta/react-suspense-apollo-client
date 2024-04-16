import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, gql, useQuery } from '@apollo/client'
import { useState } from 'react'



/* During SSR, it is better to go with the way sugggested in the framework's docs, as in this case, a global var will be created with an Apollo Client instance, which will be used by the server to fetch the data and then hydrate the client with the same data, which, in the case of SST will shared over all the requests that would be coming in. But as this is a Client Side only app, the following approach can be used. */
const client = new ApolloClient({
  cache: new InMemoryCache(), 
  link: new HttpLink({
    uri: "https://spacex-production.up.railway.app/",
  })
});

  const GET_ALL_FILMS = gql`query GetAllFilms {
    launches {
      details
      launch_date_utc
      launch_year
      mission_name
      rocket {
        rocket_name
      }
    }
  }`


  const List = () => {
    /* const result = useQuery(GET_ALL_FILMS, { variables: { first: 50 }}); 
      This resule would create a circular refernece, as this will contain the reference to the client, which will contain the reference to the cache, which will contain the reference to the client, and so on.*/
    const { loading, data } = useQuery(GET_ALL_FILMS, { variables: { first: 50 } });

    if(loading) return <p>Loading...</p>;

    return(
      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    )
  }

function App() {
  const [count, setCount] = useState(0)

  return (
    <ApolloProvider client={client}>
      <List />
    </ApolloProvider>
  )
}

export default App
