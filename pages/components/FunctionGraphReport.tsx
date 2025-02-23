import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type FunctionGraph = {
  caller: string;
  callee: string;
  call_count: number;
  is_recursive: boolean;
  caller_location: string;
  callee_location: string;
};

type FunctionGraphProps = {
  callFunctionGraph: FunctionGraph[];
};

const FunctionGraphReport: React.FC<FunctionGraphProps> = ({ callFunctionGraph }) => {
  return (
    <div className={styles.reportContainer}>
      {callFunctionGraph.length > 0 ? (
        <>
          <h2 className={styles.reportTitle}>Function Interaction Graph</h2>
          <div className={styles.lineBelowReportTitle} />
          {callFunctionGraph.map((relationship, index) => (
            <div key={index} className={styles.suggestionContainer}>
              <p><strong>Caller:</strong> {relationship.caller} <span className={styles.location}>at <strong>{relationship.caller_location}</strong> </span></p>
              <p><strong>Callee:</strong> {relationship.callee} <span className={styles.location}>at <strong>{relationship.callee_location}</strong></span></p>
              <p><strong>Call Count:</strong> {relationship.call_count}</p>
              {relationship.is_recursive && <p className={styles.recursive}>Recursive Call Detected</p>}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};
export default FunctionGraphReport;
