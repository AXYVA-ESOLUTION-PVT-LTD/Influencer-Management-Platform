import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

const ColumnSelector = ({ columns, filterHeader, setFilterHeader }) => {
  const handleCheckboxChange = (accessor) => {
    setFilterHeader((prev) => ({
      ...prev,
      [accessor]: !prev[accessor],
    }));
  };

  return (
    <div>
      {columns.map((column) => (
        <FormGroup check key={column.accessor}>
          <Label check className="fs-6">
            <Input
              type="checkbox"
              checked={filterHeader[column.accessor] || false}
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
