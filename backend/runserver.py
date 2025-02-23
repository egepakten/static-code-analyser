################################################################################################################
# Author : Kerem Ege Pakten
# Student ID : 20057057
# Date : 23 March 2024
# This File defines a Flask application that provides an API endpoint for analysing Python code files.
# The analyzer performs various static code analyses, such as checking for consistent return types, identifying
# redundant except blocks, analyzing function arguments, and more. It is designed to help improve code quality
# by providing insights into potential issues and suggesting improvements
################################################################################################################
#!/usr/bin/env python3
import collections
from flask import Flask, request, jsonify
from flask_cors import CORS
import ast

app = Flask(__name__)
CORS(app)  # Simplify CORS for testing


class CodeAnalyzer(ast.NodeVisitor):
    def __init__(self):
        # Function Length Feature
        self.function_lengths = {}
        # Dead Code Feature
        self.defined_functions = set()
        self.defined_classes = set()
        self.defined_variables = collections.defaultdict(list)
        self.used_variables = set()
        self.used_names = set()
        self.function_lines = {}
        self.class_lines = {}
        self.unused_variables_report = []
        # Return Type Consistency Feature
        self.return_type_suggestion = []
        self.function_defs = collections.defaultdict(list)
        # Argument Normalization Feature
        self.argument_normalization = {}
        # Repetitive Patterns Feature
        self.patterns = collections.defaultdict(
            lambda: {'lines': [], 'snippets': []})
        self.repetitive_patterns = {}
        # Docstring Feature
        self.docstring_issues = []
        # Redundant Code Feature
        self.redundant_code_suggestions = []
        # Code Health Feature
        self.nesting_depth = 0
        self.method_length = {}
        self.complex_expressions_count = 0
        self.recommendations = []
        # Class Cohesion Feature
        self.class_cohesion = []
        # Redundant Except Blocks Feature
        self.redundant_except_blocks = []
        # Module Organisation Feature
        self.function_definitions = []
        self.class_definitions = []
        self.module_organization_report = []
        # Variable Usage Feature
        self.variables = {}
        self.variable_usage_report = []
        self.current_function = []
        # Function Interaction Grapher Feature
        self.call_graph = collections.defaultdict(set)
        self.call_count = collections.defaultdict(int)
        self.is_recursive = collections.defaultdict(bool)
        self.caller_location = {}
        self.callee_location = {}
        # FunctionComplexity
        self.function_nodes = []

    # Module Organisation Feature
    # This feature checks the organization of the module to ensure that
    # it adheres to the guidelines for the maximum number of functions and classes per module
    def module_organization(self):
        organization_suggestions = []  # Define list to hold any organization suggestions
        # Define the maximum number of functions and classes allowed per module
        max_functions_per_module = 10
        max_classes_per_module = 5
        # If the number of function definitions exceeds the maximum suggest splitting the module
        if len(self.function_definitions) > max_functions_per_module:
            # Determine the points at which to suggest splitting the module
            function_split_points = self._determine_split_points(
                self.function_definitions, max_functions_per_module)
            function_message = "Consider splitting this module into multiple modules with fewer functions each.\n"
            organization_suggestions.append({
                'message': function_message,
                'split_points': function_split_points
            })
        if len(self.class_definitions) > max_classes_per_module:
            # Determine the points at which to suggest splitting the module for classes
            class_split_points = self._determine_split_points(
                self.class_definitions, max_classes_per_module)
            class_message = "Consider splitting this module into multiple modules with fewer classes each.\n"
            organization_suggestions.append({
                'message': class_message,
                'split_points': class_split_points
            })
        return organization_suggestions
    # Helper method determines where to split the module based on the number of definitions

    def _determine_split_points(self, definitions, max_per_module):
        split_points = []
        # Append the last definition before the split point to the list
        for i in range(max_per_module, len(definitions), max_per_module):
            split_points.append(definitions[i-1])
        return '\n'.join(split_points)

    # Method generates a report of the module organization suggestions
    def generate_module_organization(self):
        organization_suggestions = self.module_organization()
        module_organization_report = []
        for suggestion in organization_suggestions:
            module_organization_report.append({
                'message': suggestion['message'],
                'split_points': suggestion['split_points']
            })
        return module_organization_report

    def visit_FunctionDef(self, node):
        start_line = node.lineno
        end_line = node.body[-1].lineno
        self.function_defs[node.name].append((start_line, end_line))
        self.function_definitions.append(node.name)
        # Dead Code Feature
        self.defined_functions.add(node.name)
        self.function_lines[node.name] = node.lineno
        # Function Length Feature
        start_line = node.lineno  # Gets the starting line number of the current node
        # Computes the end line number by walking through all the child nodes of the current node
        # The getattr function is used to safely get the line number attribute, defaulting to start_line
        # if the attribute does not exist
        # The max function is used to find the largest line number which indicates the end of the node
        end_line = max((getattr(n, 'lineno', start_line) for n in ast.walk(node)),
                       default=start_line)
        # Calculates the function length by subtracting the start line number from the end line number
        # We add 1 because both the start and end lines are inclusive
        function_length = end_line - start_line + 1
        self.function_lengths[node.name] = function_length
        # Argument Analyse Tool
        self.analyse_function_arguments(node)
        # Return Type Consistency
        self.check_return_type_consistency(node)
        # DocString
        # Attempt to retrieve the docstring of the current AST node a function or class
        docstring = ast.get_docstring(node)
        # Check if the docstring is None which means the function lacks a docstring
        if docstring is None:
            # Append an entry to the docstring_issues list indicating the function has no docstring
            # The message includes the functions name and its starting line number
            self.docstring_issues.append({
                'message': f"Function '{node.name}' at line {node.lineno} lacks a docstring.",
                'docstring_length': 0  # The length of the docstring is set to 0 as it is absent
            })
        else:
            # If the docstring is present calculate its length in lines
            docstring_length = len(docstring.splitlines())
            # Append an entry to the docstring_issues list with the function's name,
            # its starting line number and the length of its docstring
            self.docstring_issues.append({
                'message': f"Function '{node.name}' at line {node.lineno} has a docstring length of {docstring_length}.",
                'docstring_length': docstring_length
            })

        self.current_function = node.name
        self.generic_visit(node)
        self.current_function = None

        # FunctionComplexity
        self.function_nodes.append(node)
        self.generic_visit(node)

        # VariableUsage and FunctionGrapher
        previous_function = self.current_function
        self.current_function = node.name
        self.generic_visit(node)
        self.current_function = previous_function

        self.method_length[node.name] = len(node.body)
        self.nesting_depth = 0
        self.complex_expressions_count = 0

    # FunctionLength Docstring Tool
    def generate_Docstring_report(self):
        return self.docstring_issues
    # FunctionComplexity
    # Calculate the complexity of a given AST node typically a function or class

    def _calculate_complexity(self, node):
        complexity = 0
        # Loop through the items in the body of the node function, class
        for body_item in node.body:
            # Increment the complexity count based on child nodes complexity
            complexity += self._get_complexity(body_item)
        return complexity
    # Calculate complexity based on control flow structures in the AST node

    def _get_complexity(self, node):
        # Check if the node is a control flow structure that contributes to complexity
        if isinstance(node, (ast.If, ast.For, ast.While, ast.And, ast.Or, ast.Try, ast.ExceptHandler)):
            # Each control flow element increases complexity by 1, recursively check child nodes
            return 1 + sum(self._get_complexity(child) for child in ast.iter_child_nodes(node))
        return 0  # If not a control flow structure it doesnt contribute to complexity

    # Format the code to indent all lines after the first one for better readability in reports
    def format_code(self, code):
        lines = code.splitlines()
        # Indent every line except the first one
        formatted_lines = [lines[0]] + [("   " + line) for line in lines[1:]]
        return "\n".join(formatted_lines)

    # Generate a report of functions with a cyclomatic complexity above the threshold
    def report_cyclomatic_function_complexity(self):
        # Threshold defined below which complexity is considered high
        complexity_threshold = 3
        complexity_report = []
        # Iterate over each function node to calculate its complexity
        for func in self.function_nodes:
            complexity_score = self._calculate_complexity(func)
            # If complexity exceeds the threshold add to the report
            if complexity_score > complexity_threshold:
                # Format the functions code for the report
                formatted_code = self.format_code(ast.unparse(func))
                complexity_report.append({
                    'line': func.lineno,
                    'code': formatted_code,
                    'complexity': complexity_score,
                    'message': f"Function '{func.name}' at line {func.lineno} has a cyclomatic complexity of {complexity_score}, "
                               f"which is higher than the threshold of {complexity_threshold}. Consider refactoring."
                })
        return complexity_report

    # FunctionGrapher
    # Visit call nodes in the AST and update the call graph data structures
    def visit_Call(self, node):
        if self.current_function:
            # The name of the function being called
            called_function_name = self._get_called_function_name(node.func)
            if called_function_name:
                # The function to the call graph for the current function
                self.call_graph[self.current_function].add(
                    called_function_name)
                # Increment the call count between the current function and the called function
                self.call_count[(self.current_function,
                                 called_function_name)] += 1
                # If the function calls itself mark it as recursive
                if self.current_function == called_function_name:
                    self.is_recursive[called_function_name] = True
                # Record the location of the call within the current function
                self.caller_location[self.current_function] = self._get_location(
                    node)
                # Record the location where the called function is defined
                self.callee_location[called_function_name] = self._get_location(
                    node.func)
        self.generic_visit(node)  # Continue visiting the rest of the AST

    # Get the name of the function called function
    def _get_called_function_name(self, call_node):
        # Check if the call is a simple name such as func()
        if isinstance(call_node, ast.Name):
            return call_node.id
         # Check if the call is an attribute access such as module.func()
        elif isinstance(call_node, ast.Attribute):
            value_name = self._get_called_function_name(call_node.value)
            if value_name:
                # Combine the object and attribute names such as module.func
                return f"{value_name}.{call_node.attr}"
        return None

    def _get_location(self, node):
        return f"Line {node.lineno}"

    # Generate a report of the call graph
    def generate_functionGraph_report(self):
        call_graph_list = []  # Iterate over all recorded calls in the call graph
        for caller, callees in self.call_graph.items():
            for callee in callees:
                # Call back the call count for this pair of functions
                call_count = self.call_count.get((caller, callee), 0)
                # Check if the callee is marked as recursive
                is_recursive = self.is_recursive.get(callee, False)
                # Get the recorded location of the caller and callee
                caller_location = self.caller_location.get(caller, "")
                callee_location = self.callee_location.get(callee, "")
                # Append the call information
                call_graph_list.append({
                    'caller': caller,
                    'callee': callee,
                    'call_count': call_count,
                    'is_recursive': is_recursive,
                    'caller_location': caller_location,
                    'callee_location': callee_location
                })
        return call_graph_list

    # Duplicate Code Features
    # Feature searches for duplicate blocks of code within the given source code
    def find_duplicate_blocks(self, source):
        # Parse the source code into an abstract syntax tree (AST)
        tree = ast.parse(source)
        # Initialize a dictionary to keep track
        duplicates = collections.defaultdict(list)
        occurrences = {}  # Initialize a dictionary to keep track of first occurrences
        # Define a visitor class that extends ast.NodeVisitor to visit function definitions

        class FunctionVisitor(ast.NodeVisitor):
            def visit_FunctionDef(self, node):
                # Get the current functions name
                function_name = node.name
                # If the function name has been seen before, append this occurrence as a duplicate
                if function_name in occurrences:
                    duplicates[function_name].append(
                        (node.lineno, node.end_lineno))
                else:
                    # Else record the first occurrence of this function
                    occurrences[function_name] = (node.lineno, node.end_lineno)
                # Continue visiting the rest of the AST
                self.generic_visit(node)

        # Create an instance of the visitor and apply it to the AST
        FunctionVisitor().visit(tree)
        # Insert the first occurrences in the duplicates list to have complete information
        for name, (start, end) in occurrences.items():
            if name in duplicates:
                duplicates[name].insert(0, (start, end))
        # Filter out entries that are not duplicates
        duplicates = {name: ranges for name,
                      ranges in duplicates.items() if len(ranges) > 1}
        # Split the source code into lines
        lines = source.split('\n')
        duplicate_snippets = []
        # Iterate over the duplicates to prepare the snippets
        for name, ranges in duplicates.items():
            # Extract the code snippets corresponding to the line ranges of the duplicates
            code_snippets = ['\n'.join(lines[start - 1:end])
                             for start, end in ranges]
            # Create a list of line ranges in a human-readable format
            line_numbers = [f'{start}-{end}' for start, end in ranges]
            # Append the formatted code snippets and their line numbers to the duplicate_snippets list
            duplicate_snippets.append({
                "code": ' --- '.join(code_snippets),
                "lines": ', '.join(line_numbers),
            })
        return duplicate_snippets

    def visit_ClassDef(self, node):
        self.class_definitions.append(node.name)

        self.defined_classes.add(node.name)
        self.class_lines[node.name] = node.lineno
        self.generic_visit(node)

       # Docstring
        if not ast.get_docstring(node):
            self.docstring_issues.append({
                'message': f"Class '{node.name}' at line {node.lineno} lacks a docstring."
            })

        # Class Cohesion Feature
        attributes = {n.targets[0].attr for n in ast.walk(node) if isinstance(n, ast.Assign) and isinstance(
            n.targets[0], ast.Attribute) and isinstance(n.targets[0].value, ast.Name) and n.targets[0].value.id == 'self'}
        # Collect all the names of methods in the class
        method_names = [
            n.name for n in node.body if isinstance(n, ast.FunctionDef)]
        # Initialise sets to track used attributes and interactions between methods
        used_attributes = set()
        method_interactions = set()
        # Iterate over all methods in the class
        for method in node.body:
            if isinstance(method, ast.FunctionDef):
                # Update the set of used attributes by collecting attributes accessed within the method
                used_attributes.update(n.attr for n in ast.walk(
                    method) if isinstance(n, ast.Attribute) and n.attr in attributes)
                # Update the set of method interactions by collecting calls to other methods in the class
                method_interactions.update(n.func.id for n in ast.walk(method) if isinstance(
                    n, ast.Call) and isinstance(n.func, ast.Name) and n.func.id in method_names)
        # Calculate cohesion metrics based on the usage of attributes and interactions
        cohesion_metrics = {
            'attribute_ratio': len(used_attributes) / len(attributes) if attributes else 1,
            'interaction_ratio': len(method_interactions) / len(method_names) if method_names else 1,
        }
        # Determine the overall cohesion score as the average of the two ratios
        overall_cohesion = (
            cohesion_metrics['attribute_ratio'] + cohesion_metrics['interaction_ratio']) / 2
        # Append the cohesion metrics and the overall cohesion score
        self.class_cohesion.append({
            'className': node.name,
            'cohesionMetrics': cohesion_metrics,
            'overallCohesion': overall_cohesion,
            'recommendation': 'Consider refactoring.' if overall_cohesion <= 0.5 else 'Cohesion seems good.'
        })
        self.generic_visit(node)  # Continue visiting the rest of the AST nodes

    def generate_class_cohesion_reports(self):
        return self.class_cohesion

    # Dead Code Feature
    # Visits every name identifier used in the AST
    def visit_Name(self, node):
        self.used_names.add(node.id)  # Adds the name to a set of used names
        # If the nodes context is a load operation meaning the variable is being read or used
        # add the name to a set of used variables
        if isinstance(node.ctx, ast.Load):
            self.used_variables.add(node.id)
            # Variable Usage Feature
            # Determines the current function scope or defaults to global if not in a function
            function_scope = self.current_function or 'global'
            # If the variable is already tracked under the current scope mark it as used
            if node.id in self.variables.get(function_scope, {}):
                self.variables[function_scope][node.id]['used'] = True
        self.generic_visit(node)
    # Checks every assignment statement in the AST

    def visit_Assign(self, node):
        # Iterates through each target in the assignment
        for target in node.targets:
            # If the target of the assignment is a variable ast.Name record its line number indicating where its defined
            if isinstance(target, ast.Name):
                self.defined_variables[target.id].append(node.lineno)

        # Variable Usage Feature
                # Extract the variable name from the assignment target.
                var_name = target.id
                # If inside a function call backs or initialize the variable tracking dictionary for that function
                if self.current_function:
                    vars_in_func = self.variables.setdefault(
                        self.current_function, {})
                    # If the variable has been previously encountered in the function mark it as overwritten
                    if var_name in vars_in_func:
                        vars_in_func[var_name]['overwritten'] = True
                    else:
                        # If its the first encounter with the variable initialize its tracking info:
                        # line number whether it's been overwritten and whether it's been used
                        vars_in_func[var_name] = {
                            'line': node.lineno, 'overwritten': False, 'used': False}
    # Generate Variable Usage Feature

    def report_variable_usage(self):
        # Iterate over all functions and their variables
        for function, vars in self.variables.items():
            for var_name, info in vars.items():
                # If a variable is marked as overwritten but not used its considered as a candidate for optimization/removal
                if info['overwritten'] and not info['used']:
                    self.variable_usage_report.append({
                        'variable': var_name,
                        'function': function,
                        'line': info['line'],
                        'message': f"Variable '{var_name}' in function '{function}' is overwritten without being used."
                    })
        return self.variable_usage_report

    # Dead Code Feature
    def deadCodeDetection(self):
        reported = set()  # Keeps track of already reported variables to avoid duplicates
        filtered_report = []  # Initialises the list to store reports about unused variables
        # Iterate over all defined variables and their corresponding line numbers
        for var_name, lines in self.defined_variables.items():
            # Check if the variable is not in the set of used variables
            if var_name not in self.used_variables:
                # For each line the variable is defined on report it as unused
                for line in lines:
                    # Ensure the variable and line combination hasnt been reported yet
                    if (var_name, line) not in reported:
                        reported.add((var_name, line))
                        filtered_report.append({
                            'variable': var_name,
                            'line': line,
                            'message': f"Variable '{var_name}' defined on line {line} is never used."
                        })
        return filtered_report

    def generate_deadCode_report(self):
        dead_code_report = []  # To store the complete dead code report
        # Identify unused functions and prepare a report entry for them
        unused_functions = [
            {'line': self.function_lines[func], 'name': func}
            for func in self.defined_functions
            if func not in self.used_names
        ]
        # If there are unused functions append them to the dead code report
        if unused_functions:
            dead_code_report.append({'unused_functions': unused_functions})
        # Identifies the unused classes and prepare a report entry for them
        unused_classes = [
            {'line': self.class_lines[cls], 'name': cls}
            for cls in self.defined_classes
            if cls not in self.used_names
        ]
        # If there are unused classes append them to the dead code report
        if unused_classes:
            dead_code_report.append({'unused_classes': unused_classes})
        # Detect unused variables using the previously defined method
        unused_variables = self.deadCodeDetection()
        # If there are unused variables, append them to the dead code report
        if unused_variables:
            dead_code_report.append({'unused_variables': unused_variables})
        return dead_code_report

    # Code Health Feature
    def visit_For(self, node):
        self.nesting_depth += 1  # Increase nesting depth whenever a for loop is entered
        # Check if we are in the outermost loop and the loop contains only one statement
        if self.nesting_depth == 1 and len(node.body) == 1:
            # Single loop with a single if statement
            if len(node.body) == 1 and isinstance(node.body[0], ast.If):
                self.handle_single_loop_with_if(node)
            else:
                # If the loop's body is another loop and the nesting is not too deep
                if self.nesting_depth <= 3:
                    body_node = node.body[0]
                    if isinstance(body_node, ast.For):
                        second_loop = body_node  # Check for double nested loops
                        second_body_node = second_loop.body[0]
                        if isinstance(second_body_node, ast.For):
                            third_loop = second_body_node  # Check for triple nested loops
                            third_body_node = third_loop.body[0]
                            first_range = ast.unparse(node.iter)
                            second_range = ast.unparse(second_loop.iter)
                            third_range = ast.unparse(third_loop.iter)
                            # Check for expression call and suggest refactoring
                            if isinstance(third_body_node, ast.Expr) and isinstance(third_body_node.value, ast.Call) and isinstance(third_body_node.value.func, ast.Name):
                                # Refactor suggestion for triple nested loops with a simple expression
                                refactored_code = f"[print({node.target.id}, {second_loop.target.id}, {third_loop.target.id}) for {node.target.id} in {first_range} for {second_loop.target.id} in {second_range} for {third_loop.target.id} in {third_range}]"
                                suggestion = {
                                    'line': node.lineno,
                                    'original': ast.unparse(node),
                                    'refactored': refactored_code,
                                    'message': "Consider using a nested list comprehension for up to three nested loops."
                                }
                                self.recommendations.append(suggestion)
                        # Check for two nested loops iterating over the same iterable
                        outer_loop = node
                        inner_loop = node.body[0]
                        if (isinstance(outer_loop, ast.For) and isinstance(inner_loop, ast.For) and
                                ast.unparse(outer_loop.iter) == ast.unparse(inner_loop.iter)):
                            action = inner_loop.body[0].value
                            # Prepare the suggestion for refactoring using a list comprehension
                            if isinstance(action, ast.Call):
                                loop_vars = [outer_loop.target.id,
                                             inner_loop.target.id]
                                list_name = ast.unparse(outer_loop.iter)
                                action_str = ast.unparse(action)
                                refactored_code = f"[{action_str} for {loop_vars[0]} in {list_name} for {loop_vars[1]} in {list_name}]"
                                suggestion = {
                                    'line': outer_loop.lineno,
                                    'original': f'for {loop_vars[0]} in {list_name}:\n    for {loop_vars[1]} in {list_name}:\n        {action_str}',
                                    'refactored': refactored_code,
                                    'message': "Consider using a nested list comprehension for nested loops over the same list."
                                }
                                self.recommendations.append(suggestion)
        # Check for a single loop with an append action suggest list comprehension
        else:
            # Access the first statement in the loops body
            body_node = node.body[0]
            # Check if its an append call to a list
            if (isinstance(body_node, ast.Expr) and isinstance(body_node.value, ast.Call) and
                    isinstance(body_node.value.func, ast.Attribute) and body_node.value.func.attr == 'append'):
                # Get the argument to the append call which is what is being added to the list
                append_arg = ast.unparse(body_node.value.args[0])
                # Construct a list comprehension equivalent of the loop
                refactored_code = f"some_name = [{append_arg} for {node.target.id} in {ast.unparse(node.iter)}]"
                suggestion = {
                    'line': node.lineno,
                    'original': ast.unparse(node),
                    'refactored': refactored_code,
                    'message': "Consider using a list comprehension for single loops."
                }
                self.recommendations.append(suggestion)
            else:
                # Handle single for-range loop
                # If this is the outermost loop and its a for loop with a range iterator
                if self.nesting_depth == 1 and isinstance(node.iter, ast.Call) and isinstance(node.iter.func, ast.Name) and node.iter.func.id == 'range':
                    action = node.body[0]
                    if isinstance(action, ast.Expr) and isinstance(action.value, ast.Call):
                        # Get the string representation of the action to include in the list comprehension
                        action_str = ast.unparse(action.value)
                        # Retrieve the loop variable
                        loop_var = node.target.id
                        # Get the string representation of the range used in the for loop
                        range_arg = ast.unparse(node.iter)
                        # Create the refactored code using list comprehension syntax
                        refactored_code = f"[{action_str} for {loop_var} in {range_arg}]"
                        # Create a suggestion dictionary with details for refactoring
                        suggestion = {
                            'line': node.lineno,
                            'original': ast.unparse(node),
                            'refactored': refactored_code,
                            'message': "Consider using a list comprehension for single for-range loops."
                        }
                        self.recommendations.append(suggestion)
                # Skip if more than three nested for-range loops
                elif self.nesting_depth > 3:
                    pass
        self.generic_visit(node)
        self.nesting_depth -= 1  # Decrease nesting depth when leaving a 'for' loop

    def get_nested_loops(self, node):
        # Initialise a list with the current loop node
        loops = [node]
        current = node
        # Continue while the current node contains a for loop within its body
        while hasattr(current.body[0], 'body') and isinstance(current.body[0], ast.For):
            # Move down to the nested for loop
            current = current.body[0]
            # Add the nested for loop to the list of loops
            loops.append(current)
         # Return the list of nested for loops found within the node
        return loops

    def handle_single_loop_with_if(self, node):
        # Check if the for loop contains a single if statement
        if len(node.body) == 1 and isinstance(node.body[0], ast.If):
            # Get the if body node
            if_body = node.body[0]
            # Check if the if body contains a single expression that is an append call
            if (isinstance(if_body.body[0], ast.Expr) and
                    isinstance(if_body.body[0].value, ast.Call) and
                    isinstance(if_body.body[0].value.func, ast.Attribute) and
                    if_body.body[0].value.func.attr == 'append'):
                # Unparse the argument of the 'append' call
                append_arg = ast.unparse(if_body.body[0].value.args[0])
                # Unparse the condition of the if statement
                condition = ast.unparse(if_body.test)
                # Get the loop variable of the for loop
                loop_var = node.target.id
                # Unparse the iterable of the for loop
                range_arg = ast.unparse(node.iter)
                # Construct the list comprehension that represents the refactored code
                refactored_code = f"[{append_arg} for {loop_var} in {range_arg} if {condition}]"
                suggestion = {
                    'line': node.lineno,
                    # String representation of the original for loop
                    'original': ast.unparse(node),
                    'refactored': refactored_code,  # Proposed refactored code using list comprehension
                    'message': "Consider using a list comprehension for single loops."
                }
                self.recommendations.append(suggestion)

    def is_nested_loop(self, node):
        # Check the parent nodes
        current = getattr(node, 'parent', None)
        while current is not None:
            # If any parent node is a for loop the current node is in a nested loop
            if isinstance(current, ast.For):
                return True
            # Move to the next parent node
            current = getattr(current, 'parent', None)
        # If no for loop parents are found its not a nested loop
        return False

    def generate_health_report(self):
        health_report = []  # Initialise an empty list for the health report
        # Calculate the overall health score of the code
        health_score = self.calculate_health_score()
        unique_suggestions = {
            frozenset(item.items()): item for item in self.recommendations}
        # Append the health score and unique suggestions to the health report
        health_report.append({
            'health_score': health_score,
            'suggestions': list(unique_suggestions.values())
        })
        return health_report

    def calculate_health_score(self):
        base_score = 100.0
        deduction_per_suggestion = 1.0
        # Deduction for each suggestion to improve code health
        score = base_score - deduction_per_suggestion * \
            len(self.recommendations)
        return max(score, 0.0)

    # Repetitive Pattern Feature
    # Classifies the structure of an if statement into three possible types
    def _classify_if_structure(self, node):
        # Check if there is exactly one else if in the orelse part and if its another ifs
        if len(node.orelse) == 1 and isinstance(node.orelse[0], ast.If):
            return "if_elif_else"
        # Check if there is exactly one else block in the orelse part
        elif len(node.orelse) == 1:
            return "if_else"
         # Default to just if if there are no else or elif parts
        return "if"
      # Visits if nodes in the abstract syntax tree

    def visit_If(self, node):
        # Check if the if statement has an orelse part and it is not empty
        if "orelse" in node.__dict__ and node.orelse:
            # Check if the condition is a comparison common in control flow
            if isinstance(node.test, ast.Compare):
                # Classify the if structure type
                pattern = self._classify_if_structure(node)
                # Retrieve the line number of the if statement
                line = node.lineno
                # Unparse the node to get a string snippet of the code
                snippet = ast.unparse(node).strip()
                # Add unique pattern information to the dictionary if its a new pattern
                if pattern and self._add_unique_pattern(pattern, line, snippet):
                    # The pattern add into the line number to the list associated with the pattern type
                    self.patterns[pattern]['lines'].append(line)
                    # The snippets add into the list associated with the pattern type
                    self.patterns[pattern]['snippets'].append(snippet)

            if any(isinstance(stmt, ast.Return) for stmt in node.body):
                if node.orelse:
                    self.redundant_code_suggestions.append({
                        'function': self.current_function,
                        'line': node.lineno,
                        'message': "Redundant else statement after return."
                    })

            self.nesting_depth += 1
            self.complex_expressions_count += 1
            self.generic_visit(node)
            self.nesting_depth -= 1
            self.generic_visit(node)

    # Helper method to add a unique pattern to the tracking dictionary
    def _add_unique_pattern(self, pattern, line, snippet):
        # Ensure the pattern type exists in the dictionary
        if pattern not in self.patterns:
            self.patterns[pattern] = {'lines': [], 'snippets': []}
        # Check if the snippet is already recorded to avoid duplicates
        existing_lines = self.patterns[pattern]['lines']
        existing_snippets = self.patterns[pattern]['snippets']
        clean_snippet = snippet.strip()
        for existing_line, existing_snippet in zip(existing_lines, existing_snippets):
            if line == existing_line and clean_snippet == existing_snippet:
                return False
        return True
    # Generates Repetitive Patetrn Report

    def generate_repetitive_pattern_report(self):
        report = []
        for pattern, data in self.patterns.items():
            if len(data['lines']) > 1:
                first_line, *other_lines = data['lines']
                first_snippet, *other_snippets = data['snippets']
                report_item = {
                    'pattern': pattern,
                    'first_line': first_line,
                    'first_snippet': first_snippet,
                    'additional_occurrences': [{'line': line, 'snippet': snippet}
                                               for line, snippet in zip(other_lines, other_snippets)]
                }
                report.append(report_item)
        return report

    # Return Type Consistency Tool
    # Feature determines the type name of a given node in the abstract syntax tree
    def get_type_name(self, node):
        # Check if the node is a constant and return its type
        if isinstance(node, ast.Constant):
            return type(node.value).__name__
        # Check if the node is a number (Num is used in older versions of Python's AST)
        elif isinstance(node, ast.Num):
            return 'Num'
        # Check if the node is a string (Str is used in older versions of Python's AST)
        elif isinstance(node, ast.Str):
            return 'Str'
        # Return Unknown if the node type is not recognized
        return 'Unknown'
    # Method to check for consistency in the types of values returned by a function

    def check_return_type_consistency(self, node):
        return_types = set()  # Set to store unique return types found in the function
        # Walk through all child nodes of the function
        for child in ast.walk(node):
            # Check for return statements in the function
            if isinstance(child, ast.Return):
                # Handle return statements with no value return None
                if child.value is None:
                    return_types.add('None')
                else:
                    # Get the type of the return value and add it to the set
                    return_type = self.get_type_name(child.value)
                    return_types.add(return_type)
        # Check if multiple different return types were found
        if len(return_types) > 1:
            # Add a suggestion for inconsistent return types to the list
            self.return_type_suggestion.append({
                'line': node.lineno,
                'message': f"Function '{node.name}' has inconsistent return types: {', '.join(return_types)}"
            })

    # Analyse Function Arguments
    # Analyzes the arguments of a function to track how each argument is used across different functions
    def analyse_function_arguments(self, node):
        # Iterate over all arguments in the function definition
        for arg in node.args.args:
            # Extract the name of the argument
            arg_name = arg.arg
            # Skip the self argument commonly used in method definitions within classes
            if arg_name == 'self':
                continue
            # Initialize the storage for this argument if it hasn't been added yet
            if arg_name not in self.argument_normalization:
                self.argument_normalization[arg_name] = []
                # Record the function name and line number where this argument is used
            self.argument_normalization[arg_name].append(
                (node.name, node.lineno))
        self.generic_visit(node)  # Continue visiting other nodes in the AST
    # Generates a report summarizing how arguments are used across different functions

    def generate_argument_normalization_report(self):
        argument_normalization_report = []
        for arg, occurrences in self.argument_normalization.items():
            functions = set()
            line_numbers = set()
            for func_name, line in occurrences:
                functions.add(func_name)
                line_numbers.add(line)
            if len(functions) > 1 or len(line_numbers) > 1:
                argument_normalization_report.append({
                    'argument': arg,
                    'functions': list(functions),
                    'lines': ', '.join(map(str, sorted(line_numbers)))
                })
        return argument_normalization_report
    # Reduntant Except Block Feature
    # Visit each try statement in the Abstract Syntax Tree

    def visit_Try(self, node):
        # Iterate through each exception handler in the try block
        for handler in node.handlers:
            # Check if the last statement in the except block is a raise statement
            if isinstance(handler.body[-1], ast.Raise):
                # Check if the except block contains only the raise statement or a print/logging call followed by raise
                if len(handler.body) == 1 or \
                    (len(handler.body) == 2 and
                     isinstance(handler.body[0], ast.Expr) and
                     isinstance(handler.body[0].value, ast.Call) and
                     hasattr(handler.body[0].value.func, 'id') and
                        handler.body[0].value.func.id in ['print', 'logging']):
                    # Check if this pattern has not already been recorded to avoid duplicate entries
                    if not any(d['line'] == handler.lineno for d in self.redundant_except_blocks):
                        # Append the redundant except block information
                        self.redundant_except_blocks.append({
                            'line': handler.lineno,
                            'message': "Redundant except block that only re-raises the exception.",
                            'code_pattern': ast.unparse(handler)
                        })
                else:
                    # Check all other statements in the except block for logging or printing before re-raising
                    for stmt in handler.body[:-1]:
                        if not (isinstance(stmt, ast.Expr) and
                                isinstance(stmt.value, ast.Call) and
                                getattr(stmt.value.func, 'id', '') in ['print', 'logging']):
                            break
                    else:
                        # If only logging/printing statements are found record this as a redundant except block
                        if not any(d['line'] == handler.lineno for d in self.redundant_except_blocks):
                            self.redundant_except_blocks.append({
                                'line': handler.lineno,
                                'message': "Redundant except block that may only log/print and re-raise the exception.",
                                'code_pattern': ast.unparse(handler)
                            })
        self.generic_visit(node)  # Continue visiting child nodes
    # Generates a list of all identified redundant except blocks

    def generate_redundant_except_blocks(self):
        return self.redundant_except_blocks
    # Extends the AST node visitor to perform specific analyses

    def generic_visit(self, node):
        # Call the generic_visit of the parent class to continue the traversal
        super().generic_visit(node)
