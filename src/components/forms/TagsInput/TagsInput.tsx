// src/components/TagsInput.js
import { useState } from "react";

interface Props {
  onKeyDown: any;
}

export const TagsInput = ({ onKeyDown }: Props) => {
  const [tags, setTags] = useState<string[]>([]);

  // Fix any
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | any) => {
    let { value } = e.target as HTMLInputElement;
    if (e.key === "Backspace" && value === "") {
      let reducedTags: string[] = tags.slice(0, -1);
      setTags(reducedTags);
      onKeyDown(tags);
    }
    if (e.key !== "Enter") return;
    if (!value.trim()) return;
    if (tags.includes(value)) return;
    if (tags.length > 3) return;

    setTags([...tags, value]);
    onKeyDown(tags);
    e.target.value = "";
  };

  const removeTag = (index: Number) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <div
          className="bg-light-blue dark:bg-container-dark w-[max-content] my-auto px-2 py-1 rounded-md"
          key={index}
        >
          <span className="text-[#3D3D3D]"># {tag}</span>
          <span
            className="cursor-pointer ml-2 text-xl"
            onClick={() => removeTag(index)}
          >
            &times;
          </span>
        </div>
      ))}
      <input
        id="tags"
        name="tags"
        type="text"
        className="flex-grow py-2 border-none outline-none"
        placeholder={tags.length > 0 ? "Add another..." : "Add up to 4 tags..."}
        onKeyDown={(e) => handleKeyDown(e)}
      />
    </div>
  );
};
