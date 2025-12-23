type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  className?: string;
};

export default function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={`${className} py-1`}
      {...props}
    />
  );
}
