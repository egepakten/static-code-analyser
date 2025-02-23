import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type Suggestion = {
  line: number;
  original: string;
  refactored: string;
  message: string;
};

type CodeHealthIssue = {
  
  health_score: number;
  suggestions: Suggestion[];
};

type CodeHealthReportProps = {
  codeHealthIssues: CodeHealthIssue[];
};

const CodeHealthReport: React.FC<CodeHealthReportProps> = ({ codeHealthIssues }) => {
  return (
    <div className={styles.reportContainer}>
      {codeHealthIssues.length > 0 ? (
        <>
          <h2 className={styles.reportTitle}>Code Health Report</h2>
          <div className={styles.lineBelowReportTitle}></div>
          {codeHealthIssues.map((issue, index) => (
            <div key={index} className={styles.suggestionContainer}>
             
              <div className={styles.noIssueMessage}>Current Code Health Score: {issue.health_score ?? 'Not calculated'}</div>
              {issue.suggestions.map((suggestion, sIndex) => (
                <div key={sIndex}>
                  <div className={styles.suggestionLine}>Line {suggestion.line}:</div>
                  <div className={styles.suggestionOriginal}>
                    <pre>{suggestion.original ?? 'Original code not available'}</pre>
                  </div>
                  <div className={styles.suggestionRefactored}>
                    <pre>Consider refactoring to: {suggestion.refactored ?? 'Refactored code not available'}</pre>
                  </div>
                  <div className={styles.suggestionMessage}>
                    <pre>{suggestion.message}</pre>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default CodeHealthReport;
