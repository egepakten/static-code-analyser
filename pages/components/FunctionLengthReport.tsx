import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type FunctionDetail = {
  functionName: string;
  length: number;
};

type DocString = {
  message: string;
  length: number; // Added length to DocStringDetail
};

type FunctionLengthDocString = {
  function_length: FunctionDetail[];
  docstring_issues: DocString[];
};

type FunctionLengthDocStringProps = {
  return_lengths: FunctionLengthDocString[];
};

const FunctionLengthReport: React.FC<FunctionLengthDocStringProps> = ({ return_lengths }) => {
  return (
    <div className={styles.reportContainer}>
      {return_lengths.map((report, index) => (
        <div key={index}>
          {/* Header moved inside the map, so it's rendered with each report */}
          <h2 className={styles.reportTitle}>Function Length and Docstring Issues Report</h2>
          <div className={styles.lineBelowReportTitle} />
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th className={styles.th}>Function Name</th>
                <th className={styles.th}>Length (lines)</th>
                <th className={styles.th}>Docstring Length</th>
                <th className={styles.th}>Docstring Issues</th>
              </tr>
            </thead>
            <tbody>
              {report.function_length.map((funcDetail, funcIndex) => {
                const docIssue = report.docstring_issues.find((issue) =>
                  issue.message.includes(`Function '${funcDetail.functionName}'`));
                return (
                  <tr key={`function-${funcIndex}`}>
                    <td className={styles.td}>{funcDetail.functionName}</td>
                    <td className={styles.td}>{funcDetail.length}</td>
                    <td className={styles.td}>
                      {docIssue ? docIssue.length : 'N/A'} {/* Display DocString length */}
                    </td>
                    <td className={styles.td}>
                      {docIssue ? docIssue.message : 'No DocString issues'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default FunctionLengthReport;

