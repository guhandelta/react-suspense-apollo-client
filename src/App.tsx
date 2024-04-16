import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { GetAllLaunchesDocument } from './App.generated';



/* During SSR, it is better to go with the way sugggested in the framework's docs, as in this case, a global var will be created with an Apollo Client instance, which will be used by the server to fetch the data and then hydrate the client with the same data, which, in the case of SST will shared over all the requests that would be coming in. But as this is a Client Side only app, the following approach can be used. */
const client = new ApolloClient({
  cache: new InMemoryCache(), 
  link: new HttpLink({
    uri: "https://spacex-production.up.railway.app/",
  })
});

  /* Though this is not used anymore, codegen.yml still need this to be able to pick it up the next time it runs, and cannot do that if this is deleted. Though thsi can be treeshaken out now as it's not used anymore, but codegen.yml needs still this.
  
  
  Query: Adding(fetching) the id would normalize the date, by adding the id as a refernce, to help identify the by the id, to know by refernce whihc data was updated. So if the title of one of the entries was changed, and get the one specific entry from the mutation, it would be able to update the list, without needing to do another request to the list.
  */
  const GET_ALL_Launches = gql`query GetAllLaunches {
    launches {
      id 
      details
      launch_date_utc
      launch_year
      mission_name
      rocket {
        rocket_name
        rocket_type
        rocket {
          engines {
            type
          }
        }
      }
    }
  }`


  const List = () => {
    /* const result = useQuery(GET_ALL_LAUNCHES, { variables: { first: 50 }}); 
      This resule would create a circular refernece, as this will contain the reference to the client, which will contain the reference to the cache, which will contain the reference to the client, and so on.
      GET_ALL_LAUNCHES => GetAllLaunchesDocument = => will make the result of the query operation to be typed. 
    */
    const { loading, data } = useQuery(GetAllLaunchesDocument, { variables: { first: 50 } });

    if(loading) return <p>Loading...</p>;

    console.log("Data from the GetAllLaunchesDocument:\t",data?.launches?.at(0)?.rocket?.rocket_type);

    return(
      <pre>
        {data?.launches?.map((launch: any) => (
          <span key={launch.mission_name}>
            <h3>{launch.mission_name}: {launch.rocket.rocket_name} - {launch.rocket.rocket.engines.type} - {launch.rocket.rocket_type}({launch.launch_year})</h3>
          </span>
        ))}
      </pre>
    )
  };

function App() {
  const [count, setCount] = useState(0)

  return (
    <ApolloProvider client={client}>
      <List />
    </ApolloProvider>
  )
}

export default App
