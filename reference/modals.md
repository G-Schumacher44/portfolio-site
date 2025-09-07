⸻

### Analyst Resource Hub — Executive Summary

#### System Summary
The **Analyst Resource Hub** is a curated, skimmable knowledge base that organizes **checklists, decision cards, templates, playbooks, and copy-ready snippets** across Python, SQL, and analytics workflows. It’s built to speed up real-world work—from first pass validation to clean hand-offs—by favoring action over theory and emphasizing fast recall.

#### Tech Stack
- **Format**: Obsidian Markdown → **MkDocs** static site  
- **Documentation**: MkDocs (Material theme)  
- **Core Tools**: Python, SQL, YAML snippets, Jupyter  
- **Artifacts**: Checklists, decision cards, templates, playbooks, reference snippets  
- **Hosting**: GitHub Pages (static docs)  
- **AI Tools**: ChatGPT-4o, Gemini CLI, Gemini 2.5 Pro, Gemini Code Assist  

#### Problems & Solutions
Data teams routinely **re-invent the wheel**—hunting for old snippets, re-writing validation steps, or duplicating EDA scaffolds. This creates **inconsistent hygiene, slow onboarding, and knowledge silos**.  

The Resource Hub solves this by:  
- Providing **ready-to-use scaffolds** for validation, EDA, outliers, duplicates, and reporting  
- Enforcing **consistent workflows** with shared checklists and decision cards  
- Improving **speed and quality** with versioned docs and clear hand-offs  

#### Task and Purpose
This project started as a way to learn Markdown, built from notes created while completing Google’s **Data Analytics certifications**. It evolved into the foundation for the **Analyst Toolkit package**, designed to serve as a working resource to help create repeatable workflows and create better practices.


#### Future State
- Porting the Resource Hub into **Google’s NotebookLM**  
- Developing a **mobile-friendly version** for iPad and phone use  
- Welcoming **community contributions** (fork and submit)  

#### Links
- **Browse the Hub:** https://g-schumacher44.github.io/  

⸻

### SQL Stories Ecosystem — Executive Summary

#### System Summary
The **SQL Stories Ecosystem** began as a simple experiment: take a dataset and tell five “stories.” Each story was designed to improve my SQL skills and simulate how real workflows function.  

It has since grown into a full ecosystem for **synthetic data generation, analysis, and storytelling**, teaching me lessons in **data generation, database management, and data governance** along the way.

#### Tech Stack
- **Core Tools**: Python, SQL, SQLite, Jupyter Notebooks  
- **Data Generation**: Custom Python/YAML config engine  
- **Analysis Environment**: SQL views, cohort analysis, profitability and returns studies  
- **Documentation**: Markdown  
- **Artifacts**: Executable notebooks, dashboards, exports, synthetic datasets  
- **AI Tools**: ChatGPT-4o, Gemini 2.5 Pro, Gemini CLI, Gemini Code Assist, Codex  

#### Problems & Solutions
Learning SQL from toy datasets feels disconnected from real practice—**too clean, too small, too shallow**.  

The Ecosystem addresses this by:  
- Generating **synthetic but realistic datasets**  
- Framing projects as **business-driven case studies**  
- Supporting **hands-on SQL, database design, and QA practice**  

#### Task and Purpose
I built this to connect my **operations background with data storytelling**. Each dataset and notebook tells a story—why customers churn, why returns spike, or where profits are leaking. It is both a **sandbox for me** and a **resource for others**.

#### Future State
- **Story 2**: Website A/B testing and funnel optimization  
- **Story 3**: Inventory audits and operational diagnostics  
- Cloud integration with **BigQuery**  
- Expanded **messiness injection** for advanced practice  

#### Links
- **Portfolio Showcase:** https://www.garrettschumacher.com/  
- **Repository (Engine & Lab):** [GitHub link here]  

⸻

### Analyst Toolkit — Executive Summary

#### System Summary
The **Analyst Toolkit** is a modular package designed to streamline data prep, diagnostics, and validation workflows. It centralizes ETL routines, validation, duplicate/outlier detection, and export utilities into a reusable system that runs in Jupyter or via CLI.

