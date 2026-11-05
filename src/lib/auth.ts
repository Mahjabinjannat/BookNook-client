// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";
// import { jwt } from "better-auth/plugins";

// const client = new MongoClient(process.env.MONGODB_URI as string);
// const db = client.db("bookNook");

// export const auth = betterAuth({
//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: false,
//     minPasswordLength: 6,
//     requireEmailVerification: false,
//   },
//   database: mongodbAdapter(db, {
//     client,
//   }),
//   plugins: [jwt()],
//   session: {
//     cookieCache: {
//       enabled: true,
//       strategy: "jwt",
//       maxAge: 7 * 24 * 60 * 60,
//     },
//   },
// });

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(mongoUri);
const db = client.db("bookNook");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
      },
    }),
  ],

  session: {
    expiresIn: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,

    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
      strategy: "compact",
    },
  },
});
