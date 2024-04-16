import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, gql, useSuspenseQuery } from '@apollo/client'
import { Suspense, useState } from 'react'
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

      -----

      useQuery would be replaced with useSuspenseQuery when using suspense to fetch data for the component.

      loading won't be available in useSuspenseQuery as useSuspenseQuery guarantees that if this component renders the data is always there. so the ? can be dropped from data?.launches, as it is guaranteed that the data is there, but the the second ? for launches?.map() can stay as it is nullable, as per the scehma(hover over to get more info).

      useSuspenseQuery moves the loading state out of the component, so that is not somethingto be worried about, so the loading state is something that would be managed in the UI when the developer wants it to be visible. Even if there are multiple components within the Suspense block, the loading state would be displayed until all teh components are ready to be rendered. 
      This feature can be used to deal with parts of the UI where components can be separated into separate Suspense boundaries, as per the sections they are grouped under so each parts display their loading state separately, and not be dependent on parts of the UI from different section. This helps design a coherent UI, rather than parts of the UI being loaded at different times in a certian, which can seem rather disfunctional.
    */
    const {  data } = useSuspenseQuery(GetAllLaunchesDocument, { variables: { first: 50 } });

    console.log("Data from the GetAllLaunchesDocument:\t",data?.launches?.at(0)?.rocket?.rocket_type);

    return(
      <pre>
        {data.launches?.map((launch: any) => (
          <span className='' key={launch.mission_name}>
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
      <Suspense fallback={<p>Loading...</p>}>
        <List />
      </Suspense>
    </ApolloProvider>
  )
}

export default App
