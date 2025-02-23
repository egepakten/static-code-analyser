import React from 'react';
import styles from '../styles/ReportStyles.module.css';

type ArgumentNormalizationProps = {
    returnArgumentNormalization: ArgumentNormalization[];
};

type ArgumentNormalization = {
    argument: string;
    functions: string[];
    lines:number;
};

const ArgumentNormalizationReport: React.FC<ArgumentNormalizationProps> = ({ returnArgumentNormalization }) => {
    return (
        <div className={styles.reportContainer}>
            {returnArgumentNormalization.length > 0 && (
                <>
                    <h2 className={styles.reportTitle}>Argument Normalization Report</h2>
                    <div className={styles.lineBelowReportTitle} />
                    <table className={styles.reportTable}>
                        <thead>
                            <tr className={styles.tableHeader}>
                                <th className={styles.tableCell}>Line Numbers</th>
                                <th className={styles.tableCell}>Argument</th>
                                <th className={styles.tableCell}>Functions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnArgumentNormalization.map((item, index) => (
                                <tr key={index} className={styles.tableRow}>
                                    <td className={styles.tableCell}>{item.lines}</td>
                                    <td className={styles.tableCell}>{item.argument}</td>
                                    <td className={styles.tableCell}>
                                        {item.functions}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default ArgumentNormalizationReport;
