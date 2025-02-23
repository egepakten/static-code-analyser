# Static Code Analysis Tool
# Author : Kerem Ege Pakten
# Student ID : 20057059

## Introduction
Welcome to the Static Code Analysis Tool
This tool helps you analyse Python files inside your Django Projects for various code quality metrics.

Before using the Static Code Analysis Tool, make sure you have the following dependencies installed:

## Prerequisites
Before you start using the tool, make sure you have the following installed on your system:

- Make sure to allow the necessary permissions for the development tool to execute within your terminal. This may require adjusting your system's security settings or terminal preferences.

- **Node.js and npm**: Ensure that you have the latest version of `npm` installed, which comes with Node.js. Install it from [the official Node.js website](https://nodejs.org/).
- **Flask**: This is a micro web framework written in Python, used for running the backend server. Install it using `pip install Flask` or `pip3 install Flask`.
- **Flask-CORS**: An extension for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible. Install it using `pip install Flask-CORS` or `pip3 install Flask-CORS`.
- **Typescript**: `npm install typescript@4.9.5 --save-dev` 
- **Python Version**: Python library version must be 3.11.0, `python.org` 

## Installation

1. Open the zip file and drag the folder inside a new terminal window 
2. Ensure all prerequisites are installed by running the above commands.

## Activation

To activate the analysis environment, follow these steps:

1. Enter the command: "npm run start-server"
2. Ensure all prerequisites are installed by running the above commands.

Upon execution, this command launches the local server and opens the React user interface in your default web browser.

## Usage

1. With the user interface open, locate the red dashed rectangle labeled “Drag your code files here or click to select files”.
2. Drag a folder containing your Python files onto this drop zone.
3. The tool will display the names of the Python files as clickable items in the interface.
4. Click on a file name to analyse it and the tool will generate a detailed report for that file.
5. If you need to remove files from the current analysis queue, click on the “Rubbish Bin” icon.
6. The tool will then clear the files, allowing you to upload and analyse new ones as needed.

Please note that:
The analysis environment will only accept folders containing `.py` files. 
If no Python files are detected, the folder will not be accepted for analysis.

## File Information

runserver.py contains the backend components (Analysis Features)
index.html contains the front end components

## Reports

After the analysis is complete, the tool generates a detailed report.

**Important**: If you encounter issues with the default port (8081), please ensure no previous processes are using it. You may need to terminate any lingering processes or specify a different port number for the tool's server.

## Support

For support, please contact k20057059@kcl.ac.uk