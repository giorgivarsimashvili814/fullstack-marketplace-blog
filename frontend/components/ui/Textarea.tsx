type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea className={`${className} p-2 rounded-md border-2`} {...props}></textarea>
  );
}