#### Tech Stack
- **Core Tools**: Python, Pandas, YAML  
- **Pipelines**: Config-driven ETL and diagnostics flows  
- **Validation**: Schema checks, null handling, data type enforcement  
- **Diagnostics**: Outlier detection, duplicate flagging, profiling reports  
- **Exports**: Clean CSVs, HTML reports, notebook-ready artifacts  
- **Documentation**: Markdown + MkDocs  
- **AI Tools**: ChatGPT-4o, Gemini Code Assist, Codex  

#### Problems & Solutions
Analysts often rebuild the same cleaning steps, leading to **inconsistent results and wasted effort**.  

The Toolkit solves this by:  
- Providing **config-driven pipelines**  
- Centralizing **diagnostics and validation** routines  
- Supporting both **exploratory analysis** and **production runs**  

#### Task and Purpose
Built to enforce **hygiene and repeatability** across projects. It grew from snippets into a package with pipelines and logging, now serving as a **foundation for my analytics workflow**.

#### Future State
- Cloud database integrations (BigQuery, Snowflake)  
- Expanded profiling (bias checks, feature drift)  
- Automated stakeholder-ready report builders  
- A CLI wizard for spinning up projects  

#### Links
- **Repository:** [GitHub link here]  
- **Deployment Utility:** [GitHub link here]  
- **Starter Kit (Deployable Zip):** [GitHub link here]  
- **Pipeline Demo (HTML, static):** [link here]  
- **Modular Workflow Demo (HTML, static):** [link here]  

⸻

### Analyst Toolkit: Deployment Utility — Executive Summary

#### System Summary
A lightweight companion that packages Toolkit pipelines for quick deployment, moving workflows from dev to production.  

#### Tech Stack
- **Core Tools**: Python, YAML  
- **Functions**: Packaging, deployment, config management  
- **Artifacts**: Ready-to-run builds  

#### Purpose
Created for **portability and reproducibility**, enabling faster setup in demos or client environments.  

#### Links
- **Repository:** [GitHub link here]  

⸻

### Analyst Toolkit: Starter Kit — Executive Summary

#### System Summary
A pre-packaged, deployable zip of the Analyst Toolkit with configs and sample data for instant setup.  

#### Tech Stack
- **Core Tools**: Python, YAML, CLI  
- **Functions**: Pre-bundled Toolkit modules + configs  
- **Artifacts**: Deployable `.zip` package  

#### Purpose
Built for **accessibility and speed**—ideal for onboarding and quick tests.  

#### Links
- **Download:** [GitHub release link here]  

⸻

### Model Evaluation Suite — Executive Summary

#### System Summary
The **Model Evaluation Suite** standardizes ML benchmarking with YAML-driven configs, automated evaluation, and export-ready reports. It ensures **consistent, reproducible, and transparent** model validation in both Jupyter and CLI.

#### Tech Stack
- **Core Tools**: Python, scikit-learn, Pandas, YAML  
- **Validation**: MLflow for experiment tracking  
- **Explainers**: SHAP, permutation importance, feature diagnostics  
- **Visualization**: ROC/PR curves, lift charts, calibration curves  
- **Exports**: HTML reports, static charts, serialized artifacts  
- **Documentation**: Markdown + MkDocs  
- **AI Tools**: ChatGPT-4o, Gemini 2.5 Pro, Gemini CLI, Codex  

#### Problems & Solutions
Model evaluation is inconsistent across teams. This suite solves it by:  
- Standardizing pipelines via YAML  
- Automating diagnostics and plots  
- Integrating explainability tools  
- Exporting shareable reports  

#### Task and Purpose
The **Model Evaluation Suite** was created to unify my model validation workflow into a **reproducible, consistent system**.  

It began as **Module 9 of the Analyst Toolkit package**, and has since evolved into a **standalone API**. The project is still in its **beta stage**, and I welcome feedback and contributions as I continue refining and expanding its capabilities.

#### Future State
- **Multi-target & multi-model support** — expand beyond single-output cases to handle multi-output regression/classification and side-by-side model comparisons  
- **Fairness & bias diagnostics** — integrate expanded checks for demographic parity, disparate impact, and explainability  
- **Cloud ML pipeline integration** — seamless deployment hooks for Vertex AI, SageMaker, and other managed ML platforms  
- **Interactive dashboard mode** — deliver evaluation results in a live, explorable format for both technical teams and business stakeholders

