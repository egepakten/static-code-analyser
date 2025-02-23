////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Author : Kerem Ege Pakten
// Student ID : 20057057
// Date : 23 March 2024
// This React File manages the UI for uploading Django folders and displaying the results of static code analysis
// It handles multiple aspects of user interaction, including file uploads, and displaying messages
// about the current state of the upload and analysis
// This component is designed to facilitate easy uploading of files and
// help developers by suggesting potential improvements through a user-friendly interface
////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./styles/HomePageStyles.module.css";
import reportStyles from "./styles/ReportStyles.module.css";

import FunctionLengthReport from "./components/FunctionLengthReport";
import DuplicateCodeReport from "./components/DuplicateCodeReport";
import DeadCodeReport from "./components/DeadCodeReport";
import ReturnTypeConsistencyReport from "./components/ReturnTypeConsistencyReport";
import ArgumentNormalizationReport from "./components/ArgumentNormalizationReport";
import RepetitivePatternReport from "./components/RepetitivePatternReport";
import CodeHealthReport from "./components/CodeHealthReport";
import ClassCohesionReport from "./components/ClassCohesionReport";
import RedundantExceptBlockIssueReport from "./components/RedundantExceptBlockIssueReport";
import ModuleOrganizationReport from "./components/ModuleOrganizationReport";
import VariableUsageReport from "./components/VariableUsageReport";
import FunctionGraphReport from "./components/FunctionGraphReport";
import FunctionCyclomaticReport from "./components/FunctionCyclomatic";

import {
  FunctionLengthDocString,
  DuplicateBlock,
  ReturnTypeConsistency,
  DeadCode,
  ArgumentNormalization,
  RepetitivePattern,
  CodeHealthIssue,
  ClassCohesion,
  RedundantExceptBlock,
  ModuleOrganization,
  VariableUsage,
  FunctionGraph,
  FunctionCyclomatic,
  LoadingBarProps,
  Progresses,
} from "./types/types";

