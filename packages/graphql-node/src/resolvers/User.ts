import { UserResolvers } from '../generated/graphqlgen'

export const id: UserResolvers.IdResolver = ({ id }) => id
export const name: UserResolvers.NameResolver = ({ name }) => name
export const email: UserResolvers.EmailResolver = ({ email }) => email

export const links: UserResolvers.LinksResolver = (parent, _, context) =>
  context.prisma.user({ id: parent.id }).links()
