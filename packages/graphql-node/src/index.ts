import { GraphQLServer } from 'graphql-yoga'
import { IResolvers } from 'graphql-tools'
import { prisma } from './generated/prisma-client'
import { Resolvers } from './generated/graphqlgen'

const resolvers: Omit<Resolvers, 'Link'> = {
  Query: {
    feed: (_, __, context, ___) => context.prisma.links(),
    link: (_, args, context, ___) => context.prisma.link(args),
  },
  Mutation: {
    post: (_, args, context) => context.prisma.createLink(args),
    updateLink: (_, args, context) => context.prisma.updateLink(args),
    deleteLink: (_, args, context) => context.prisma.deleteLink(args)
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: resolvers as IResolvers,
  context: { prisma }
})

server.start(() => console.log('Server is running on http://localhost:4000'))
