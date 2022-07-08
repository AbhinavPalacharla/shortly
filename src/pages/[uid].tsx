import redirect from "nextjs-redirect";
import { trpc } from "utils/trpc";
import { useRouter } from "next/router";

export default function UID() {
  const router = useRouter();

  const uid = router.query.uid as string;

  const { data, isLoading } = trpc.useQuery(["link.get", { uid: uid }]);

  if (!isLoading) {
    const Redirect = redirect(data!);
    return <Redirect />;
  }
}
