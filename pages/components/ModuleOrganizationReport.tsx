import React from 'react';
import styles from '../styles/ReportStyles.module.css'; 

type ModuleOrganizationIssue = {
  message: string; 
  split_points: string; 
};

type ModuleOrganizationProps = {
  moduleOrganizationIssue: ModuleOrganizationIssue[];
};

const ModuleOrganizationReport: React.FC<ModuleOrganizationProps> = ({ moduleOrganizationIssue }) => {
  return (
    <div className={styles.reportContainer}>
        {moduleOrganizationIssue.length > 0 && (
            <>
                <h2 className={styles.reportTitle}>Module Normalization Report</h2>
                <div className={styles.lineBelowReportTitle} />
                <table className={styles.reportTable}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th className={styles.tableCell}>Messages</th>
                            <th className={styles.tableCell}>Function Names</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moduleOrganizationIssue.map((item, index) => (
                            <tr key={index} className={styles.tableRow}>
                               <td className={styles.suggestionOriginal}>{item.message}</td>
                           <td className={styles.tableCell}>{item.split_points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>
        )}
    </div>
);
};

export default ModuleOrganizationReport;
