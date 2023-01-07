require("dotenv").config();

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { graphqlHTTP } from "express-graphql";

import { login, register } from "./routes";
import { authenticateJWT } from "./security";
import { loaders } from "./dataloaders";
import { schema } from "./graphql/schema";

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cookieParser());

app.get("/register", register);
app.get("/login", login);

app.post(
  "/graphql",
  authenticateJWT,
  graphqlHTTP((_req, res) => {
    // @ts-expect-error
    // 'locals' does in fact exist on 'res' here
    const user_email = res?.locals?.user_email;
    return {
      schema: schema,
      graphiql: false,
      context: {
        loaders: loaders,
        user_email: user_email,
      },
    };
  })
);

app.get(
  "/graphql",
  authenticateJWT,
  graphqlHTTP({
    schema: schema,
    graphiql: true,
    context: {
      loaders: loaders,
    },
  })
);

app.listen(4000);
console.log("Running a GraphQL API server at http://localhost:4000/graphql ✨");
