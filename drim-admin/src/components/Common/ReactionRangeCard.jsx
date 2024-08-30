import React from 'react';
import { Card, CardBody, CardTitle, CardText, Badge } from 'reactstrap';

const ReactionRangeCard = ({ 
  title, 
  percentage, 
  badgeColor, 
  badgeText, 
  description 
}) => {
  return (
    <Card className="h-100">
      <CardBody>
        <CardTitle tag="h1" className="mb-3">
          {title}
        </CardTitle>
        <CardText>
          {description}
        </CardText>
        <CardTitle
          tag="h1"
          style={{ display: 'inline', marginRight: '10px' }}
        >
          {percentage}
        </CardTitle>
        <Badge color={badgeColor} style={{ display: 'inline' }}>
          {badgeText}
        </Badge>
        <CardText>
          {description}
        </CardText>
      </CardBody>
    </Card>
  );
};

export default ReactionRangeCard;
