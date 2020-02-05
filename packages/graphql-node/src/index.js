const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]

let idCount = links.length
const resolvers = {
  Query: {
    feed: () => links,
    link: (parent, args) => links.find(({ id }) => id === args.id)
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }

      links.push(link)

      return link
    },
    updateLink: (parent, args) => {
      const link = links.find(({ id }) => id === args.id)

      if (!link) {
        return null
      }

      link.url = args.url
      link.description = args.description

      return link
    },
    deleteLink: (parent, args) => {
      const link = links.find(({ id }) => id === args.id)

      if (!link) {
        return null
      }

      return links.splice(links.indexOf(link), 1).pop()
    }
  }
  // Link: {
  //   id: (parent) => parent.id,
  //   description: (parent) => parent.description,
  //   url: (parent) => parent.url
  // }
  
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => console.log('Server is running on http://localhost:4000'))
