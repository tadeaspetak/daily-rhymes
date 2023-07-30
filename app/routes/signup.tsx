import { ActionArgs, DataFunctionArgs, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";

import { FormInput } from "~/components/forms/FormInput";
import { SubmitButton } from "~/components/forms/SubmitButton";

export const validator = withZod(
  z
    .object({
      name: z.string().min(1, { message: "Name is required." }),
      email: z
        .string()
        .min(1, { message: "Email is required." })
        .email("Must be a valid email."),
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
      passwordConfirm: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
    })
    .superRefine(({ password, passwordConfirm }, ctx) => {
      if (password !== passwordConfirm) {
        ctx.addIssue({
          code: "custom",
          path: ["passwordConfirm"],
          message: "Passwords do not match.",
        });
      }
    }),
);

export const action = async ({ request }: DataFunctionArgs) => {
  const result = await validator.validate(await request.formData());

  if (result.error) {
    const { password, passwordConfirm, ...data } = result.submittedData;
    return validationError(result.error, data);
  }

  // TODO: check if user already exists
  // const user = await createUser(email, password);

  // return createUserSession({
  //   redirectTo,
  //   remember: false,
  //   request,
  //   userId: user.id,
  // });

  return redirect("/");
};

export default function SignUp() {
  const data = useActionData();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a
        href="#"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        🪶 Střípky poezie
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Vytvoř si svůj poetický účet.
          </h1>
          <ValidatedForm
            className="space-y-6"
            validator={validator}
            method="post"
          >
            <FormInput name="name" label="Jméno" />
            <FormInput name="email" label="Email" type="email" />
            <FormInput name="password" label="Heslo" type="password" />
            <FormInput
              name="passwordConfirm"
              label="Heslo (pro jistotu)"
              type="password"
            />
            <SubmitButton label="Vytvoř mi účet" />
          </ValidatedForm>
        </div>
      </div>
    </div>
  );
}
