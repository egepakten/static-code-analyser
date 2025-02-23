// React component
import React from 'react';
import styles from '../styles/ReportStyles.module.css'; // Ensure the path matches your styling file

type RedundantExceptBlock = {
  line: number;
  message: string;
  code: string;
};

type RedundantExceptBlockProps = {
  redundantExceptBlockIssue: RedundantExceptBlock[];
};

const RedundantExceptBlockReport: React.FC<RedundantExceptBlockProps> = ({ redundantExceptBlockIssue }) => {
  return (
    <div className={styles.reportContainer}>
      {redundantExceptBlockIssue.length > 0 && (
        <div>
          <h2 className={styles.reportTitle}>Redundant Except Block Report</h2>
          <ul className={styles.reportList}>
            {redundantExceptBlockIssue.map((issue, index) => (
              <li key={index} className={styles.suggestionContainer}>
                <div className={styles.suggestionLine}>Line {issue.line}:</div>
                <pre className={styles.codeBlock}>{issue.code}</pre>
                <div className={styles.suggestionOriginal}>{issue.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RedundantExceptBlockReport;
