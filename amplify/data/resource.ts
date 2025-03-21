import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*
 * This schema defines the Property model for the Real Estate Rental Assistant
 * which allows users to post and find properties for rent.
 */
const schema = a.schema({
  Property: a
    .model({
      title: a.string(),
      description: a.string(),
      price: a.string(),
      location: a.string(),
      image: a.string(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});