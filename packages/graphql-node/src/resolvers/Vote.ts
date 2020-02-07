import { VoteResolvers } from '../generated/graphqlgen'

export const id: VoteResolvers.IdResolver = ({ id }) => id

export const link: VoteResolvers.LinkResolver = (parent, _, context) =>
  context.prisma.vote({ id: parent.id }).link()

export const user: VoteResolvers.UserResolver = (parent, _, context) =>
  context.prisma.vote({ id: parent.id }).user()
