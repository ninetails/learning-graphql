import { Resolvers } from '../generated/graphqlgen'
import Mutation from './Mutation'
import Query from './Query'
import * as Link from './Link'
import * as User from './User'

const resolvers: Omit<Resolvers, 'AuthPayload'> = {
  Query,
  Mutation,
  Link,
  User
}

export default resolvers
