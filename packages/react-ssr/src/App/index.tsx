import * as React from 'react'
import { ThemeProvider } from 'emotion-theming'
import { ApolloProvider } from '@apollo/react-hooks'
import LinkList from './components/LinkList'
import theme from './theme'
import ApolloClient from 'apollo-client'

interface AppProps {
  client: ApolloClient<{}>
  context?: Object
}

const App: React.FunctionComponent<AppProps> = ({ client, context }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <LinkList />
      </ApolloProvider>
    </ThemeProvider>
  )
}

export default App
