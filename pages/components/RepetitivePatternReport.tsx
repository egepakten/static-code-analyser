import React from 'react';
import styles from '../styles/ReportStyles.module.css'; 

type RepetitivePattern = {
    pattern: string;
    lines: string;
    code: string;
    additional_occurrences: Array<{
        line: number;
        snippet: string;
      }>;
  };
  
type RepetitivePatternProps = {
  repetitivePatterns: RepetitivePattern[];
};

const RepetitivePatternReport: React.FC<RepetitivePatternProps> = ({ repetitivePatterns }) => {
    console.log(repetitivePatterns)
    return (
    <div className={styles.reportContainer}>
      {repetitivePatterns.length > 0 && (
        <>
          <h2 className={styles.reportTitle}>Repetitive Pattern Report</h2>
          <div className={styles.lineBelowReportTitle} />
          <table className={styles.reportTable}>
            <thead>
            </thead>
            <tbody>
            {repetitivePatterns.map((pattern, index) => (
        <React.Fragment key={index} >
            <tr>
           
            </tr>
            {pattern.additional_occurrences.map((occurrence, idx) => (
            <div key={idx} className={styles.occurrence}>
                Line: {occurrence.line}
                <pre className={styles.occurrencePre}>{occurrence.snippet}</pre>
            </div>
            ))}
  </React.Fragment>
))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default RepetitivePatternReport;
