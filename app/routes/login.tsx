import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

// This type infer errors from a ZodType, as produced by `flatten()` of a parsed schema.
type inferSafeParseErrors<T extends z.ZodType<any, any, any>, U = string> = {
  formErrors?: U[];
  fieldErrors?: {
    [P in keyof z.infer<T>]?: U[];
  };
};

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === "string") {
      return { message: "Too short." };
    }
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

const loginValues = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  redirectTo: z.string(),
  remember: z.enum(["on"]).optional(),
});

type LoginValues = z.infer<typeof loginValues>;
type LoginErrors = inferSafeParseErrors<typeof loginValues>;

type ActionData = {
  values: LoginValues;
  errors?: LoginErrors;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

// redirect to `/` if the user is already logged in
export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionArgs) => {
  const values = Object.fromEntries(await request.formData()) as LoginValues;
  const parsed = loginValues.safeParse(values);

  if (!parsed.success) {
    return badRequest({ values, errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;

  const user = await verifyLogin(email, password);
  if (!user) {
    return badRequest({
      values,
      errors: { fieldErrors: { email: ["Invald username or password.", "something fishy"] } },
    });
  }

  return createUserSession({
    redirectTo: safeRedirect(parsed.data.redirectTo),
    remember: parsed.data.remember === "on" ? true : false,
    request,
    userId: user.id.toString(),
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
  const actionData = useActionData<typeof action>();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  console.log(actionData);

  useEffect(() => {
    if (actionData?.errors?.fieldErrors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.fieldErrors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  const emailErrors = actionData?.errors?.fieldErrors?.email;
  const passwordErrors = actionData?.errors?.fieldErrors?.password;

  return (
    <div className="flex flex-col justify-center min-h-full">
      <div className="w-full max-w-md px-8 mx-auto">
        <Form method="post" className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1">
              <input
                ref={emailRef}
                id="email"
                required
                autoFocus={true}
                name="email"
                type="email"
                autoComplete="email"
                aria-invalid={emailErrors ? true : undefined}
                aria-describedby="email-error"
                className="w-full px-2 py-1 text-lg border border-gray-500 rounded"
              />
              {emailErrors ? (
                <div className="pt-1 text-red-700" id="email-error">
                  {emailErrors.map((v, i) => (
                    <p key={i}>{v}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                ref={passwordRef}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={passwordErrors ? true : undefined}
                aria-describedby="password-error"
                className="w-full px-2 py-1 text-lg border border-gray-500 rounded"
              />
              {passwordErrors ? (
                <div className="pt-1 text-red-700" id="password-error">
                  {passwordErrors.map((v, i) => (
                    <p key={i}>{v}</p>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:bg-blue-400"
          >
            Log in
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="block ml-2 text-sm text-gray-900">
                Remember me
              </label>
            </div>
            <div className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <Link
                className="text-blue-500 underline"
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}