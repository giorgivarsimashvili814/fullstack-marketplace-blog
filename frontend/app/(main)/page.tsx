import { getCurrentUser } from "@/lib/actions";

export default async function Main() {
  const user = await getCurrentUser();

  return (
    <>
      {user ? (
        <div>welcome back {user.username}!</div>
      ) : (
        <div>hello world!</div>
      )}
    </>
  );
}
