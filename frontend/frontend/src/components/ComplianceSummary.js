import React, { useEffect, useState } from "react";

const ComplianceSummary = ({ data, hourlyLogs = [], onChange }) => {
  const [complianceData, setComplianceData] = useState(data);

  useEffect(() => {
    if (!hourlyLogs || hourlyLogs.length === 0) {
      setComplianceData({});
      return;
    }

    const calculateCompliance = () => {
      const totalDriving = hourlyLogs.reduce((acc, log) => acc + (Number(log.driving) || 0), 0);
      const totalOnDuty = hourlyLogs.reduce((acc, log) => acc + (Number(log.onDuty) || 0), 0);
      const totalOffDuty = hourlyLogs.reduce((acc, log) => acc + (Number(log.offDuty) || 0), 0);
      const totalSleeper = hourlyLogs.reduce((acc, log) => acc + (Number(log.sleeperBerth) || 0), 0);

      const newComplianceData = {
        totalDrivingHours: totalDriving,
        totalOnDutyHours: totalOnDuty,
        totalOffDutyHours: totalOffDuty,
        totalSleeperHours: totalSleeper,
        drivingLimitExceeded: totalDriving > 11,
        onDutyLimitExceeded: totalOnDuty > 14,
      };

      setComplianceData(newComplianceData);
      onChange(newComplianceData);
    };

    calculateCompliance();
  }, [hourlyLogs, onChange]);

  return (
    <div>
      <h2>Compliance Summary</h2>
      {complianceData.totalDrivingHours !== undefined ? (
        <>
          <p>
            Total Driving Hours: {complianceData.totalDrivingHours}{" "}
            {complianceData.drivingLimitExceeded && "⚠ Over Limit!"}
          </p>
          <p>
            Total On Duty Hours: {complianceData.totalOnDutyHours}{" "}
            {complianceData.onDutyLimitExceeded && "⚠ Over Limit!"}
          </p>
          <p>Total Off Duty Hours: {complianceData.totalOffDutyHours}</p>
          <p>Total Sleeper Berth Hours: {complianceData.totalSleeperHours}</p>
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default ComplianceSummary;
