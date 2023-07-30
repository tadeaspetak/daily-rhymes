import { Link, V2_MetaFunction, useLoaderData } from "@remix-run/react";
import graphqlClient from "~/gql/client";
import { SweetnessDocument, SweetnessQueryResult } from "~/loaders/home.sub";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async () => {
  const res = await graphqlClient.query({ query: SweetnessDocument });
  return res;
};

export default function Index() {
  const queryResults = useLoaderData<SweetnessQueryResult>();
  const data = queryResults.data?.hello;

  if (queryResults.loading) {
    return "loading...";
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      Subroute right here, data `{data}`<Link to="..">Back</Link>
    </div>
  );
}
