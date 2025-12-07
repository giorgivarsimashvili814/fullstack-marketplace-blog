import Link from "next/link";
import React from "react";

interface Item {
  children: React.ReactNode;
  href: string;
  className: string;
}

export default function Item({ children, href, className }: Item) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
