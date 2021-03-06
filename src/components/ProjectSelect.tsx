import React, { FunctionComponent } from "react";
import { MenuItem, Select } from "@material-ui/core";
import { useProjectState } from "../contexts";
import { useHistory } from "react-router-dom";

const ProjectSelect: FunctionComponent<{
  selectedId: string | undefined;
}> = ({ selectedId }) => {
  const history = useHistory();
  const projectState = useProjectState();

  const handleProjectSelect = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newSelectedProject = projectState.projectList.find(
      (p) => p.id === (event.target.value as string)
    );
    if (newSelectedProject) {
      history.push(newSelectedProject.id);
    }
  };

  return (
    <React.Fragment>
      {projectState.projectList.length > 0 && (
        <Select
          id="project-select"
          value={selectedId}
          onChange={handleProjectSelect}
        >
          {projectState.projectList.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      )}
    </React.Fragment>
  );
};

export default ProjectSelect;
