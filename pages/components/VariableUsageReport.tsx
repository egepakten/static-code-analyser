import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type VariableUsage = {
  variable: string;
  function: string;
  line: number;
  message: string;
};

type VariableUsageProps = {
  variableUsageIssue: VariableUsage[];
};

const VariableUsageReport: React.FC<VariableUsageProps> = ({ variableUsageIssue }) => {
  return (
    <div className={styles.reportContainer}>
      {variableUsageIssue.length > 0 ? (
        <>
          <h2 className={styles.reportTitle}>Variable Usage Report</h2>
          {variableUsageIssue.map((issue, index) => (
            <div key={index} className={styles.suggestionContainer}>
               <div className={styles.suggestionLine}>Line {issue.line}:</div>
              
              <div className={styles.suggestionOriginal}>{issue.message}</div>
              <pre className={styles.codeBlock}>
              <p><strong>Function:</strong> {issue.function}</p>
              <p><strong>Variable:</strong> {issue.variable}</p>

              </pre>
             
            
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default VariableUsageReport;
