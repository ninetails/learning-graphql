import * as React from 'react'
import { BaseContext } from 'koa'
import { ThemeProvider } from '@xstyled/styled-components'
import { ApolloProvider } from '@apollo/react-hooks'
import LinkList from './components/LinkList'
import theme from './theme'
import ApolloClient from 'apollo-client'

interface AppProps {
  client: ApolloClient<unknown>
  context?: BaseContext
}

const App: React.FunctionComponent<AppProps> = ({ client, context }: AppProps) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <LinkList />
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
