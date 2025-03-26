import React from "react";

const Remarks = ({ data, onChange }) => {
  const handleChange = (index, field, value) => {
    const updatedRemarks = [...data];
    updatedRemarks[index][field] = value;
    onChange(updatedRemarks);
  };

  const addRemark = () => {
    onChange([...data, { hour: "", location: "", reason: "" }]);
  };

  const removeRemark = (index) => {
    const updatedRemarks = [...data];
    updatedRemarks.splice(index, 1);
    onChange(updatedRemarks);
  };

  return (
    <div>
      <h2>Remarks</h2>
      {data.map((remark, index) => (
        <div key={index} className="remark-entry">
          <input
            type="number"
            placeholder="Hour"
            value={remark.hour}
            onChange={(e) => handleChange(index, "hour", e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={remark.location}
            onChange={(e) => handleChange(index, "location", e.target.value)}
          />
          <input
            type="text"
            placeholder="Reason"
            value={remark.reason}
            onChange={(e) => handleChange(index, "reason", e.target.value)}
          />
          <button onClick={() => removeRemark(index)}>Remove</button>
        </div>
      ))}
      <button onClick={addRemark}>Add Remark</button>
    </div>
  );
};

export default Remarks;
