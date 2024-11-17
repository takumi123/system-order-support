import { auth } from "@/app/auth";
import { WireframeViewer } from "./_components/wireframe-viewer";

export default async function WireframesPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const projectId = await params.id;

  if (!session) {
    return null;
  }

  return (
    <div className="h-full p-4 space-y-2">
      <WireframeViewer projectId={projectId} />
    </div>
  );
}
