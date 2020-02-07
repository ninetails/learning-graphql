import { Resolvers } from '../generated/graphqlgen'
import Mutation from './Mutation'
import Query from './Query'
import * as Subscription from './Subscription'
import * as Link from './Link'
import * as User from './User'
import * as Vote from './Vote'

const resolvers: Omit<Resolvers, 'AuthPayload'|'Feed'> = {
  Query,
  Mutation,
  Subscription,
  Link,
  User,
  Vote
}

export default resolvers
