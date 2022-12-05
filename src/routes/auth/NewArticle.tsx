import { getDownloadURL, ref } from "firebase/storage";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { ArticleLayout } from "../../components/ArticleLayout";
import { useUserContext } from "../../components/auth/UserContext";
import { Button } from "../../components/common/Button";
import { ButtonVariant } from "../../components/common/Button/Button";
import { TagsInput } from "../../components/forms/TagsInput";
import { TextArea } from "../../components/forms/TextArea";
import { ImageUploader } from "../../components/ImageUploader";
import { MainContainer } from "../../components/Main/MainContainer";
import { PostForm } from "../../components/types";
import { database } from "../../service/firebase/FirebaseRealtimDB";
import { storage } from "../../service/firebase/FirebaseStorage";
import { Paths } from "../routes";

export const NewArticle = () => {
  const navigate = useNavigate();
  const user = useUserContext();

  const getFileUrl = async (file: File) => {
    const storageRef = await ref(storage, `/files/${file.name}`);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSubmit = async (values: PostForm) => {
    if (user) {
      const url = await getFileUrl(values.file);
      database
        .publishPost({ ...values, file: url, author: user.uid })
        .then(() => {
          navigate(Paths.HOME);
        });
    }
  };
  function onKeyDown(keyEvent: any) {
    // Fix any
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  }

  return (
    <ArticleLayout>
      <div />
      <div>
        <h1 className="mb-4">Create Post</h1>
        <MainContainer>
          <Formik
            initialValues={
              {
                file: {},
                title: "",
                tags: {},
                content: "",
              } as PostForm
            }
            validate={undefined}
            onSubmit={(values) => handleSubmit(values as PostForm)}
          >
            {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
              <form onKeyDown={onKeyDown} className="flex flex-col">
                <ImageUploader />
                <input
                  className="my-8 text-4xl font-black opacity-100 focus-within:outline-none"
                  id="title"
                  name="title"
                  type="text"
                  placeholder="New post title here..."
                  onChange={(e) => setFieldValue("title", e.target.value)}
                />
                <TagsInput
                  onKeyDown={(tags: any) => setFieldValue("tags", tags)}
                />
                <TextArea
                  id="content"
                  name="content"
                  rows={8}
                  placeholder="Write your post content here..."
                  onChange={(id: string, value: string) => {
                    setFieldValue(id, value);
                  }}
                />
                <div className="max-w-[150px]">
                  <Button
                    onClick={() => handleSubmit(values as any)}
                    variant={ButtonVariant.OUTLINED}
                    disabled={isSubmitting}
                    submit
                    text="Publish"
                  />
                </div>
              </form>
            )}
          </Formik>
        </MainContainer>
      </div>
      <div />
    </ArticleLayout>
  );
};
