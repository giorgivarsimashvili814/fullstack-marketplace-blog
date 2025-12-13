type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: "primary" | "destructive";
};

export default function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-black text-white hover:bg-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-400",
  };

  return (
    <button
      className={`${className} ${variants[variant]} px-4 py-2 rounded-md transition-colors cursor-pointer font-bold`}
      {...props}
    />
  );
}
