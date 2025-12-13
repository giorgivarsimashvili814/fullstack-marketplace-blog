import Link from "next/link";
interface Props {
  href: string;
  text: string;
}

export default function NavbarItem({ href, text }: Props) {
  return (
    <Link className="rounded-md px-4 py-2 bg-black text-white" href={href}>
      {text}
    </Link>
  );
}
