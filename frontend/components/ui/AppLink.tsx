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
    primary: "hover:bg-gray-200",
    destructive: "text-red-600 hover:bg-red-200",
  };
  return (
    <Link
      className={`${className} ${variants[variant]} block p-1.5 rounded-md transition-colors cursor-pointer font-bold bg-white`}
      {...props}
    >
      {children}
    </Link>
  );
}
