import React, { ReactElement } from 'react'
import styled from '@emotion/styled'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import invariant from 'tiny-invariant'
import Link from './Link'

interface Link {
  id: string
  description: string
  url: string
}

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

const StyledList = styled.ul`
  margin: 0;
  padding: 0;
`

function LinkList (): ReactElement {
  const { loading, data } = useQuery<{ feed: { links: Link[] } }>(FEED_QUERY)

  if (loading) return <div>Fetching</div>

  invariant(data, 'Data was not fetched')
  const { links } = data.feed

  return <StyledList>{links.map(link => <Link key={link.id} link={link} />)}</StyledList>
}

export default LinkList
