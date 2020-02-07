import { QueryResolvers } from '../generated/graphqlgen'

const Query: QueryResolvers.Type = {
  feed: async (_, args, context, ___) => {
    const where = typeof args.filter === 'string' && args.filter.length > 0
      ? {
        OR: [
          { description_contains: args.filter },
          { url_contains: args.filter }
        ]
      }
      : {}

    const links = await context.prisma.links({
      where,
      skip: args.skip,
      first: args.first,
      orderBy: args.orderBy
    })

    const count = await context.prisma
      .linksConnection({
        where,
      })
      .aggregate()
      .count()

    return {
      links,
      count
    }
  },
  link: (_, args, context, ___) => context.prisma.link(args)
}

export default Query
