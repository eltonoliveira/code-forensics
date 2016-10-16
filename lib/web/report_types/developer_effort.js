var TreemapDiagramModel = require('../diagrams/treemap/diagram_model.js');

module.exports = function(manifest) {
  var diagramConfig = {
    type: 'treemap',
    Model: TreemapDiagramModel,
    configuration: {
      style: {
        cssClass: 'treemap-diagram',
        width: 960,
        height: 700,
        margin: { top: 24, right: 0, bottom: 0, left: 0 },
      },
      series: { valueProperty: 'revisions' }
    }
  };

  return {
    metadata: {
      title: 'Developer effort analysis',
      description: 'sharing of effort (revisions) between programmers/teams',
      diagramSelectionTitle: 'Effort distribution',
      dateRange: manifest.parseDateRange()
    },
    graphModels: [
      {
        id: 'dev-effort',
        label: 'By developer',
        dataFile: _.find(manifest.dataFiles, { fileType: 'individual-effort' }).fileUrl,
        diagram: diagramConfig
      },
      {
        id: 'team-effort',
        label: 'By team',
        dataFile: _.find(manifest.dataFiles, { fileType: 'team-effort' }).fileUrl,
        diagram: diagramConfig
      }
    ]
  };
};