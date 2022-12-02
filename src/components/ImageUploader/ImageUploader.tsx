import { ref, uploadBytes } from "firebase/storage";
import { useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { storage } from "../../service/firebase/FirebaseStorage";

export const ImageUploader = () => {
  const form = useFormikContext();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("" as any);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const file = e.target.files[0];
    const storageRef = ref(storage, `/files/${file.name}`);
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploading file!");
    });
    form.setFieldValue("file", e.target.files[0]);
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="flex">
      {selectedFile && (
        <img src={preview} alt={preview} className="max-h-28 block" />
      )}
      <input
        className="my-auto ml-12"
        type="file"
        accept="image/*"
        onChange={onSelectFile}
      />
    </div>
  );
};
