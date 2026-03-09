import Link from 'next/link'
import singletonRouter, { useRouter } from 'next/router'
import algoliasearch from 'algoliasearch/lite'
import React from 'react'
import { useOnClickOutside } from '@/lib/hooks'
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch'
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs'

import styles from './GlobalSearch.module.scss'

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
)

const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      // Used to not make a request to algolia when the query is empty
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: '',
          params: '',
        })),
      })
    }

    return algoliaClient.search(requests)
  },
}

const ProductItem = ({ hit, components, ...rest }) => {
  return (
    <Link draggable={false} href={hit.url} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={hit.imageThumbnail}
            alt={hit.title}
            width={40}
            height={40}
          />
        </div>
        <div className="aa-ItemContentBody">
          <div className="aa-ItemTitle">{hit.title}</div>
          <div className="aa-ItemContentDescription">
            <strong>{hit.category}</strong>
          </div>
        </div>
      </div>
    </Link>
  )
}

const GlobalSearch = () => {
  const [showResults, setShowResults] = React.useState(false)
  const [hitsCount, setHitsCount] = React.useState(0)
  const globalSearchRef = React.useRef(null)
  const router = useRouter()

  React.useEffect(() => {
    if (showResults) {
      setShowResults(!showResults)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  useOnClickOutside(globalSearchRef, () => {
    setShowResults(false)
  })

  const onStateChange = React.useCallback(({ uiState, setUiState }) => {
    setHitsCount(uiState?.products?.query?.length || 0)
    setUiState(uiState)
  }, [])

  React.useEffect(() => {
    if (hitsCount > 1) {
      setShowResults(true)
    } else {
      setShowResults(false)
    }
  }, [hitsCount])

  return (
    <InstantSearch
      indexName="products"
      searchClient={searchClient}
      onStateChange={onStateChange}
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      routing={{
        router: createInstantSearchRouterNext({
          singletonRouter,
          routerOptions: {
            cleanUrlOnDispose: false,
          },
        }),
        stateMapping: {
          // Removes the query parameter `query` when the UI state is empty
          stateToRoute: () => undefined,
          routeToState: state => state,
        },
      }}>
      <Configure hitsPerPage={5} />

      <div className={styles.searchInput} ref={globalSearchRef}>
        <SearchBox
          onFocus={() => setShowResults(true)}
          placeholder="Vad söker du?"
          className={styles.searchInput}
        />

        {showResults && (
          <div className={styles.results}>
            <Hits hitComponent={ProductItem} />
          </div>
        )}
      </div>
    </InstantSearch>
  )
}

export default GlobalSearch
