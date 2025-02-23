

export type FunctionDetail = {
  functionName: string;
  length: number;
};

export type DocString = {
  message: string;
  length: number;
};

export type FunctionLengthDocString = {
  function_length: FunctionDetail[]; 
  docstring_issues: DocString[]; 
};

export type DuplicateBlock = {
  lines: number[];
  code: string;
};
  
export type ReturnTypeConsistency = {
  line: number;
  message: string;
};
  
export type ReturnTypeConsistencyProps = {
  returnTypeReport: ReturnTypeConsistency[];
};
  
export type DeadCode = {
  length: number;
  unused_functions: UnusedCodeVariable[];
  unused_classes: UnusedCodeVariable[];
  unused_variables: UnusedVariable[];
};

export type UnusedCodeVariable = {
  name: string;
  line: number;
};

export type UnusedVariable = {
  message: string;
  line: number;
  variable:string;
  
};

export type ArgumentNormalization = {
    argument: string;
    functions: string[];
    lines:number;
};
  
export type RepetitivePattern = {
    pattern: string;
    lines: string;
    code: string;
    additional_occurrences:Array<{
        line: number;
        snippet: string;
      }>;
};

export type Suggestion = {
  line: number;
  original: string;
  refactored: string;
  message: string;
};

export type CodeHealthIssue = {
  health_score: number;
  suggestions: Suggestion[];
};

export type CodeHealthReportProps = {
  codeHealthIssues: CodeHealthIssue[];
};

export type CohesionMetrics = {
    attribute_ratio: number;
    interaction_ratio: number;
};
  
export type ClassCohesion = {
    className: string;
    cohesionMetrics: CohesionMetrics; 
    overallCohesion: number;
    recommendation: string;
};

export type ClassCohesionProps = {
    ClassCohesionIssue: ClassCohesion[];
};

export type RedundantExceptBlock = {
    line: number;
    message: string;
    code:string;
};

export type RedundantExceptBlockProps = {
    redundantExceptBlockIssue: RedundantExceptBlock[];
};

export type ModuleOrganization = {
    message: string; 
   
    split_points: string; 
};

export type ModuleOrganizationProps = {
    moduleOrganizationIssue: ModuleOrganization[];
};

export type VariableUsage = {
  variable: string;
  function: string;
  line: number;
  message: string;
  
};

export type VariableUsageProps = {
  variableUsageIssue: VariableUsage[];
};

export type FunctionGraph = {
  caller: string;
  callee: string;
  call_count: number;
  is_recursive: boolean;
  caller_location: string;
  callee_location: string;
};

export type FunctionGraphProps = {
  callGraph: FunctionGraph[];
};

export type FunctionCyclomatic = {
  line: number;
  code: string;
  complexity: number;
  message: string;
};

export type FunctionCyclomaticProps = {
  functionComplexityIssues: FunctionCyclomatic[];
};

export type LoadingBarProps = {
  progress: number;
};

export type Progresses = Record<string, number>;
