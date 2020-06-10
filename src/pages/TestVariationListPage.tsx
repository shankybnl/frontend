import React from "react";
import TestVariationList from "../components/TestVariationList";
import { useParams } from "react-router-dom";
import { TestVariation } from "../types";
import { testVariationService } from "../services";
import { Container, Box, Grid, Typography } from "@material-ui/core";
import ProjectSelect from "../components/ProjectSelect";
import { TestVariationFilters } from "../components/TestVariationFilters";

const TestVariationListPage: React.FunctionComponent = () => {
  const { projectId } = useParams();
  const [testVariations, setTestVariations] = React.useState<TestVariation[]>(
    []
  );

  // filter
  const [query, setQuery] = React.useState("");
  const [os, setOs] = React.useState("");
  const [device, setDevice] = React.useState("");
  const [browser, setBrowser] = React.useState("");
  const [viewport, setViewport] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState<TestVariation[]>([]);

  React.useEffect(() => {
    if (projectId) {
      testVariationService.getList(projectId).then((testVariations) => {
        setTestVariations(testVariations);
      });
    }
  }, [projectId]);

  React.useEffect(() => {
    setFilteredItems(
      testVariations.filter(
        (t) =>
          t.name.includes(query) && // by query
          (os ? t.os === os : true) && // by OS
          (device ? t.device === device : true) && // by device
          (viewport ? t.viewport === viewport : true) && // by viewport
          (browser ? t.browser === browser : true) // by browser
      )
    );
  }, [query, os, device, browser, viewport, testVariations]);

  return (
    <React.Fragment>
      <Container>
        <Box mt={2}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <Typography display="inline">Project: </Typography>
              <ProjectSelect selectedId={projectId} />
            </Grid>
            <Grid item>
              <Box m={2}>
                <TestVariationFilters
                  items={testVariations}
                  queryState={[query, setQuery]}
                  osState={[os, setOs]}
                  deviceState={[device, setDevice]}
                  browserState={[browser, setBrowser]}
                  viewportState={[viewport, setViewport]}
                />
              </Box>
            </Grid>
            <Grid item>
              <TestVariationList items={filteredItems} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default TestVariationListPage;
