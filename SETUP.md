# Deltacode POC - Local Development Setup

 ## Prerequisites

 Make sure the following tools are installed:

 - **Node.js** - preferably the current LTS release
- **npm** - included with Node.js
- **Git** - required to clone the repository

---

 ## 1\. Install Node.js

 Download Node.js from the official website:

 https://nodejs.org/en/download

 It is recommended to use the **LTS** version.

 ### If administrator access is required to install

 If you do not have administrator privileges to install Node.js:

 1. Download the **ZIP/binary package** from the official Node.js website.
2. Extract the ZIP file to a location where you have access, for example:

   ```
   C:\Tools\nodejs
   ```
3. Add the extracted Node.js directory to your **User PATH** environment variable.

 ### Add Node.js to PATH on Windows

 1. Open **Start** and search for **Environment Variables**.
2. Select **Edit environment variables for your account**.
3. Click **Environment Variables**.
4. Under **User variables**, select `Path`.
5. Click **Edit** → **New**.
6. Add the path to the extracted Node.js directory, for example:

   ```
   C:\Tools\nodejs
   ```
7. Click **OK** to save the changes.
8. Close and reopen your terminal.

 > **Important:** After modifying the PATH variable, open a new terminal before running the commands below.

---

 ## 2\. Verify Node.js and npm

 Open a new terminal and run:

```
node -v
npm -v
```

 Both commands should return a version number.

 For example:

```
v24.x.x
11.x.x
```

 If either command returns **"not recognized"** or **"command not found"**, verify that the Node.js installation directory has been added correctly to your PATH.
 
 If **npm** does not work correctly on Windows, try using **npm.cmd** instead:**

 ## Quick Setup

 Once Node.js and Git are installed, run the below commands:

```
git clone https://github.com/dc-akash/deltacode-poc.git
cd deltacode-poc
npm install
npm run dev
```