# Angular Code Smells — Usage Guide

This guide explains how to run the **Angular Code Smells** checker and how to start the **Spartan application**. Follow the steps based on your operating system.

---

# 🚀 How to Run the Code Smell Checker

## 1. Navigate to the Tool Directory

From the project root, run:

```bash
cd angular-code-smells
```

---

## 2. Execute the Smell Checker

The tool scans the specified project directory and outputs the results into `./data/result.txt`.

### **Windows**

```bash
npx tsx lib/index.ts "./../spartan/apps/app/src" >> ./data/result.txt
```

### **macOS / Linux**

```bash
npx tsx lib/index.ts './../spartan/apps/app/src' >> ./data/result.txt
```

### 📄 Output

The generated report will be available at:

```
angular-code-smells/data/result.txt
```

---

# 🧩 Running the Spartan Application

## 1. Requirements

Make sure you have **PNPM** installed:

* [https://pnpm.io/installation](https://pnpm.io/installation)

---

## 2. Install Dependencies

```bash
pnpm install
```

---

## 3. Start the Application

```bash
pnpm run dev
```

The application will be available at:

```
http://localhost:4200
```

---

# 📦 Summary

* Run the smell checker from the `angular-code-smells` directory.
* Output is stored in `data/result.txt`.
* Spartan app uses **PNPM** and runs on **localhost:4200**.

If you want, I can also generate a version with code fences, UI badges, emojis removed, or a more formal style.
