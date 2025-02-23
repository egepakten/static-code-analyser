import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type ReturnTypeConsistency = {
  line: number;
  message: string;
};

type ReturnTypeConsistencyProps = {
  returnTypeReport: ReturnTypeConsistency[];
};

const ReturnTypeConsistencyReport: React.FC<ReturnTypeConsistencyProps> = ({ returnTypeReport }) => {
  const hasItems = returnTypeReport.length > 0;

  return (
    <div className={styles.reportContainer}>
      {hasItems ? (
        <>
          <h2 className={styles.reportTitle}>Return Type Consistency Report</h2>
          <div className={styles.lineBelowReportTitle} />
          <table className={styles.reportTable}>
            <thead>
        
              <tr className={styles.tableHeader}>
              <th className={styles.tableCell}>Line Numbers</th>
                <th className={styles.tableCell}>Message</th>
              </tr>
            </thead>
            <tbody>
              {returnTypeReport.map((item, index) => (
                <tr key={index}>
                  <td className={styles.tableCell}>{item.line}</td>
                  <td className={styles.tableCell}>{item.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
};

export default ReturnTypeConsistencyReport;


