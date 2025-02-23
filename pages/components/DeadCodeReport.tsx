import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type UnusedCodeVariable = {
  name: string;
  line: number;
};

type UnusedVariable = {
  variable: string;
  line: number;
  message: string;
};

type DeadCode = {
  unused_functions?: UnusedCodeVariable[];
  unused_classes?: UnusedCodeVariable[];
  unused_variables?: UnusedVariable[];
};

type DeadCodeReportProps = {
  deadCode: DeadCode[]; 
};

const DeadCodeReport: React.FC<DeadCodeReportProps> = ({ deadCode }) => {
  return (
    <div className={styles.reportContainer}>
      {deadCode && deadCode.length > 0 ? (
        deadCode.map((codeReport, reportIndex) => (
          <React.Fragment key={reportIndex}>
            <h2 className={styles.reportTitle}>Dead Code Report</h2>
            <div className={styles.lineBelowReportTitle} />
            {codeReport.unused_functions && codeReport.unused_functions.length > 0 && (
              <>
                <h3 className={styles.subTitle}>Unused Functions</h3>
                {codeReport.unused_functions.map((func, funcIndex) => (
                  <div key={funcIndex} className={styles.listItem}>
                    <td className={styles.tableCell}>Line : {func.line}</td>
                    <td className={styles.tableCell}>{func.name}</td>
                  </div>
                ))}
              </>
            )}
            {codeReport.unused_classes && codeReport.unused_classes.length > 0 && (
              <>
                <h3 className={styles.subTitle}>Unused Classes</h3>
                {codeReport.unused_classes.map((cls, clsIndex) => (
                  <div key={clsIndex} className={styles.listItem}>
                    <td className={styles.tableCell}>Line : {cls.line}</td>
                    <td className={styles.tableCell}>{cls.name}</td>
                  </div>
                ))}
              </>
            )}
            {codeReport.unused_variables && codeReport.unused_variables.length > 0 && (
              <>
               <h3 className={styles.subTitle}>Unused Variables</h3>
                {codeReport.unused_variables.map((cls, clsIndex) => (
                  <div key={clsIndex} className={styles.listItem}>
                    <td className={styles.tableCell}>Line : {cls.line}</td>
                    <td className={styles.tableCell}>{cls.variable}</td>
                  </div>
                ))}
              </>
            )}
          </React.Fragment>
        ))
      ) : null}
    </div>
  );
};

export default DeadCodeReport;
