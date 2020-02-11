import { LinkResolvers } from '../generated/graphqlgen'

export const id: LinkResolvers.IdResolver = ({ id }) => id
export const description: LinkResolvers.DescriptionResolver = ({ description }) => description
export const url: LinkResolvers.UrlResolver = ({ url }) => url
export const createdAt: LinkResolvers.CreatedAtResolver = ({ createdAt }) => createdAt

export const postedBy: LinkResolvers.PostedByResolver = (parent, _, context) =>
  context.prisma.link({ id: parent.id }).postedBy()

export const votes: LinkResolvers.VotesResolver = (parent, _, context) =>
  context.prisma.link({ id: parent.id }).votes()