# Define a route for handling code uploads


@app.route('/api/upload', methods=['POST'])
def analyze_code():
    file = request.files['file']  # Access the uploaded file
    # Ensure the uploaded file is a Python file based on its filename
    if not file.filename.endswith('.py'):
        return jsonify({'message': 'Please upload a Python file.'}), 400
    # Read the file and decode it to a string
    source_code = file.read().decode('utf-8')
    root = ast.parse(source_code)  # Parse the source code into an AST
    analyzer = CodeAnalyzer()  # Instantiate an analyzer object from a custom class
    analyzer.visit(root)  # Visit the nodes of the AST using the analyzer
    # Collect various analyses from the analyser
    analysis_results = {
        'function_lengths': analyzer.function_lengths,
        'docstring': analyzer.generate_Docstring_report(),
        'duplicate_blocks': analyzer.find_duplicate_blocks(source_code),
        'dead_code': analyzer.generate_deadCode_report(),
        'return_type_suggestion': analyzer.return_type_suggestion,
        'argument_normalization': analyzer.generate_argument_normalization_report(),
        'repetitive_pattern': analyzer.generate_repetitive_pattern_report(),
        'code_health_score': analyzer.generate_health_report(),
        'class_cohesion': analyzer.generate_class_cohesion_reports(),
        'redundant_except_blocks': analyzer.generate_redundant_except_blocks(),
        'module_organization': analyzer.generate_module_organization(),
        'variable_usage': analyzer.report_variable_usage(),
        'function_grapher': analyzer.generate_functionGraph_report(),
        'cyclomatic_complexity': analyzer.report_cyclomatic_function_complexity(),
    }
    return jsonify(analysis_results)


if __name__ == '__main__':
    app.run(host='localhost', port=3002)
