import { NavbarItem } from "@/types";
import Link from "next/link";

export default function Item({ children, href, className }: NavbarItem) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
