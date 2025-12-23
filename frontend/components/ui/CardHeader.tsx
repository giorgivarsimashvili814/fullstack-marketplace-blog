import Profile from "./Profile";
import { Object } from "@/lib/types";
import { getCurrentUser } from "@/lib/actions";
import Options from "./Options";

type Props = {
  object: Object;
};

export default async function CardHeader({ object }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <div className="flex justify-between">
      <Profile author={object.author} />
      <Options object={object} currentUser={currentUser} />
    </div>
  );
}
