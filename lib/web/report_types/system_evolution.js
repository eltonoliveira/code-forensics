require('d3');
var _ = require('lodash');
var LineChartDiagramModel = require('../diagrams/line_chart/diagram_model.js'),
    MultibarChartDiagramModel = require('../diagrams/bar_chart/multibar_chart_model.js');

module.exports = function(manifest) {
  return {
    metadata: {
      title: 'System evolution analysis',
      description: 'Evolution in time of modules/parts of the architecture',
      diagramSelectionTitle: 'Report type',
      dateRange: manifest.parseDateRange()
    },
    graphModels: [
      {
        id: 'srt',
        label: 'Revisions',
        dataFile: _.find(manifest.dataFiles, { fileType: 'revisions-trend' }).fileUrl,
        diagram: {
          type: 'default',
          Model: LineChartDiagramModel,
          configuration: {
            style: {
              cssClass: 'line-chart-diagram',
              width: 960,
              height: 600,
              margin: { top: 20, right: 80, bottom: 40, left: 70 },
              tickFormat: { x: d3.time.format('%b %d') },
              colorScale: d3.scale.category10()
            },
            series: {
              x: { axisLabel: 'Time', scale: d3.time.scale(), valueProperty: 'date', valueCompareFn: function(date) { return date.getTime(); } },
              y: { axisLabel: 'Revisions', scale: d3.scale.linear(), valueProperty: 'revisions' },
            }
          },
          dataTransform: function(data) {
            return _.map(_.reduce(data, function(series, item) {
              series[item.name] = series[item.name] || [];
              series[item.name].push({ date: new Date(item.date), revisions: item.revisions });
              return series;
            }, {}), function(values, name) {
              return { name: name, values: _.sortBy(values, 'date') };
            });
          }
        }
      },
      {
        id: 'sct',
        label: 'Coupling',
        dataFile: _.find(manifest.dataFiles, { fileType: 'coupling-trend' }).fileUrl,
        diagram: {
          type: 'default',
          Model: MultibarChartDiagramModel,
          configuration: {
            style: {
              cssClass: 'bar-chart-diagram',
              width: 960,
              height: 600,
              margin: { top: 20, right: 60, bottom: 60, left: 50 },
              tickFormat: { x: d3.time.format('%b %d %Y') },
              colorScale: d3.scale.category10()
            },
            series: {
              x0: { axisLabel: 'Time', scale: d3.scale.ordinal(), valueProperty: 'date' },
              x1: { scale: d3.scale.ordinal(), valueProperty: 'name' },
              y: { axisLabel: 'Coupling %', scale: d3.scale.linear(), valueProperty: 'value' },
            }
          },
          dataTransform: function(data) {
            var sortedData = _.sortBy(data, function(d) { return d.date; });
            return _.map(_.reduce(sortedData, function(series, item) {
              var key = item.date;
              series[key] = series[key] || [];
              series[key].push({ name: item.name + " - " + item.coupledName, value: item.couplingDegree });
              return series;
            }, {}), function(values, key) {
              return { date: new Date(key), values: values };
            });
          }
        }
      }
    ]
  };
};