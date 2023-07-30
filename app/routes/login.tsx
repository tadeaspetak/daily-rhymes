import type {
  ActionArgs,
  DataFunctionArgs,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useEffect, useRef } from "react";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";

import { FormInput, HiddenInput } from "~/components/forms/FormInput";
import { SubmitButton } from "~/components/forms/SubmitButton";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils";

export const validator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email("Must be a valid email."),
    password: z.string(),
    redirectTo: z.string().optional(),
  }),
);

// redirect to `/` if the user is already logged in
export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: DataFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    const { password, passwordConfirm, ...data } = result.submittedData;
    return validationError(result.error, data);
  }

  const { email, password, redirectTo } = result.data;

  const user = await verifyLogin(email, password);
  if (!user) {
    return validationError(
      { fieldErrors: { email: "Invalid credentials." } },
      { email },
    );
  }

  return createUserSession({
    redirectTo: safeRedirect(redirectTo),
    remember: true,
    // remember: parsed.data.remember === "on" ? true : false,
    request,
    userId: user.id.toString(),
  });
};

export const meta: V2_MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/poems";

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Log in
          </h1>
          <ValidatedForm
            className="space-y-6"
            validator={validator}
            method="post"
          >
            <FormInput name="email" label="Email" type="email" />
            <FormInput name="password" label="Password" type="password" />
            <HiddenInput name="redirectTo" type="hidden" value={redirectTo} />
            <SubmitButton label="Log in" />
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
}
