import { selectUser } from "../sql/select";

export default async function viewerResolver(
  _source: any,
  _args: {},
  context: {
    user_email?: string;
  }
) {
  const userEmail = context?.user_email;
  if (!userEmail) {
    throw new Error("Missing required context value 'user_email'");
  }

  const user = selectUser(userEmail);
  if (!user) {
    return null;
  }

  return user;
}
