interface Props {
  id: string;
  name: string;
  rows: number;
  placeholder: string;
  onChange: any;
}

export const TextArea = ({ id, name, rows, placeholder, onChange }: Props) => {
  // Fix any
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement> | any) => {
    const keyCode = e.keyCode;
    if (keyCode === 13) {
      e.target.value = e.target.value + "\r\n";
    }
  };

  return (
    <textarea
      className="my-4 text-lg font-medium whitespace-pre-wrap focus-within:outline-none"
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      onKeyDown={(e) => handleKeyDown(e)}
      onChange={(e) => {
        onChange(id, e.target.value);
      }}
    />
  );
};
