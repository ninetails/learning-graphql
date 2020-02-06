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

  return context.prisma.updateLink(args)
}

const deleteLink: MutationResolvers.DeleteLinkResolver = (_, args, context) => {
  getUserId(context)

  return context.prisma.deleteLink(args)
}

const Mutation: MutationResolvers.Type = {
  post,
  updateLink,
  deleteLink,
  signup,
  login
}

export default Mutation
