import { QueryResolvers } from '../generated/graphqlgen'

const Query: QueryResolvers.Type = {
  feed: (_, __, context, ___) => context.prisma.links(),
  link: (_, args, context, ___) => context.prisma.link(args)
}

export default Query
