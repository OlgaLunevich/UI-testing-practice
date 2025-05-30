# Test Automation Framework – 23-HR-JS2 Practice

This project demonstrates UI test automation for https://demoqa.com using Playwright, based on real-world scenarios for QA practice and education.

## Target Site
Testing is done on various interactive components of the DemoQA web application, including:
* Alerts
* Forms
* Text boxes
* Tooltips
* Dropdowns

## Prerequisites
* Node.js v18+ (v22 recommended)
* npm or yarn
* Google Chrome and Mozilla Firefox installed
* Git for version control

## Installation
### 1. Clone the repository:

      git clone https://github.com/OlgaLunevich/UI-testing-practice.git
      cd UI-testing-practice
### 2. Install dependencies:
      npm install
### 3. Install Playwright browsers:
      npx playwright install --with-deps

## How to Run Tests
### Run all tests in headless mode (default):
      npm test
### Run tests visually (with browser GUI):
      npx playwright test --headed
### Run Playwright tests' window:
    npx playwright test --ui
### Run tests with a specific screen resolution and browser:
      npx playwright test --project=chromium
Projects Names:
* Chrome-1920x1080
* Chrome-1366x768
* Firefox-1920x1080
* Firefox-1366x768

### Run with filtering and flags:
      npx playwright test --grep "form/positive" --project=Firefox-1366x768
* --grep "form/positive" – run tests that match a keyword
* --project="firefox" – run tests in specific browser (see playwright.config.js)
* --workers=2 – run tests in parallel (2 workers)
* --headed – run with visible browser

## Project Structure
/tests         – All test cases

src/pageObjects   – Page Object Model classes

src/helpers       – Utility classes and setup logic

/playwright.config.js – Main Playwright configuration

/.github/workflows/playwright.yml – CI pipeline (GitHub Actions)

## Technologies Used
* Playwright
* Fakerator
* GitHub Actions (CI/CD)

## CI/CD
* GitHub Actions automatically runs UI tests:
   * On push and pull requests to branches: main, master, ui-tests
   * Daily at 20:00 UTC
* Artifacts (HTML test reports) are uploaded after each run

## Test Reports
After each test run, Playwright generates a report:
* Local: playwright-report/index.html
* CI Artifacts: Stored in GitHub Actions (see run details)

To open the local report:

      npx playwright show-report
## Collaborators & Access
Repository is public.

