import NavbarItem from "./NavbarItem";

export default function Navbar() {
  const links = [
    { href: "/posts", text: "posts" },
    { href: "/products", text: "products" },
    { href: "/bookmarks", text: "bookmarks" },
  ];
  return (
    <nav className=" flex gap-5">
      {links.map((link) => (
        <NavbarItem key={link.href} href={link.href} text={link.text} />
      ))}
    </nav>
  );
}
