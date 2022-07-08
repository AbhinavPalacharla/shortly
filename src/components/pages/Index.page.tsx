import { FC, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useFormik } from "formik";
import { IsHttpIndicator } from "components/HttpsIndicator.component";
import { CgSpinner } from "react-icons/cg";
import { MdContentCopy } from "react-icons/md";
import * as Toast from "@radix-ui/react-toast";

export const IndexPage: FC = () => {
  const [isHttp, setIsHttp] = useState<boolean>(false);
  const [codes, setCodes] = useState<Array<string>>([]);
  const [savedCount, setSavedCount] = useState(0);

  const mutation = trpc.useMutation("link.create");

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    onSubmit: async (values) => {
      setSavedCount((count) => count + 1);
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
              className="rounded-md mr-4 px-3 w-60 outline-none ring-1 ring-black/5"
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
      <div className="fixed bottom-0 left-0 mb-8 ml-8">
        {codes && (
          <div>
            {Array.from({ length: savedCount }).map((_, index) => (
              <Toast.Root duration={5000} key={index}>
                <div className="flex flex-row shadow-md shadow-gray-500/10 ring-1 ring-black/5 rounded-lg py-2 mb-4 items-center">
                  <div className="bg-green-300 h-2 w-2 rounded-full shadow-md shadow-green-400/50 ml-3 mr-3" />
                  <Toast.Description className="mr-3">
                    Link shortened @ https://shortly-zeta.vercel.app/
                    {codes[index]}
                  </Toast.Description>
                  <button
                    className="bg-white shadow-sm shadow-gray-500/10 hover:shadow-gray-500/20 hover:bg-gray-50 ring-1 ring-black/10 flex flex-row px-2 py-1 rounded-md items-center mr-3 transition duration-200 ease-in-out"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `https://shortly-zeta.vercel.app/${codes[index]}`
                      );
                    }}
                  >
                    <MdContentCopy className="text-gray-600" />
                    <p className="text-gray-600 ml-2 text-sm font-normal">
                      Copy
                    </p>
                  </button>
                </div>
              </Toast.Root>
            ))}
            <Toast.Viewport />
          </div>
        )}
      </div>
    </div>
  );
};
