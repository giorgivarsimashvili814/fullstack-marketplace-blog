type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export default function Input({ className, ...props }: InputProps) {
  return <input className={`${className} w-full rounded-md border-2 px-2 py-1`} {...props} />;
}
