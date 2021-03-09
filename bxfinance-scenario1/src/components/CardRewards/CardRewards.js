// Packages
import React from 'react';
import { Button, Card, CardBody, CardTitle, CardText, CardLink } from 'reactstrap';

// Styles
import "./CardRewards.scss";

// Data
import data from './data.json';

class CardRewards extends React.Component {
  render() {
    return (
      <div>
        <Card className="card-rewards">
          <CardBody>
            <CardTitle tag="h3">{data.title}</CardTitle>
            <CardText>{data.content}</CardText>
            <CardLink href={window._env_.PUBLIC_URL + "/credit-card"} target="_blank">{data.button}</CardLink>
          </CardBody>
          <img src={window._env_.PUBLIC_URL + "/images/home-hero-card.png"} className="img-credit-card" alt="card" />
        </Card>
      </div>
    );
  }
}

export default CardRewards;
