import React, { useState } from "react";

const LogInputForm = ({ logs, setLogs, nextStep }) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    dutyStatus: "",
    location: "",
    remarks: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.startTime && formData.endTime && formData.dutyStatus) {
      setLogs([...logs, formData]);
      setFormData({ startTime: "", endTime: "", dutyStatus: "", location: "", remarks: "" });
    }
  };

  return (
    <div>
      <h2>Driver's Daily Log</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Start Time:
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          End Time:
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Duty Status:
          <select name="dutyStatus" value={formData.dutyStatus} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Off Duty">Off Duty</option>
            <option value="Sleeper Berth">Sleeper Berth</option>
            <option value="Driving">Driving</option>
            <option value="On Duty">On Duty (Not Driving)</option>
          </select>
        </label>

        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </label>

        <label>
          Remarks:
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Add Entry</button>
      </form>
      <button onClick={nextStep} disabled={logs.length === 0}>Next</button>
    </div>
  );
};

export default LogInputForm;
