import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type DocstringIssue = {
    message: string;
  };
  
type DocstringReportProps = {
    docstringIssues: DocstringIssue[];
  };
  

const DocstringReport: React.FC<DocstringReportProps> = ({ docstringIssues }) => {
    return (
        <div className={styles.reportContainer}>
            {docstringIssues.length > 0 && (
                <>
                    <h2 className={styles.reportTitle}>Docstring Issue Report</h2>
                    <div className={styles.lineBelowReportTitle} />
                    <table className={styles.reportTable}>
                        <thead>
                            <tr className={styles.tableHeader}>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {docstringIssues.map((issue, index) => (
                                <tr key={index} className={styles.tableRow}>
                                    <td className={styles.tableCell}>{issue.message}</td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
  };
  export default DocstringReport;