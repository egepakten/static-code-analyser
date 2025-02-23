// In ClassCohesionReport.tsx
import React from 'react';
import styles from '../styles/ReportStyles.module.css';


// Inside your types.ts file or at the top of your React component file
type CohesionMetrics = {
    // Define the structure of your cohesion metrics here
    // For example, if it's a simple key-value pair:
    attribute_ratio: number;
    interaction_ratio: number;
  };
  
type ClassCohesion = {
    className: string;
    cohesionMetrics: CohesionMetrics; // Assuming cohesion metrics is an array of metric objects
    overallCohesion: number;
    recommendation: string;
  };

type ClassCohesionProps = {
    classCohesionIssue: ClassCohesion[];
};
  

const ClassCohesionReport: React.FC<ClassCohesionProps> = ({ classCohesionIssue }) => {
    
    return (
          <div className={styles.reportContainer}>
            {classCohesionIssue.length > 0 && (
              <div>
                <h2 className={styles.reportTitle}>Class Cohesion Report</h2>
                
                <table className={styles.reportTable}>
                  <thead>
                  <div className={styles.lineBelowReportTitle} />
                  </thead>
                  <tbody>
                    { classCohesionIssue.map((issue, index) => (
            <div key={index} className={styles.suggestionContainer}>
   
              <h3>{issue.className}</h3>
              <p>Overall Cohesion: {issue.overallCohesion.toFixed(2)}</p>
              <div>
                <h4>Cohesion Metrics:</h4>
                <ul>
                  <li>Attribute Ratio: {issue.cohesionMetrics.attribute_ratio}</li>
                  <li>Interaction Ratio: {issue.cohesionMetrics.interaction_ratio}</li>
                </ul>
              </div>
              <p>{issue.recommendation}</p>
            </div>
          ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
  };
  
  export default ClassCohesionReport;

  // const RedundantExceptBlockReport: React.FC<RedundantExceptBlockProps> = ({ redundantExceptBlockIssue }) => {
  //   return (
  //     <div className={styles.reportContainer}>
  //       {redundantExceptBlockIssue.length > 0 && (
  //         <div>
  //           <h2 className={styles.reportTitle}>Redundant Except Block Report</h2>
            
  //           <table className={styles.reportTable}>
  //             <thead>
  //             <div className={styles.lineBelowReportTitle} />
  //             </thead>
  //             <tbody>
  //               {redundantExceptBlockIssue.map(( issue, index) => (
  //                 <li key={index} className={styles.suggestionContainer}>
  //                 Line {issue.line}: {issue.message}
  //               </li>
  //               ))}
  //             </tbody>
  //           </table>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };
  
  // export default RedundantExceptBlockReport;
  