const index: React.FC = () => {
  // State hook to store the list and details of Function Length DocString Feature
  const [lengthReport, setFunctionLengthDocStringReport] = useState<
    FunctionLengthDocString[]
  >([]);
  const [hasLengthIssue, setHasLengthIssue] = useState(false);
  // State hook to store the list and details of Duplicate Block Feature
  const [duplicateCode, setDuplicateCode] = useState<DuplicateBlock[]>([]);
  const [hasDuplicateCodeIssue, setHasDuplicateCodeIssue] = useState(false);
  // State hook to store the list and details of Return Type Consistency Feature
  const [returnTypeConsistencyReport, setReturnTypeConsistencyReport] =
    useState<ReturnTypeConsistency[]>([]);
  const [hasReturnTypeConsistencyIssue, setReturnTypeConsistencyIssue] =
    useState(false);
  // State hook to store the list and details of Dead Code Feature
  const [deadCode, setDeadCode] = useState<DeadCode[]>([]);
  const [hasDeadCodeIssue, setHasDeadCodeIssue] = useState(false);
  // State hook to store the list and details of Argument Normalization Feature
  const [argumentNormalization, setArgumentNormalizationReport] = useState<
    ArgumentNormalization[]
  >([]);
  const [hasArgumentNormalizationIssue, setArgumentNormalizationIssue] =
    useState(false);
  // State hook to store the list and details of Repetitive Pattern Feature
  const [repetitivePatternsReport, setRepetitivePatterns] = useState<
    RepetitivePattern[]
  >([]);
  const [hasRepetitivePatternsIssue, setRepetitivePatternsIssue] =
    useState(false);
  // State hook to store the list and details of Code Health Issue Feature
  const [codeHealthReport, setCodeHealthIssues] = useState<CodeHealthIssue[]>(
    []
  );
  // State hook to store the list and details of Class CohesionFeature
  const [classCohesionReport, setClassCohesionReportIssue] = useState<
    ClassCohesion[]
  >([]);
  const [hasClassCohesiontIssue, setClassCohesionIssue] = useState(false);
  // State hook to store the list and details of Redundant Except Block Feature
  const [redundantExceptBlockReport, setRedundantExceptBlock] = useState<
    RedundantExceptBlock[]
  >([]);
  const [hasRedundantExceptBlockIssue, setRedundantExceptBlockIssue] =
    useState(false);
  // State hook to store the list and details of Module Organization Feature
  const [moduleOrganizationReport, setModuleOrganization] = useState<
    ModuleOrganization[]
  >([]);
  const [hasModuleOrganizationIssue, setModuleOrganizationIssue] =
    useState(false);
  // State hook to store the list and details of Variable Usage Feature
  const [variableUsageReport, setVariableUsage] = useState<VariableUsage[]>([]);
  const [hasVariableUsageIssue, setVariableUsageIssue] = useState(false);
  // State hook to store the list and details of Function Graph Feature
  const [functionGraphReport, setFunctionGraph] = useState<FunctionGraph[]>([]);
  const [hasFunctionGraphIssue, setFunctionGrapIssue] = useState(false);
  // State hook to store the list and details of Function Cyclomatic Feature
  const [functionCyclomaticReport, setFunctionCyclomatic] = useState<
    FunctionCyclomatic[]
  >([]);
  const [hasFunctionCyclomaticIssue, setFunctionCyclomaticIssue] =
    useState(false);
  // State hook to store the list and details of Analysis Complete for displaying report
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  // Stores feedback for the user about the current operation or status
  const [message, setMessage] = useState<string>("Loading...");
  // Keeps track of files that have been uploaded through the interface
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentReportFileName, setCurrentReportFileName] = useState("");

  // const reportSectionRef = useRef<HTMLDivElement>(null); // Automatic Scroll Functionality

  // Loading Bar CSS
  const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => (
    <div className={styles.loadingBarContainer}>
      <div
        className={styles.loadingBar}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );

  const [progresses, setProgresses] = useState<Progresses>({});
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      const pythonFiles = acceptedFiles.filter((file) =>
        file.name.endsWith(".py")
      );
      if (pythonFiles.length === 0) {
        setMessage("No Python files found.");
        return;
      }
      const newProgresses = {};
      setProgresses(newProgresses);
      setUploadedFiles(pythonFiles);
      setUploading(true);
    }, []),
  });
  // No Issue Report Structures
  // useEffect(() => {
  //   if (currentReportFileName && !uploading) {
  //     reportSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [currentReportFileName, uploading]);

  useEffect(() => {
    if (duplicateCode && duplicateCode.length > 0) {
      setHasDuplicateCodeIssue(true);
    } else {
      setHasDuplicateCodeIssue(false);
    }
  }, [duplicateCode]);

  useEffect(() => {
    if (lengthReport && lengthReport.length > 0) {
      setHasLengthIssue(true);
    } else {
      setHasLengthIssue(false);
    }
  }, [lengthReport]);

  useEffect(() => {
    if (returnTypeConsistencyReport && returnTypeConsistencyReport.length > 0) {
      setReturnTypeConsistencyIssue(true);
    } else {
      setReturnTypeConsistencyIssue(false);
    }
  }, [returnTypeConsistencyReport]);

  useEffect(() => {
    if (deadCode && deadCode.length > 0) {
      setHasDeadCodeIssue(true);
    } else {
      setHasDeadCodeIssue(false);
    }
  }, [deadCode]);

  useEffect(() => {
    if (argumentNormalization && argumentNormalization.length > 0) {
      setArgumentNormalizationIssue(true);
    } else {
      setArgumentNormalizationIssue(false);
    }
  }, [argumentNormalization]);

  useEffect(() => {
    if (repetitivePatternsReport && repetitivePatternsReport.length > 0) {
      setRepetitivePatternsIssue(true);
    } else {
      setRepetitivePatternsIssue(false);
    }
  }, [repetitivePatternsReport]);

  useEffect(() => {
    if (classCohesionReport && classCohesionReport.length > 0) {
      setClassCohesionIssue(true);
    } else {
      setClassCohesionIssue(false);
    }
  }, [classCohesionReport]);

  useEffect(() => {
    if (redundantExceptBlockReport && redundantExceptBlockReport.length > 0) {
      setRedundantExceptBlockIssue(true);
    } else {
      setRedundantExceptBlockIssue(false);
    }
  }, [redundantExceptBlockReport]);

  useEffect(() => {
    if (moduleOrganizationReport && moduleOrganizationReport.length > 0) {
      setModuleOrganizationIssue(true);
    } else {
      setModuleOrganizationIssue(false);
    }
  }, [moduleOrganizationReport]);

  useEffect(() => {
    if (variableUsageReport && variableUsageReport.length > 0) {
      setVariableUsageIssue(true);
    } else {
      setVariableUsageIssue(false);
    }
  }, [variableUsageReport]);

  useEffect(() => {
    if (functionGraphReport && functionGraphReport.length > 0) {
      setFunctionGrapIssue(true);
    } else {
      setFunctionGrapIssue(false);
    }
  }, [functionGraphReport]);

  useEffect(() => {
    if (functionCyclomaticReport && functionCyclomaticReport.length > 0) {
      setFunctionCyclomaticIssue(true);
    } else {
      setFunctionCyclomaticIssue(false);
    }
  }, [functionCyclomaticReport]);
  // Rubbish Bin Feature
  const clearCurrentFolder = () => {
    setCurrentReportFileName("");
    setCurrentFile(null);
    setUploading(false);
    setProgress(0);
    setUploadedFiles([]);
    setFunctionLengthDocStringReport([]);
    setDuplicateCode([]);
    setReturnTypeConsistencyReport([]);
    setDeadCode([]);
    setCodeHealthIssues([]);
    setModuleOrganization([]);
    setFunctionGraph([]);
    setArgumentNormalizationReport([]);
    setRepetitivePatterns([]);
    setClassCohesionReportIssue([]);
    setRedundantExceptBlock([]);
    setFunctionCyclomatic([]);
    setVariableUsage([]);
    setIsAnalysisComplete(false);
  };
  const handleSubmit = async (fileIndex: number) => {
    const fileToUpload = uploadedFiles[fileIndex];
    if (fileToUpload) {
      setCurrentFile(fileToUpload);
      setProgress(0);
      uploadFile(fileToUpload);
    } else {
      setMessage("Please select a file before analysing");
    }
  };
  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const duration = 1000;
    let interval = setInterval(() => {
      setProgress((oldProgress) => {
        const increment = 100 / (duration / 100);
        const newProgress = Math.min(oldProgress + increment, 100);
        if (newProgress === 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            setCurrentReportFileName(file.name);
            setMessage("Analysis Complete");
          }, duration / 20);
        }
        setUploading(true);
        return newProgress;
      });
    }, 100);

    setTimeout(() => {
      try {
        fetch("http://localhost:3002/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Success:", data);

            // Fix the function length report structure
            const functionLengthReport = {
              function_length: Object.entries(data.function_lengths).map(
                ([functionName, length]) => ({
                  functionName,
                  length: length as number,
                })
              ),
              docstring_issues: data.docstring.map((issue: any) => ({
                message: issue.message,
                length: issue.docstring_length,
              })),
            };

            setFunctionLengthDocStringReport([functionLengthReport]); // Wrap in array since component expects array

            // Rest of your state updates
            setDuplicateCode(data.duplicate_blocks);
            setReturnTypeConsistencyReport(data.return_type_suggestion);
            setDeadCode(data.dead_code);
            setArgumentNormalizationReport(data.argument_normalization);
            setRepetitivePatterns(data.repetitive_pattern);
            setCodeHealthIssues(data.code_health_score);
            setClassCohesionReportIssue(data.class_cohesion);
            setRedundantExceptBlock(data.redundant_except_blocks);
            setModuleOrganization(data.module_organization);
            setVariableUsage(data.variable_usage);
            setFunctionGraph(data.function_grapher);
            setFunctionCyclomatic(data.cyclomatic_complexity);

            setUploading(false);
            setCurrentReportFileName(file.name);
            setMessage("Analysis Complete");
            setIsAnalysisComplete(true);
          })
          .catch((error) => {
            console.error("Error:", error);
            setMessage("Error uploading file");
            setUploading(false);
            setProgress(0);
          });
      } catch (error) {
        console.error("Error:", error);
        setMessage("Error uploading file");
        setUploading(false);
        setProgress(0);
      }
    }, duration);
  };
  return (
    <>
      <div className={styles.topMainContainer}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className={styles.dropBoxHover}>Drop the folders here ...</p>
          ) : (
            <p className={styles.dragBox}>
              Drag your code folder here or click to select single file
            </p>
          )}
        </div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.leftMainContainer}>
          <div className={styles.titleWithIcon}>
            <p
              onClick={() => {
                if (window.confirm("Do you want to delete the report?")) {
                  clearCurrentFolder();
                }
              }}
              className={styles.clearButton}
              aria-label="Clear reports"
            >
              <img src="/assets/bin_icon.png" alt="Clear" />
            </p>
          </div>

          <div className={styles.fileList}>
            {uploadedFiles
              .filter((file) => file.name.endsWith(".py"))
              .map((file, index) => (
                <div key={index}>
                  <button
                    type="button"
                    className={styles.fileItem}
                    onClick={() => handleSubmit(index)}
                  >
                    {file.name}
                  </button>
                  {uploading && currentFile === file && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className={styles.rightMainContainer}>
          <div className={styles.reportSection}>
            {currentReportFileName && !uploading && (
              <h2 style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                {currentReportFileName} Report
              </h2>
            )}
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasLengthIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Function Length & Docstring Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No Methods or Docstring in the file
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasDuplicateCodeIssue && (
                <>
                  <h2 className={styles.reportTitle}>Duplicate Code Report</h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Code Duplicate
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasReturnTypeConsistencyIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Return Type Consistency Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Return Type Consistency
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasDeadCodeIssue && (
                <>
                  <h2 className={styles.reportTitle}>Dead Code Report</h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Dead Code
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasArgumentNormalizationIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Argument Normalization Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Argument Normalization
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasRepetitivePatternsIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Repetitive Patterns Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Repetitive Patterns
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasClassCohesiontIssue && (
                <>
                  <h2 className={styles.reportTitle}>Class Cohesion Report</h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Class Cohesion
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasRedundantExceptBlockIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Redundant Except Block Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Redundant Except Block
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasModuleOrganizationIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Module Organization Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Redundant Module Organization
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasVariableUsageIssue && (
                <>
                  <h2 className={styles.reportTitle}>Variable Usage Report</h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Variable Usage
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasFunctionGraphIssue && (
                <>
                  <h2 className={styles.reportTitle}>Function Graph Report</h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Function Graph
                  </div>
                </>
              )}
            </div>
            <div className={styles.reportContainer}>
              {isAnalysisComplete && !hasFunctionCyclomaticIssue && (
                <>
                  <h2 className={styles.reportTitle}>
                    Function Cyclomatic Report
                  </h2>
                  <div className={styles.lineBelowReportTitle} />
                  <div className={styles.noIssueMessage}>
                    No issues With Function Cyclomatic
                  </div>
                </>
              )}
            </div>
            <FunctionLengthReport return_lengths={lengthReport} />
            <DuplicateCodeReport duplicateCode={duplicateCode} />
            <DeadCodeReport deadCode={deadCode} />
            <ReturnTypeConsistencyReport
              returnTypeReport={returnTypeConsistencyReport}
            />
            <ArgumentNormalizationReport
              returnArgumentNormalization={argumentNormalization}
            />
            <RepetitivePatternReport
              repetitivePatterns={repetitivePatternsReport}
            />
            <CodeHealthReport codeHealthIssues={codeHealthReport} />
            <ClassCohesionReport classCohesionIssue={classCohesionReport} />
            <RedundantExceptBlockIssueReport
              redundantExceptBlockIssue={redundantExceptBlockReport}
            />
            <ModuleOrganizationReport
              moduleOrganizationIssue={moduleOrganizationReport}
            />
            <VariableUsageReport variableUsageIssue={variableUsageReport} />
            <FunctionGraphReport callFunctionGraph={functionGraphReport} />
            <FunctionCyclomaticReport
              functionComplexityIssues={functionCyclomaticReport}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default index;
