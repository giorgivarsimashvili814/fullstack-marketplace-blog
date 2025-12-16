import AppLink from "../ui/AppLink";

export default function Navbar() {
  const links = [
    { href: "/posts", text: "posts" },
    // { href: "/products", text: "products" },
    // { href: "/bookmarks", text: "bookmarks" },
  ];
  return (
    <nav className="flex gap-5">
      {links.map((link) => (
        <AppLink key={link.href} href={link.href}>
          {link.text}
        </AppLink>
      ))}
    </nav>
  );
}
