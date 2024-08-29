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
    <div
      className="column-selector position-absolute top-100 mt-2 right-0 bg-light shadow border border-1"
      style={{
        maxHeight: 300,
        width: 200,
        overflowY: "scroll",
        zIndex: 1000,
        padding: "5px 15px",
      }}
    >
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
