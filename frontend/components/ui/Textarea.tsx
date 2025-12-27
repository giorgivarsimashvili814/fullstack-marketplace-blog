type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string;
};

export default function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea className={`${className} w-full p-2 rounded-md border`} {...props}></textarea>
  );
}
