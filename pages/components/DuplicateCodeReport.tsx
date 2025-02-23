import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type DuplicateBlock = {
  code: string;
  lines: number[];
};

type DuplicateCodeProps = {
  duplicateCode: DuplicateBlock[] | null;
};

const DuplicateCodeReport: React.FC<DuplicateCodeProps> = ({ duplicateCode }) => {
  const hasDuplicates = duplicateCode && duplicateCode.length > 0;

  return (
    <div className={styles.reportContainer}>
      {hasDuplicates ? (
        <>
          <h2 className={styles.reportTitle}>Duplicate Code Report</h2>
          <div className={styles.lineBelowReportTitle} />
          <table className={styles.reportTable}>
            <thead>
              <tr className={styles.tableHeader}>
                <th className={styles.th}>Lines</th>
                <th className={styles.th}>Code Part</th>
              </tr>
            </thead>
            <tbody>
              {duplicateCode.map((block, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.td}>
                    <pre>{block.lines}</pre>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.codeContainer}>
                      {block.code.split('---').map((codeSnippet, snippetIndex) => (
                        <pre key={snippetIndex} className={styles.codeSnippet}><code>{codeSnippet}</code></pre>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
};

export default DuplicateCodeReport;
