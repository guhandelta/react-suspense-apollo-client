import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, useSuspenseQuery } from '@apollo/client'
import { Suspense, useState, useTransition } from 'react'
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
  // const GET_ALL_Launches = gql`query GetAllLaunches($limit: Int, $offset: Int){
  //   launches( limit: $limit, offset: $offset) {
  //     id
  //     rocket {
  //       rocket_name
  //       rocket_type
  //     }
  //     mission_name
  //     details
  //   }
  // }`


  const List = () => {
    /* const result = useQuery(GET_ALL_LAUNCHES, { variables: { first: 50 }}); 
      This resule would create a circular refernece, as this will contain the reference to the client, which will contain the reference to the cache, which will contain the reference to the client, and so on.
      GET_ALL_LAUNCHES => GetAllLaunchesDocument = => will make the result of the query operation to be typed. 

      -----

      useQuery would be replaced with useSuspenseQuery when using suspense to fetch data for the component.

      loading won't be available in useSuspenseQuery as useSuspenseQuery guarantees that if this component renders the data is always there. so the ? can be dropped from data?.launches, as it is guaranteed that the data is there, but the the second ? for launches?.map() can stay as it is nullable, as per the scehma(hover over to get more info).

      useSuspenseQuery moves the loading state out of the component, so that is not somethingto be worried about, so the loading state is something that would be managed in the UI when the developer wants it to be visible. Even if there are multiple components within the Suspense block, the loading state would be displayed until all teh components are ready to be rendered. 
      This feature can be used to deal with parts of the UI where components can be separated into separate Suspense boundaries, as per the sections they are grouped under so each parts display their loading state separately, and not be dependent on parts of the UI from different section. This helps design a coherent UI, rather than parts of the UI being loaded at different times in a certian, which can seem rather disfunctional.

      With suspense, esp in large apps, with component tree in multiple parent-child layers, it is possible to create waterfall of requests more easily, where the the child components fetch their data and render, only after the parent component has completed it's data fetch & render. This acn be prevented by prefetching the data and movingit upto the top.

      Suspense Boundaries can be nested inside each other, in that case when pre-fetching data higher up in the component tree, the useBackgroundQuery() hook may be used to create a query ref and pass it down to the child or granchild components, so that they can start fetching the data in the background using the queryRef from the parent in the useReadQuery() hook, and  the data can be fetched from the parent component's prefetch, and the loading state is not displayed, as the data is already there, and prevent making a suspense, at the point where it needs to be fetched.

      In a way, the useBackgroundQuery() and useReadQuery() hooks in the corresponding child components get called roughly at teh same time, which prevents the subsequent child components from waiting for the parent to finish fetching the data, so they can start their fetch, following the sequence of fetches. This method actaully removes teh requirement to understand the sequence of fetches, in the component tree, which can be perplexing in huge applications, by helping understand the queries called within each component in the component tree and start them all right at the top.

      For Eg: With tooltips, the req can be made the moment the mouse hovers over the element, and the data is fetched in the background, so that when the tooltip is actually displayed, the data is already there, and the loading state or teh flickering is not displayed, as the data is already there or holds the current UI for a second before the data is updated, and prevent making a suspense, at the point where it needs to be fetched.

      useBackgroundQuery()
        This hook likely handles data fetching operations that are meant to run in the background. Here are some potential features and behaviors based on the name:

        - Non-blocking UI Updates: The hook might fetch data without blocking or altering the UI until the data is ready, which is useful for updates that don't require immediate user feedback.
        - Low Priority: It could set a lower priority to the fetching operation, utilizing any sort of concurrency or scheduling mechanism (like those provided by React 18+ with startTransition) to emphasize that this data is not critical to immediate user interactions.
        - Cache Management: This hook might be optimized to handle caching more aggressively, fetching new data only when necessary, to minimize network usage and improve performance.
        - Use Cases: Background data refreshes, periodic data syncs, or prefetching data that will be needed later.
        
        useLoadableQuery()
          This hook likely focuses on providing a comprehensive loading state management for fetching operations. Here's what it might typically include:

        - Loading States: It probably handles various loading states (loading, success, error) more explicitly, making it easier to manage complex loading UIs directly.
        - Error Handling: Enhanced error handling capabilities could be a focus, allowing developers to easily implement error recovery or user notifications.
        - Data Dependency: This hook might be designed to handle scenarios where UI components cannot render without the fetched data, making it crucial for initial render or critical updates.
        - Suspense Integration: If using a modern React version, it might be integrated with React Suspense, providing built-in support for async data fetching with fallback UIs.
        - Use Cases: Critical data fetching on page load, dependent data fetching for rendering important UI components.
    */
    const [page, setPage] = useState(0)
    const [ pendingState, startTransition ] = useTransition()
    const { data } = useSuspenseQuery(GetAllLaunchesDocument, { variables: { limit: 10, offset: page } });

    console.log("Data from the GetAllLaunchesDocument:\t",data?.launches?.at(0)?.rocket?.rocket_type);

    console.log(data)
    return(
      <>
        <div className="console">
          <button 
            id="prev" 
            disabled={pendingState}
            onClick={() => startTransition(() => setPage(curr => curr>0?curr - 10:curr))}
          >
              {pendingState ? 'loading....' : 'Prev Page'}
            </button>
          <button 
            id="next" 
            disabled={pendingState}
            onClick={() => startTransition(() => setPage(curr => curr + 10))}
          >
              {pendingState ? 'loading....' : 'Next Page'}
            </button>
        </div>
        <ul>
          {data.launches?.map((launch: any) => (
            <li className='launchList' key={launch.id}>
              <h1>{launch.id}</h1>
              <h3 className='details'>{launch.mission_name}: {launch.rocket.rocket_name} - {launch.rocket.rocket_type} </h3><p> {launch.details}</p>
            </li>
          ))}
        </ul>
        <div className="console">
          <button 
            id="prev" 
            disabled={pendingState}
            onClick={() => startTransition(() => setPage(curr => curr>0?curr - 10:curr))}
          >
              {pendingState ? 'loading....' : 'Prev Page'}
            </button>
          <button 
            id="next" 
            disabled={pendingState}
            onClick={() => startTransition(() => setPage(curr => curr + 10))}
          >
              {pendingState ? 'loading....' : 'Next Page'}
            </button>
        </div>
      </>
    )
  };

function App() {

/*The Suspense boundaries may also be wrapped Error Boundaries in Class Components to catch errors */
  return (
    <ApolloProvider client={client}>
      <Suspense fallback={<p>Loading...</p>}>
        <List />
      </Suspense>
    </ApolloProvider>
  )
}

export default App
