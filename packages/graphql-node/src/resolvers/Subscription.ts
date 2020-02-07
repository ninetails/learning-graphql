import { SubscriptionResolvers } from '../generated/graphqlgen'

export const newLink: SubscriptionResolvers.NewLinkResolver = {
  subscribe: (_, __, context, ___) =>
    context.prisma.$subscribe.link({ mutation_in: ['CREATED'] }).node(),
  resolve: payload => payload ?? null
}

export const newVote: SubscriptionResolvers.NewVoteResolver = {
  subscribe: (_, __, context, ___) =>
    context.prisma.$subscribe.vote({ mutation_in: ['CREATED'] }).node(),
  resolve: payload => payload ?? null
}
