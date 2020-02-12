import React, { FunctionComponent } from 'react'
import styled from '@xstyled/styled-components'

interface Props {
  link: {
    description: string
    url: string
  }
}

const StyledListItem = styled.li`
  color: primary;
  list-style-type: none;
`

const Link: FunctionComponent<Props> = ({ link: { description, url } }: Props) => {
  return (
    <StyledListItem>{description} ({url})</StyledListItem>
  )
}

export default Link
