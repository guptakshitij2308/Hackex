---

# Online Coding Platform

## Overview
Welcome to the **Online Coding Platform**—your gateway to mastering full-stack development! This platform empowers users to write, execute, and practice coding in a dynamic and competitive environment. Whether you’re honing your skills in the Coding Playground, tackling challenges in the Coding Arena, or battling it out in the Coding Battleground, this platform has you covered.

## Features

### 1. Coding Playground
A space where users can experiment with code.
- **Code Editor**: Supports coding in a compiled language.
- **Execution**: Run code with custom inputs.
- **Output & Metrics**: View errors and outputs.

### 2. Coding Arena
A hub for practicing coding problems.
- **Problem Solving**: Solve problems available on the platform.
- **Problem Upload**: Users can upload custom problems, including descriptions, constraints, and test cases.

### 3. Coding Battleground
A competitive arena for coding contests.
- **Real-time Contests**: Users can participate in ongoing contests.
- **Leaderboards**: View real-time standings during contests.
- **Custom Contests**: Any user can create and host their own contests.

## Key Considerations

### 1. Performance and Scalability
- **Resource Utilization**: Efficiently manage server resources such as CPU and Memory.
- **Scalability**: Handle a growing number of users seamlessly.

### 2. Security and Resiliency
- **Compiler of our Own**: To increase security and scalability, we created our own compiler for different languages.

### 3. User Experience
- **Intuitive Interface**: Designed for ease of use, even for first-time users.
- **Customization**: Users can set their preferences for language, shortcuts, and formatting.

## Additional Features
- **Syntax Highlighting & Auto-completion**: Enhance the coding experience with a responsive and intelligent editor.
- **User Profiles**: Track progress with statistics like problems solved, accuracy, streaks, achievements, and badges.
- **Multiple Languages**: Users can code and compile in multiple languages.
- **User Statistics**: Analyze performance on the platform.
- **Competitive Programming**: Compete with fellow programmers to improve performance.
- **Input / Output File Uploads and Downloads**: Upload test cases as a file and download the outputs.
- **Custom Contest Creation**: Create custom contests.
- **Customization Options**: Configure coding environment settings.
- **Global Leaderboards**: Showcase the top performers across the platform.
- **Dark Mode**: A visually appealing dark theme for comfortable coding.

## Why Choose This Platform?
This platform is not just functional but also enjoyable to use. It blends high performance, robust security, and a seamless user experience to create a coding environment that you’ll love. Every feature has been thoughtfully designed to ensure that your journey from a beginner to a full-stack developer is both challenging and rewarding.

## Getting Started

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/online-coding-platform.git
   cd online-coding-platform
   ```

2. **Install Dependencies**
   Navigate to both the frontend and backend directories and install the required dependencies.
   ```bash
   cd hackex-client
   npm install
   cd ../hackex-server
   npm install
   cd ../hackex-compiler
   npm install
   ```

3. **Run the Backend Server**
   In the `hackex-server` and `hackex-compiler` directory, start the server and compiler:
   ```bash
   npm start
   ```

6. **Run the Frontend Server**
   Open a new terminal, navigate to the `hackex-client` directory, and start the React development server:
   ```bash
   npm run dev
   ```

7. **Access the Platform**
   Open your browser and navigate to `http://localhost:5173` to start using the platform.
   The server runs at `http://localhost:3000`.
   The compiler runs at `https://localhost:8000`.

## Contributors
- **Kshitij Gupta**
- **Akshitha Mittapally**
- **Harsh Dalwadi**
