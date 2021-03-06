import React, { Component } from 'react';
import { Button, Card, Icon, Segment } from 'semantic-ui-react';


class Reports extends Component {
  add_report(event) {
    event.preventDefault();
    const self = this;
    fetch(`http://localhost:8080/reports/new`, {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(
      () => self.props.reload()
    );
  }

  delete_report(event, report) {
    event.preventDefault();
    const self = this;
    fetch(`http://localhost:8080/report/${report.report_uuid}`, {
      method: 'delete',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    }).then(
      () => self.props.reload()
    );
  }

  render() {
    return (
      <>
        <Card.Group>
          {this.props.reports.map((report) =>
            <Card fluid header={report["title"]} key={report.report_uuid}
              extra={
                <>
                  <Button icon onClick={(e) => this.props.open_report(e, report)}>
                    <Icon name='folder open' /> Open report
                  </Button>
                  <Button icon negative basic floated='right' onClick={(e) => this.delete_report(e, report)}>
                    <Icon name='trash' /> Delete report
                  </Button>
                </>
              }
            />)
          }
        </Card.Group>
        <Segment basic>
          <Button icon primary basic onClick={(e) => this.add_report(e)}>
            <Icon name='plus' /> Add report
          </Button>
        </Segment>
      </>
    )
  }
}

export { Reports };
