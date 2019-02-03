import React, { Component } from 'react';
import { Table } from 'semantic-ui-react';
import { SourceType } from './SourceType';
import { SourceParameters } from './SourceParameters';


class Source extends Component {
    constructor(props) {
        super(props);
        this.state = { edited_source_type: props.source_type };
    }
    post_source_type(source_type) {
        this.setState({ edited_source_type: source_type });
        fetch(`http://localhost:8080/report/subject/${this.props.subject_uuid}/metric/${this.props.metric_uuid}/source/${this.props.source_uuid}/type`, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type: source_type })
        });
    }
    reset_source_type() {
        this.setState({ edited_source_type: this.props.source_type });
    }
    render() {
        const props = this.props;
        return (
            <Table.Row>
                <Table.Cell>
                    <SourceType
                        source_type={this.state.edited_source_type}
                        metric_type={props.metric_type} datamodel={props.datamodel}
                        post_source_type={(s) => this.post_source_type(s)}
                        reset_source_type={() => this.reset_source_type()} />
                </Table.Cell>
                <Table.Cell>
                    <SourceParameters subject_uuid={props.subject_uuid} metric_uuid={props.metric_uuid}
                        source_uuid={props.source_uuid} metric_type={props.metric_type}
                        source_type={this.state.edited_source_type}
                        source={props.source} datamodel={props.datamodel} />
                </Table.Cell>
            </Table.Row>
        )
    }
}

function Sources(props) {
    const source_uuids = Object.keys(props.sources).filter((source_uuid) =>
        props.datamodel.metrics[props.metric_type].sources.includes(props.sources[source_uuid].type)
    );
    const sources = source_uuids.map((source_uuid) =>
        (
            <Source key={source_uuid} source_uuid={source_uuid} subject_uuid={props.subject_uuid}
                metric_uuid={props.metric_uuid} source={props.sources[source_uuid]}
                source_type={props.sources[source_uuid].type}
                metric_type={props.metric_type} datamodel={props.datamodel} />
        )
    );
    return (
        <Table columns={2} size='small'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={1}>Source</Table.HeaderCell>
                    <Table.HeaderCell width={10}>Parameters</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>{sources}</Table.Body>
        </Table>
    )
}

export { Sources };