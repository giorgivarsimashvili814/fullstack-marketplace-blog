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
    primary: "bg-white hover:bg-gray-200",
    dark: "bg-black hover:bg-gray-700 text-white",
    destructive: "text-red-600 hover:bg-red-200",
  };

  return (
    <button
      className={`p-1.5 rounded-md transition-colors cursor-pointer font-bold ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
