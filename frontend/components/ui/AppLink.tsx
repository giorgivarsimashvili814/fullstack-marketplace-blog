import Link from "next/link";

type LinkProps = React.ComponentProps<typeof Link> & {
  className?: string;
  variant?: "primary" | "destructive";
  children: React.ReactNode;
};

export default function AppLink({
  className,
  children,
  variant = "primary",
  ...props
}: LinkProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-400",
  };
  return (
    <Link
      className={`${className} ${variants[variant]} w-fit block rounded-md px-4 py-2 text-white h-10 font-bold`}
      {...props}
    >
      {children}
    </Link>
  );
}
