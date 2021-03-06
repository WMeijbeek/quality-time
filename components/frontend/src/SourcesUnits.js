import React, { Component } from 'react';
import { Button, Icon, Menu, Label, Tab, Table, Popup } from 'semantic-ui-react';

function Unit(props) {
  if (props.hide_ignored_units && props.ignored) { return null };
  const style = props.ignored ? { textDecoration: "line-through" } : {};
  const icon = props.ignored ? 'toggle off' : 'toggle on';
  const help = props.ignored ? 'Stop ignoring' : 'Start ignoring';
  return (
    <Table.Row key={props.unit.key} style={style}>
      {props.unit_attributes.map((unit_attribute, col_index) =>
        <Table.Cell key={col_index}>
          {props.unit[unit_attribute.url] ?
            <a href={props.unit[unit_attribute.url]}>{props.unit[unit_attribute.key]}</a> :
            props.unit[unit_attribute.key]}
        </Table.Cell>)
      }
      <Table.Cell collapsing>
        <Popup trigger={
          <Button floated='right' icon primary size='small' basic
            onClick={(e) => props.ignore_unit(e, props.source_uuid, props.unit.key)}>
            <Icon name={icon} />
          </Button>} content={help} />
      </Table.Cell>
    </Table.Row>
  )
}

class SourceUnits extends Component {
  constructor(props) {
    super(props);
    this.state = { hide_ignored_units: false };
  }

  hide_ignored_units(event) {
    event.preventDefault();
    this.setState({ hide_ignored_units: !this.state.hide_ignored_units })
  }

  render() {
    if (!Array.isArray(this.props.source.units) || this.props.source.units.length === 0) {
      return null;
    }
    const report_source = this.props.metric["sources"][this.props.source.source_uuid];
    const source_type = report_source["type"];
    const unit_attributes = this.props.datamodel.sources[source_type].units[this.props.metric.type];
    const ignored_units = this.props.source.ignored_units || [];
    const headers =
      <Table.Row>
        {unit_attributes.map((unit_attribute) => <Table.HeaderCell key={unit_attribute.key}>{unit_attribute.name}</Table.HeaderCell>)}
        <Table.HeaderCell collapsing>
          <Popup trigger={
            <Button floated='right' icon primary size='small' basic
              onClick={(e) => this.hide_ignored_units(e)}>
              <Icon name={this.state.hide_ignored_units ? 'unhide' : 'hide'} />
            </Button>} content={this.state.hide_ignored_units ? 'Show ignored items' : 'Hide ignored items'} />
        </Table.HeaderCell>
      </Table.Row>
    const rows = this.props.source.units.map((unit) =>
      <Unit key={unit.key} unit={unit} unit_attributes={unit_attributes} source_uuid={this.props.source.source_uuid}
        hide_ignored_units={this.state.hide_ignored_units} ignored={ignored_units.includes(unit.key)}
        ignore_unit={this.props.ignore_unit} />);
    return (
      <Table size='small'>
        <Table.Header>
          {headers}
        </Table.Header>
        <Table.Body>
          {rows}
        </Table.Body>
      </Table>
    )
  }
}

function SourcesUnits(props) {
  if (props.measurement == null) { return null };
  let panes = [];
  props.measurement.sources.forEach((source) => {
    const report_source = props.metric["sources"][source.source_uuid];
    const source_type = report_source.type;
    const source_name = report_source.name || props.datamodel["sources"][source_type]["name"];
    let nr_units = source.value || 0;
    const nr_units_displayed = (source.units && source.units.length) || 0;
    if (Number(nr_units) !== Number(nr_units_displayed)) { nr_units = `${nr_units_displayed} of ${nr_units}` };
    panes.push({
      menuItem: (<Menu.Item key={source.source_uuid}>{source_name}<Label>{nr_units}</Label></Menu.Item>),
      render: () => <Tab.Pane>
        <SourceUnits source={source} datamodel={props.datamodel} metric={props.metric}
          ignore_unit={props.ignore_unit} report_uuid={props.report_uuid} metric_uuid={props.metric_uuid} />
      </Tab.Pane>
    })
  });
  return (
    <Tab panes={panes} />
  )
}

export { SourcesUnits };
