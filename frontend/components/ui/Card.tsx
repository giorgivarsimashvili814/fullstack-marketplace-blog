import { getCurrentUser } from "@/lib/actions";
import { Object } from "@/lib/types";
import CardHeader from "./CardHeader";
import CardMain from "./CardMain";
import CardFooter from "./CardFooter";

type Props = {
  object: Object;
};

export default async function Card({ object }: Props) {
  const currentUser = await getCurrentUser();

  return (
    <div className="w-full max-w-2xl border-2 rounded-lg p-4 flex flex-col gap-5 bg-white">
      <CardHeader object={object} />
      <CardMain object={object} />
      <CardFooter currentUser={currentUser} object={object} />
    </div>
  );
}
