# **sti-extra-react**  

A React Storybook UI Components library that extends the core **EPFL Elements React** library.  

## Overview  

`sti-extra-react` provides additional UI components, including **visualization and Excel-related components**, that are **not part of the core EPFL Elements library**. These components were initially developed for an internal **STI tool** and later generalized in the [`@epfl-sti/epfl-elements-rf`](https://www.npmjs.com/package/@epfl-sti/epfl-elements-rf) package.  

By using this library alongside `@epfl-sti/epfl-elements-rf`, you get all the necessary components to replicate the functionality of the internal STI tool.  

---

## **Requirements**  

Ensure your application has **React (v16 or later)** installed. This library has been tested successfully with projects created using:  

```sh
npm create vite@latest
```

(Supports both JavaScript and TypeScript.)  

---

## **Exploring the Library**  

The easiest way to explore the available components is by running **Storybook** locally:  

### **Run Locally**  

1. Clone this repository:  

   ```sh
   git clone https://github.com/epfl-sti/sti-extra-react.git
   cd sti-extra-react
   ```

2. Install dependencies:  

   ```sh
   npm install
   ```

3. Start Storybook:  

   ```sh
   npm run storybook
   ```

This will launch a Storybook server on **`http://localhost:6006/`**, where you can preview available components and view documentation on how to use them.  

---

## **Installation**  

To use `sti-extra-react` in your project, install it via NPM:  

```sh
npm install @epfl-sti/sti-extra-react
```

---

## **License**  

This project is licensed under the **Apache 2.0** license.  

## **Author**  

Juan Convers (juan dot convers at epfl dot ch).

