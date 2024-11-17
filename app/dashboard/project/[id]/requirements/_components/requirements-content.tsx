"use client";

import { DiagramViewer } from "./diagram-viewer";
import RequirementsGenerator from "./requirements-generator";

interface RequirementsContentProps {
  projectId: string;
}

const RequirementsContent: React.FC<RequirementsContentProps> = ({ projectId }) => {
  return (
    <div className="space-y-4">
      <RequirementsGenerator projectId={projectId} />
      <DiagramViewer />
    </div>
  );
};

export default RequirementsContent;
