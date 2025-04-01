import React, { useState, useEffect } from "react";
import { format, parseISO, addHours, startOfDay, endOfDay } from 'date-fns';
import "./css/Logsheet.css";

const LogInputForm = ({ logs, setLogs, nextStep }) => {
  const [formData, setFormData] = useState({
    startTime: "",
    endTime: "",
    dutyStatus: "",
    location: "",
    remarks: ""
  });

  
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    
    if (logs.length === 0) {
      setFormData(prev => ({
        ...prev,
        startTime: format(today, "yyyy-MM-dd'T'HH:mm")
      }));
    } else {
      
      const lastEntry = logs[logs.length - 1];
      setFormData(prev => ({
        ...prev,
        startTime: lastEntry.endTime
      }));
    }
  }, [logs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    const startTime = parseISO(formData.startTime);
    const endTime = parseISO(formData.endTime);
    
    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    
    if (formData.dutyStatus !== "Driving") {
      if (!formData.location || !formData.remarks) {
        alert("Location and Remarks are required for non-driving statuses");
        return;
      }
    }

    
    const endOfCurrentDay = endOfDay(startTime);
    if (endTime > endOfCurrentDay) {
      alert("Entries must be within the same day");
      return;
    }

    
    const newEntry = { ...formData };
    setLogs([...logs, newEntry]);

    
    setFormData(prev => ({
      startTime: newEntry.endTime,
      endTime: "",
      dutyStatus: "",
      location: formData.dutyStatus === "Driving" ? "" : prev.location,
      remarks: formData.dutyStatus === "Driving" ? "" : prev.remarks
    }));
  };

  const dutyStatuses = [
    "Off Duty",
    "Sleeper Berth", 
    "Driving", 
    "On Duty (Not Driving)"
  ];

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Driver's Daily Log</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Start Time:</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            readOnly
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">End Time:</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            min={formData.startTime}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-2">Duty Status:</label>
          <select 
            name="dutyStatus" 
            value={formData.dutyStatus} 
            onChange={handleChange} 
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Status</option>
            {dutyStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        {formData.dutyStatus !== "Driving" && (
          <>
            <div>
              <label className="block mb-2">Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="Enter location"
              />
            </div>

            <div>
              <label className="block mb-2">Remarks:</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
                placeholder="Enter remarks"
              />
            </div>
          </>
        )}

        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Entry
          </button>
          
        </div>
      </form>
    </div>
  );
};

export default LogInputForm;