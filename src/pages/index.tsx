import { trpc } from "../utils/trpc";

export default function IndexPage() {
  const hello = trpc.useQuery(["hello", { text: "abhinav" }]);
  if (!hello.data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <p className="text-green-300 font-bold underline">
        {hello.data.greeting}
      </p>
    </div>
  );
}
