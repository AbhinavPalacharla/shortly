import { FC, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useFormik } from "formik";
import { IsHttpIndicator } from "components/HttpsIndicator";
import { CgSpinner } from "react-icons/cg";
import * as Toast from "@radix-ui/react-toast";

export const IndexPage: FC = () => {
  const [isHttp, setIsHttp] = useState<boolean>(false);
  const [codes, setCodes] = useState<Array<string | null | undefined>>([""]);
  const [savedCount, setSavedCount] = useState(0);

  const mutation = trpc.useMutation("link.create");

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: async (values) => {
      setSavedCount((count) => count + 1);
      console.log("values", values);
      const { url } = values;
      mutation.mutate(
        { url },
        {
          onSuccess: (data) => {
            if (data) setCodes((codes) => [...codes, data]);
          },
        }
      );
    },
  });

  return (
    <div>
      <div className="rounded-xl bg-black/5 px-24 py-16 flex flex-col">
        <IsHttpIndicator isHttp={isHttp} />
        <div>
          <form
            className="flex flex-row justify-center"
            onSubmit={formik.handleSubmit}
          >
            <input
              type="url"
              name="url"
              id="url"
              value={formik.values.url}
              placeholder="https://www.palacharla.com"
              onChange={formik.handleChange}
              onBlur={(e) => {
                e.currentTarget.value.includes("https")
                  ? setIsHttp(true)
                  : setIsHttp(false);
              }}
              className="rounded-md border-1 border-gray-400 mr-4 px-3 w-60"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-1.5 rounded-md font-medium"
            >
              {mutation.isLoading ? (
                <div className="flex flex-row gap-x-3">
                  <CgSpinner className="animate-spin p-0.5 text-[26px]" />
                  <p>Submitting...</p>
                </div>
              ) : (
                <p>Submit</p>
              )}
            </button>
          </form>
        </div>
      </div>
      {codes && (
        <div>
          {Array.from({ length: savedCount }).map((_, index) => (
            <Toast.Root duration={5000}>
              <Toast.Title>{codes[index]}</Toast.Title>
            </Toast.Root>
          ))}
          <Toast.Viewport />
        </div>
      )}
    </div>
  );
};
