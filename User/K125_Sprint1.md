
# K125 Sprint 1 Summary

### Change Log

| Date       | Version | Description                                                                                  | Author  |
| ---------- | ------- | -------------------------------------------------------------------------------------------- | ------- |
| 2025-11-15 | 1.01.3  | Initial version                                                                              | Austin |
## 1. Layout

### 1.1 Global Styling & Components
*   **Theme:** Implement a Light/Dark mode toggle button on all webpages.
*   **Density:** Utilize a smaller font size and reduced padding/margins across the entire website to maximize data display.
*   **Color Scheme:**
    *   **Bullish:** Red
    *   **Bearish:** Green

### 1.2 Sidebar Navigation
*   **Target List:** A collapsible menu item (with arrow indicator) that expands to reveal a list of 6 targets.
*   **Chart Framework Menu:** A collapsible menu item (with arrow indicator) that expands to offer 8 chart layout options:
    *   1x1, 1x2, 1x3, 2x2, 2x3, 3x1, 3x2, 3x3
*   **Chart Interactivity:**
    *   Right-clicking on any chart will open a context menu with a "Settings" option, leading to a detailed configuration dialog.
    *   All chart widgets must be resizable by dragging their edges or corners.

### 1.3 Dashboard
*   **Data Grid:** Displays stock data with a default column sequence:
    `Stock, Price, Change, Volume, Vol Value, Phase, D2 Pvcnt, W2 Pvcnt, W2, W10, W26, Indicators`
*   **Column Definitions:**
    *   **D2/W2 Pvcnt (Pivot Count):** Tracks trend reversals (+1 for uptrend, -1 for downtrend).
    *   **Weekly MAs:** W2 replaces MA10, W10 replaces MA50, W26 replaces MA132.
*   **Sorting:** The columns `Stock, Price, Change, Volume, Vol Value, Phase, D2 Pvcnt, W2 Pvcnt` must be sortable (ascending/descending).
*   **Indicators Panel:**
    *   **SAR+Dot Count:** Displayed as Low (red) and High (green) dot count with tiny directional arrows.
    *   **XO/XU (Crossover/Crossunder):** Displays three specific crossover types with a format showing the bars since the event (e.g., `W02XO10 5`).
        *   W02XO10 / W02XU10
        *   W02XO26 / W02XU26
        *   W10XO26 / W10XU26

### 1.4 Default Chart Page
*   **Trigger:** Opened by clicking on any stock item in the dashboard.
*   **Components:**
    *   A "Chart Assist Table" is displayed above the chart widget.
    *   Default view includes both Daily and Weekly chart "folders."


*   **Chart Assistant Table:**

| B1     | W26   D132 | W10 D50 | W2 D10 | W2 x W10 D10 x D50 | W2xW26 D10xD132 | W10xW26 D50xD132 | SAR dot count | W2 pvcnt D2 pvcnt |
| ------ | -------- | ------- | ------ | ------------------ | --------------- | ---------------- | ------------- | ----- |
| Weekly |          |         |        |                    |                 |                  |               |       |
| Daily  |          |         |        |                    |                 |                  |               |       |
---

*   **Chart Assistant Table Description:**
    * Moving average fields show data with slope uptrend or downtrend arrow
    - Cross fields show the latest cross over count (+) or cross under count (-).
    - SAR dot count will show both weekly or daily bullish (+) or bearish (-) count since SAR dot turning point.
    - W2 pvcnt or D2 pvcnt fields will show W2 or D2(MA2) moving average pivot count.
    - The top left field shows the phase.



*   **Widget Controls (Top Right):**
    1.  **Divide Button:** Creates dual charts includes Daily and Weekly tabs/folders.
    2.  **Link to Sidebar Button:** Connects widget to a sidebar chart item.
    3.  **Full Page Button**
    4.  **Close Widget Button**
*   **Interactivity:**
    *   Right-click context menu with "Settings" for chart details.
    *   Chart widgets are resizable by dragging edges or corners.

## 2. Function
*   Core functions for Sprint 1 are UI-only placeholders (To be built in future sprints).

*(Note: Specific functional requirements were not detailed in the provided text and are TBD).*