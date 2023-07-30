import { LoaderArgs, json } from "@remix-run/node";
import {
  Form,
  Link,
  Outlet,
  V2_MetaFunction,
  useLoaderData,
} from "@remix-run/react";

import { getUserPoems } from "~/models/user.server";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
  const poems = await getUserPoems(userId);
  return json({ poems });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const user = useUser();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      {data.poems.map((poem) => {
        return (
          <div key={poem.id}>
            {poem.title}
            {poem.body?.toString()}
          </div>
        );
      })}
      <div>Home is {user.email}</div>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="px-4 py-2 text-blue-100 rounded bg-slate-600 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>

      <Link to="sub">take me to the sub</Link>
      <Outlet />

      <div>where the heart is </div>
    </div>
  );
}
