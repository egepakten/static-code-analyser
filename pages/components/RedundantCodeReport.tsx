import React from 'react';
import styles from '../styles/ReportStyles.module.css'; // Ensure the path matches your styling file

// Define props types for clarity
 type RedundantCodeIssue = {
    line: number;
    message: string;
  };

   type RedundantCodeIssueProps = {
    redundantCodeIssue: RedundantCodeIssue[];
  };

const RedundantCodeReport: React.FC<RedundantCodeIssueProps> = ({ redundantCodeIssue }) => {
    // console.log(redundantCodeIssue)
    return (
        <div className={styles.reportContainer}>
            {redundantCodeIssue.length > 0 && (
                <>
                    <h2 className={styles.reportTitle}>Redundant Code Report</h2>
                    <div className={styles.lineBelowReportTitle} />
                    <table className={styles.reportTable}>
                        <thead>
                            <tr className={styles.tableHeader}>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {redundantCodeIssue.map((issue, index) => (
                                <tr key={index} className={styles.tableRow}>
                                    <p className={styles.suggestionLine}>Line: {issue.line}</p>
                                    <p className={styles.suggestionOriginal}>{issue.message}</p>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default RedundantCodeReport;