#### Links
- **Repository:** [GitHub link here]  
- **Workflow Demo (HTML, static):** [link here]  
- **Sample Charts (HTML, static):** [link here]  
- **Sample Reports (HTML, static):** [link here]  

⸻

### Dirty Birds Data Generator — Executive Summary

#### System Summary
The **Dirty Birds Data Generator** simulates penguin tagging data for analysis, QA, and modeling. It extends Palmer Penguins with realism: randomness, messiness injection, and sight–resight logic.

#### Tech Stack
- **Core Tools**: Python, Pandas, YAML  
- **Data Generation**: Randomization, resight events, messiness profiles  
- **Artifacts**: Synthetic CSVs for EDA and modeling  
- **Documentation**: Jupyter notebooks  
- **AI Tools**: ChatGPT-4o, Gemini Code Assist  

#### Problems & Solutions
Ecological data is messy, limited, or unavailable. This generator solves that by:  
- Producing **synthetic tagging datasets**  
- Modeling **sight–resight behavior**  
- Enabling **teaching, QA, and prototyping**  

#### Task and Purpose
Started as a playful riff on Palmer Penguins, it evolved into a project for exploring **data simulation and reproducibility**.

#### Future State
- Add more **species templates**  
- Sophisticated messiness (sensor errors, missing bands)  
- Multi-year study simulations  

#### Links
- **Repository:** [GitHub link here]  
- **Download Dataset:** [link here]  

⸻

### Case Study: Request from the VP of Sales — Executive Summary

#### System Summary
A simulated **executive request** to uncover revenue leakage and churn patterns. SQL time series analysis surfaces refunds, churn, and return-related risks.

#### Tech Stack
- **Core Tools**: SQL, Python  
- **Visualization**: Looker Studio  
- **Artifacts**: Queries, dashboard  

#### Problems & Solutions
Revenue leakage often hides in transactional detail. This workflow solves it with:  
- SQL time series analysis  
- Quantified loss from returns & churn  
- Dashboard-ready insights  

#### Task and Purpose
Built as an **executive-facing case study** showing SQL-driven business insights.  

#### Future State
- Predictive churn signals  
- Category & regional drill-downs  
- Scenario modeling  

#### Links
- **Case Study:** [GitHub link here]  
- **Dashboard:** [Looker Studio link here]  

⸻

### Case Study: SQL Stories – Inventory Audit — Executive Summary

#### System Summary
This study analyzes **inventory inefficiencies** in a simulated retailer. It identifies locked capital, high returns, and under-utilization.

#### Tech Stack
- **Core Tools**: SQL, Python  
- **Artifacts**: SQL queries, notebooks, Google Sheets workbook  

#### Problems & Solutions
Capital is tied up in slow-moving or returned stock. Solved by:  
- Identifying high-return/low-turnover products  
- Quantifying locked capital  
- Delivering a workbook for exploration  

#### Task and Purpose
Modeled on real analyst workflows, this case study shows how inventory analysis ties directly to financial outcomes.  

#### Future State
- Forecasting logic  
- Profitability vs. return rates  
- Dashboard-ready exports  

#### Links
- **Case Study:** [GitHub link here]  
- **Workbook:** [Google Sheets link here]  

⸻

### Case Study: SQL Stories – Customer Retention — Executive Summary

#### System Summary
Explores **customer retention dynamics** using cohort analysis. Focuses on churn, repeat purchases, loyalty programs, and marketing effectiveness.

#### Tech Stack
- **Core Tools**: SQL, Python  
- **Artifacts**: Cohort queries, Jupyter notebooks  

#### Problems & Solutions
Churn is costly but hard to pinpoint. Solved by:  
- Cohort analysis over time  
- Measuring loyalty program gaps  
- Framing results as data stories  

#### Task and Purpose
Shows how **SQL + cohort analysis** can uncover patterns in customer engagement and churn.  

#### Future State
- Predictive churn models  
- Demographic segmentation  
- Loyalty program scoring  

#### Links
- **Case Study:** [GitHub link here]  
- **Notebook (HTML):** [link here]  