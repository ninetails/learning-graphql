import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { APP_SECRET, getUserId } from '../utils'
import { MutationResolvers } from '../generated/graphqlgen'

const signup: MutationResolvers.SignupResolver = async (_, args, context, __) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({ ...args, password })

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

const login: MutationResolvers.LoginResolver = async (_, args, context, __) => {
  const user = await context.prisma.user({ email: args.email })
  if (typeof user !== 'object') {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid password')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

const post: MutationResolvers.PostResolver = (_, args, context) => {
  const userId = getUserId(context)

  return context.prisma.createLink({
    ...args,
    postedBy: { connect: { id: userId } }
  })
}

const updateLink: MutationResolvers.UpdateLinkResolver = (_, args, context) => {
  getUserId(context)
  const { id, url, description } = args
  const data = { url, description }
  const where = { id }
  return context.prisma.updateLink({ data, where })
}

const deleteLink: MutationResolvers.DeleteLinkResolver = (_, args, context) => {
  getUserId(context)

  return context.prisma.deleteLink(args)
}

const vote: MutationResolvers.VoteResolver = async (_, args, context, __) => {
  const userId = getUserId(context)

  const linkExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId }
  })

  if (typeof linkExists !== 'undefined') {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  })
}

const Mutation: MutationResolvers.Type = {
  post,
  updateLink,
  deleteLink,
  signup,
  login,
  vote
}

export default Mutation
