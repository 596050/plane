import { useState } from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// services
import projectService from "services/project.service";
// layouts
import { ProjectAuthorizationWrapper } from "layouts/auth-layout";
// contexts
import { IssueViewContextProvider } from "contexts/issue-view.context";
// helper
import { truncateText } from "helpers/string.helper";
// components
import { IssuesFilterView, IssuesView } from "components/core";
import { AnalyticsProjectModal } from "components/analytics";
// ui
import { PrimaryButton, SecondaryButton } from "components/ui";
import { BreadcrumbItem, Breadcrumbs } from "components/breadcrumbs";
// icons
import { PlusIcon } from "@heroicons/react/24/outline";
// types
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS } from "constants/fetch-keys";

const ProjectIssues: NextPage = () => {
  const [analyticsModal, setAnalyticsModal] = useState(false);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { data: projectDetails } = useSWR(
    workspaceSlug && projectId ? PROJECT_DETAILS(projectId as string) : null,
    workspaceSlug && projectId
      ? () => projectService.getProject(workspaceSlug as string, projectId as string)
      : null
  );

  return (
    <IssueViewContextProvider>
      <ProjectAuthorizationWrapper
        breadcrumbs={
          <Breadcrumbs>
            <BreadcrumbItem title="Projects" link={`/${workspaceSlug}/projects`} />
            <BreadcrumbItem
              title={`${truncateText(projectDetails?.name ?? "Project", 12)} Issues`}
            />
          </Breadcrumbs>
        }
        right={
          <div className="flex items-center gap-2">
            <IssuesFilterView />
            <SecondaryButton
              onClick={() => setAnalyticsModal(true)}
              className="!py-1.5 rounded-md font-normal text-brand-secondary"
              outline
            >
              Analytics
            </SecondaryButton>
            <PrimaryButton
              className="flex items-center gap-2"
              onClick={() => {
                const e = new KeyboardEvent("keydown", { key: "c" });
                document.dispatchEvent(e);
              }}
            >
              <PlusIcon className="h-4 w-4" />
              Add Issue
            </PrimaryButton>
          </div>
        }
      >
        <AnalyticsProjectModal isOpen={analyticsModal} onClose={() => setAnalyticsModal(false)} />
        <IssuesView />
      </ProjectAuthorizationWrapper>
    </IssueViewContextProvider>
  );
};

export default ProjectIssues;