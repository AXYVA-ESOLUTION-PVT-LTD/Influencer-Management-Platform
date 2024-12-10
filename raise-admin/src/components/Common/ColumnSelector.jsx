import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

const ColumnSelector = ({ columns, filterHeader, setFilterHeader }) => {
  const handleCheckboxChange = (columnName) => {
    setFilterHeader((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  return (
    <div>
      {columns.map((column) => (
        <FormGroup check key={column.accessor}>
          <Label check className="fs-6">
            <Input
              type="checkbox"
              style={{ fontSize: 20 }}
              checked={filterHeader[column.accessor] || false}
              disable={true}
              onChange={() => handleCheckboxChange(column.accessor)}
            />
            {column.Header}
          </Label>
        </FormGroup>
      ))}
    </div>
  );
};

export default ColumnSelector;
