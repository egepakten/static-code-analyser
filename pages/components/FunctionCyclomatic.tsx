import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type FunctionCyclomatic = {
  line: number;
  code: string;
  complexity: number;
  message: string;
};

type FunctionCyclomaticProps = {
  functionComplexityIssues: FunctionCyclomatic[];
};

const FunctionCyclomaticReport: React.FC<FunctionCyclomaticProps> = ({ functionComplexityIssues }) => {
  return (
    <div className={styles.reportContainer}>
      {functionComplexityIssues.length > 0 ? (
        <>
          <h2 className={styles.reportTitle}>Cyclomatic Complexity Report</h2>
          {functionComplexityIssues.map((issue, index) => (
            <div key={index} className={styles.suggestionContainer}>
              <p><strong>Line:</strong> {issue.line}</p>
              <pre className={styles.codeBlock}><code>{issue.code}</code></pre>
              <p><strong>Complexity Score is Higher than : </strong> {issue.complexity}</p>
              <p><strong>Message:</strong> {issue.message}</p>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default FunctionCyclomaticReport;
