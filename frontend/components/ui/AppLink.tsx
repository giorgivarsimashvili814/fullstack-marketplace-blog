import Link from "next/link";

type LinkProps = React.ComponentProps<typeof Link> & {
  className?: string;
  children: React.ReactNode;
};

export default function AppLink({ className, children, ...props }: LinkProps) {
  return (
    <Link
      className={`${className} w-fit block rounded-md px-4 py-2 bg-black text-white h-10`}
      {...props}
    >
      {children}
    </Link>
  );
}
