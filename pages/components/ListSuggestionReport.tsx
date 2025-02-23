import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type ListComprehensionSuggestionProps = {
    returnListSuggestion: ListComprehensionSuggestion[];
};

type ListComprehensionSuggestion = {
    line: number;
    message: string;
    original: string;
    refactored: string;
  };
  
const ListSuggestionReport: React.FC<ListComprehensionSuggestionProps> = ({ returnListSuggestion }) => {
  console.log(returnListSuggestion)
  const hasItems = returnListSuggestion.length > 0;
  return (
    <div className={styles.reportContainer}>
      {hasItems ? (
        <>
          <h2 className={styles.reportTitle}>Refactoring Suggestion</h2>
          <div className={styles.lineBelowReportTitle} />
          <table className={styles.reportTable}>
          <thead>
            <tr>
        
            </tr>
            </thead>
            <tbody>
            
            {returnListSuggestion.map((suggestion, index) => (
            <div key={index} className={styles.suggestionContainer}>
                <th className={styles.tableHeader}>Message</th>
                <p className={styles.suggestionLine}>Line: {suggestion.line}</p>
                <p className={styles.suggestionOriginal}>Original Code: {suggestion.original}</p>
                <p className={styles.suggestionMessage}>Suggestion: {suggestion.message}</p>
                <p className={styles.suggestionRefactored}>Refactored Code: {suggestion.refactored}</p>
            </div>
            ))}
            </tbody>
          </table>
        </>
      ) : null}
    </div>
  );
};

export default ListSuggestionReport;


