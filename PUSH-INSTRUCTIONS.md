# Pushing Smart Dry Eye Screening Tool to GitHub & Resolving Git Path Issues

Due to a Windows environment restriction on terminal command execution (sandboxing is not supported directly in the agent's command tool on Windows), I cannot execute terminal commands directly on your system. 

Below is the complete guide to pushing your code and resolving the **`exec: "git": executable file not found in %PATH%`** error that is currently blocking your IDE's worktree operations.

---

## 🛠️ Part 1: Resolving the `git: executable file not found` Error

This error occurs because the IDE/copilot system cannot find the Git command-line tool in your Windows system environment variables (`%PATH%`).

### Step 1: Check if Git is installed
If you don't have Git installed on your Windows machine:
1. Download Git for Windows from **[git-scm.com](https://git-scm.com/)**.
2. Run the installer.
3. **Crucial:** In the "Adjusting your PATH environment" screen, make sure **"Git from the command line and also from 3rd-party software"** is selected (this is the default and adds it to `%PATH%` automatically).

### Step 2: Add Git to your `%PATH%` manually (If already installed)
If Git is installed but not recognized:
1. Press `Win + R`, type **`sysdm.cpl`**, and press **Enter** to open System Properties.
2. Go to the **Advanced** tab and click **Environment Variables** (at the bottom).
3. In the **System variables** (or User variables) section, locate the variable named **`Path`**, select it, and click **Edit**.
4. Click **New** and paste the path to your Git command directory. Typical paths include:
   * `C:\Program Files\Git\cmd` (Standard 64-bit installation)
   * `C:\Program Files (x86)\Git\cmd` (32-bit installation)
   * `C:\Users\<YourUsername>\AppData\Local\Programs\Git\cmd` (User-only installation)
5. Click **OK** on all windows to save the changes.
6. **Restart your IDE / VS Code** and terminal for the path changes to take effect.

---

## 🧹 Part 2: Resolving Uncommitted Changes Blocking the Merge

Once Git is working in your `%PATH%`, the IDE should be able to manage the worktree. However, if uncommitted changes in your main workspace are still blocking the merge, you can resolve this manually in your terminal:

### Option A: Save your changes for later (Recommended)
If you have work in the main workspace that you don't want to lose, you can **stash** them temporarily:
```powershell
# Navigate to the project directory
cd "C:\Users\reddy\OneDrive\文件\Custom Office Templates\smart-dry-eye-screening"

# Stash changes (moves them to a temporary draft area)
git stash

# Try retrying the worktree checkout/merge now!

# Optional: To bring your changes back later, run:
git stash pop
```

### Option B: Discard all local changes (Caution: Destructive)
If you do not care about any local modifications in the main workspace and want a clean slate:
```powershell
# Navigate to the project directory
cd "C:\Users\reddy\OneDrive\文件\Custom Office Templates\smart-dry-eye-screening"

# Discard all uncommitted changes in tracked files
git checkout -- .

# Clean untracked files and directories
git clean -fd
```

---

## 🚀 Part 3: Pushing the Code to GitHub

Once Git is working and the workspace is clear, you can push the codebase using the pre-configured automated script:

1. Open your Windows **File Explorer** and go to:
   `C:\Users\reddy\OneDrive\文件\Custom Office Templates\smart-dry-eye-screening`
2. **Double-click** on **`push-to-github.bat`**.
3. A command prompt window will open and execute everything automatically. If prompted by your browser or terminal, log in/authorize your GitHub account (`venutejareddy491-prog`).

---

> [!IMPORTANT]
> **Before pushing**, make sure you have created an empty repository named **`eye-screening-tool`** on your GitHub account (`venutejareddy491-prog`) by visiting [github.com/new](https://github.com/new). Leave the repository empty (do not check README, .gitignore, or license boxes).
