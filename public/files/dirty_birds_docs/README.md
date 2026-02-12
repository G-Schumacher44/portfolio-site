<file name=0 path=/Users/garrettschumacher/Documents/git_repos/dirty_birds_data_generator/README.md><p align="center">
  <img src="img/dirty-birds-generator.png" width="1000"/>
  <br>
  <em>Palmer Penguins Data Generator + QA Framework</em>
</p>

<p align="center">
  <img alt="Python Version" src="https://img.shields.io/badge/python-3.8+-blue.svg">
  <img alt="MIT License" src="https://img.shields.io/badge/license-MIT-blue">
  <img alt="Status" src="https://img.shields.io/badge/status-alpha-lightgrey">
  <img alt="Version" src="https://img.shields.io/badge/version-v0.4.0-blueviolet">
</p>

---

# 🐧 Dirty Birds Data Generator

Dirty Birds is a synthetic data generator that simulates penguin tagging and monitoring programs for ecological analysis, QA testing, and model prototyping. The generator includes customizable randomness, optional messiness injection, and supports resight logic to mimic longitudinal tracking studies.



___


## 🧩 TLDR;

Dirty Birds is a lightweight, standalone synthetic data generator built for ecological modeling, QA pipelines, and AI-assisted analytics workflows.

Dirty Birds simulates a realistic penguin tagging and monitoring study with:

- Species-specific modeling for **Adélie**, **Chinstrap**, and **Gentoo** penguins  
- **Biologically-informed randomness** based on peer-reviewed morphometrics  
- **Temporal logic** that mirrors real-world field conditions (tagging, resight windows, clutch dates)  
- **Clean mode** for generating analysis-ready, complete datasets  
- **Messy mode** with controlled missingness, resight overlaps, and field-style anomalies  
- **Stress-testing support** for pipelines and ML models under realistic data imperfections

🧠 Inspired by the [Palmer Penguins dataset](https://github.com/allisonhorst/palmerpenguins) — reimagined for modern workflows.

<details>
<summary> ⏯️ Quick Start</summary>
<br>

1. **Clone the repository**  
   
   ```bash
   git clone https://github.com/G-Schumacher44/dirty_birds_data_generator.git
   cd dirty_birds_data_generator
    ```

2.	**(Optional) Create a virtual environment**

    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    ```
3.	**Run the generator**

    ```bash
    # Run with default settings (moderate mess)
    python penguin_synthetic_generator_v0.4.0.py

    # Run with heavy messiness for stress-testing
    python penguin_synthetic_generator_v0.4.0.py --mess-level heavy
    ```

</details>

---

## 📐 What’s Included

This repository contains the core components for generating and testing synthetic ecological datasets, specifically focused on penguin tracking studies:

- **`penguin_synthetic_generator_v0.4.0.py`**  
  The main generator script, now with CLI arguments for easy configuration. Outputs clean and messy datasets simulating penguin tagging records, including longitudinal resight logic.

- **`tests/`**  
  A minimal `pytest` suite to validate output structure, missing values, and column integrity.

---

## 🧭 Orientation & Getting Started

<details>
<summary><strong>🧠 Design Notes from the Architect</strong></summary>
<br>
Dirty Birds was created to fill the gap between clean, curated demo datasets and the messy, complex data typical in ecological fieldwork.

The original [Palmer Penguins dataset](https://github.com/allisonhorst/palmerpenguins) is widely used for teaching and modeling, but it lacks longitudinal structure, controlled messiness, and metadata variation. Dirty Birds addresses these limitations with:

- Multi-species support (Adélie, Chinstrap, Gentoo)  
- Realistic morphometric ranges based on field data  
- Simulated tagging, resight patterns, and seasonal clutch events  
- Field-like artifacts: missing values, duplicates, partial records  
- A **tiered realism system**: from clean, analysis-ready outputs to messy, field-style datasets for pipeline testing and skill building

The goal was not just to replicate a dataset — but to simulate real-world constraints. Dirty Birds helps teams validate pipelines, stress-test models, and teach robust data practices with credible synthetic data grounded in ecological research.

</details>

</details>

<details>
<summary><strong>🫆 Version Release Notes</strong></summary>

### ✅ v0.4.0 (Current)

This version refactors the script for improved usability and robustness, introducing command-line arguments to replace hardcoded configurations.

**✨ New Features**

- **Command-Line Interface (CLI)**: The generator is now configurable via CLI arguments, making it easier to use in automated workflows and for experimentation.
  - `--mess-level`: Control the intensity of data errors (`none`, `light`, `moderate`, `heavy`).
  - `--num-penguins`: Specify the number of penguins to generate.
  - `--clean-output` / `--messy-output`: Set custom filenames for the output files.

**🛠️ Improvements**

- **Code Refactoring**: The main generation logic has been wrapped in a `main()` function and uses `argparse` for clean argument handling.
- **Bug Fixes**: Corrected a variable naming issue that caused messiness injection to operate on an incorrect DataFrame, improving stability and ensuring messiness is applied as intended.

---

<details>
<summary><strong>Past Release: v0.3.0</strong></summary>
<br>

> This version introduced significant enhancements to the data generation logic, focusing on deeper ecological realism and more complex data quality challenges.
>
> **✨ New Features**
>
> - **Clutch & Egg-Laying Logic**: Simulated clutch completion and egg-laying dates.
> - **Advanced Health Status Modeling**: Dynamically calculated health status based on body mass, colony stress, and species fragility.
> - **Longitudinal Resight Duplication**: Created "resighted" penguin records to simulate longitudinal studies.
>
> **🛠️ Improvements**
>
> - **Refined Messiness Injection**: Added more sophisticated and plausible data corruption.
> - **Ecological Weighting**: Used weighted probabilities for colony and age group assignment.
> - **Dedicated Species Missingness**: Added a function to specifically inject `NaN` values into the `species` column.
> - **Study Name Generation**: Generated `study_name` based on the capture year.

</details>

---

### 🔮 v0.5.0 (Planned)

(more robust tagging systems, yaml configuration<move to an agnostic system that can generate any species style data>)

</details>

</details> 

<details>
<summary>⚙️ Project Structure</summary>

```text
dirty_birds_data_generator/
│
├── .gitignore                  # Specifies files to be ignored by Git.
│
├── penguin_synthetic_generator_v0.4.0.py  # The core data generation script.
│
├── pytests/                      # Directory containing all tests for the project.
│   └── test_penguin_generator.py # Pytest suite to validate the generator's output.
│
├── README.md                   # This documentation file.
│
├── requirements.txt            # (Recommended) Lists Python dependencies for the project.
│
└── *.csv                       # Generated output files (ignored by .gitignore).
    ├── synthetic_penguins_v3.5_clean.csv # The clean, analysis-ready dataset.
    └── synthetic_penguins_v3.5.csv       # The messy dataset with injected errors.
```

</details>

<details>
<summary><strong>📖 Sources and References</strong></summary>

**📚 Research-Backed Design**

The generator is grounded in real-world penguin research.

I based colony sizes on published ecological studies, modeled species-specific morphometrics using real measurements, and designed the temporal structure (e.g. tag dates, egg laying, resight windows) to mirror field realities.

Even the injected messiness — like partial sex assignments, missing weights, or resight overlaps — was crafted based on documented fieldwork constraints and data collection patterns.

Behind this generator is a layer of ecological research: peer-reviewed literature, dataset audits, and tagging program documentation all informed the logic. Our goal was to build not just plausible data — but credible synthetic data.

**Sources**

- [Palmer Penguins Extended Dataset (Kaggle)](https://www.kaggle.com/datasets/samybaladram/palmers-penguin-dataset-extended)  
  *(used as a baseline dataset for structure and values across key features)*
- [Original Palmer Penguins R package](https://github.com/allisonhorst/palmerpenguins)  
  *(provided foundational variable definitions and column semantics)*
- [USAP Continental Field Manual (2024)](https://www.usap.gov/usapgov/travelAndDeployment/documents/Continental-Field-Manual-2024.pdf)  
  *(used for tag/resight timing and field logistics modeling)*
- [Adélie Penguin Breeding Census – AADC Collection #154](https://data.aad.gov.au/aadc/biodiversity/display_collection.cfm?collection_id=154)  
  *(used for colony size distributions, clutch timing patterns, and site-specific breeding variability)*
- [Ropert‑Coudert et al. (2018) – *Two Massive Breeding Failures in an Adélie Colony*](https://doi.org/10.3389/fmars.2018.00264)  
  *(used to model temporal breeding variability and extreme event scenarios)*
- [Schmidt et al. (2021) – *Sub-Colony Habitat & Reproductive Success in Adélie Penguins*](https://doi.org/10.1038/s41598-021-94861-7)  
  *(used to parameterize habitat-scale effects on nest success rates)*
- [Palmer Station Morphometric Dataset (2007–2009, EDI)](https://data.key2stats.com/data-set/view/1299)  
  *(public-domain measurements of bill length, depth, flipper length, body mass, and sex across Adélie, Chinstrap, and Gentoo penguins — used to model species-specific distributions and dimorphism)*
- [Tyler et al. (2020) – *Morphometric & Genetic Evidence for Four Gentoo Penguin Clades*](https://doi.org/10.1002/ece3.6973)  
  *(used to parameterize Gentoo body size, bill morphology, and subspecies variation)*
- [Fattorini & Olmastroni (2021) – *Morphometric Sexing in Adélie Penguins*](https://doi.org/10.1007/s00300-021-02893-6)  
  *(used to model bill length, bill depth, body mass, and sex-based morphometric differences)*

</details>

---

## ▶️ Setup 

### 📦 Dev Setup

To get the project set up for local development, follow these steps.

1.  **Prerequisites**
    - Python 3.8 or newer
    - Git

2.  **Clone the Repository**
    ```bash
    git clone https://github.com/G-Schumacher44/dirty_birds_data_generator.git
    cd dirty_birds_data_generator
    ```

3.  **Create a Virtual Environment**
    It's highly recommended to use a virtual environment to manage dependencies.
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    .\venv\Scripts\activate
    ```

4.  **Install Dependencies**
    This project uses `pandas` and `numpy`. Create a `requirements.txt` file (if it doesn't exist) with the following content, then run the `pip install` command from your activated virtual environment.
    ```txt
    pandas
    numpy
    ```
    ```bash
    pip install -r requirements.txt
    ```

___

### ▶️ CLI Usage

The generator is controlled via command-line arguments, allowing for easy customization without editing the script.

#### Basic Execution

To run the script with its default configuration (`moderate` mess, 4500 penguins), simply execute the Python file:

```bash
python penguin_synthetic_generator_v0.4.0.py
```

This will generate `synthetic_penguins_v3.5_clean.csv` and `synthetic_penguins_v3.5.csv`.

#### Command-Line Arguments

You can customize the output using the following arguments. For a full list, run `python penguin_synthetic_generator_v0.4.0.py --help`.

| Argument | Description | Default | Example |
|---|---|---|---|
| `--mess-level` | Sets the intensity of injected errors. | `moderate` | `heavy` |
| `--num-penguins` | Sets the base number of penguins to generate. | `4500` | `100` |
| `--duplicate-rate` | Sets the proportion of tagged penguins to resight. | `0.45` | `0.75` |
| `--species-missing-rate` | Sets the proportion of records with missing species. | `0.03` | `0.1` |
| `--mislabel-rate` | Proportion of records to create as mislabeled duplicates. | `0.0` | `0.02` |
| `--clean-output` | Specifies the filename for the clean data. | `synthetic_penguins_v3.5_clean.csv` | `clean_data.csv` |
| `--messy-output` | Specifies the filename for the messy data. | `synthetic_penguins_v3.5.csv` | `messy_data.csv` |

**Examples:**

1.  **Generate a dataset with heavy messiness and a high resight rate:**
    ```bash
    python penguin_synthetic_generator_v0.4.0.py --mess-level heavy --duplicate-rate 0.8
    ```

2.  **Generate a small, clean test dataset for quick validation:**
    ```bash
    python penguin_synthetic_generator_v0.4.0.py --num-penguins 100 --mess-level none
    ```

## 🧪 Testing and Validation Guide

This project includes a comprehensive testing framework to ensure the integrity and quality of the synthetic data. Running these tests is highly recommended, especially after making changes to the configuration or generating new datasets.

<details>
<summary>🎯 Test Objectives</summary>


</details>  

<details>
<summary>🛠️ Running the Tests</summary>


</details>

___

## 🤝 On Generative AI Use

Generative AI tools (Gemini 2.5-PRO, ChatGPT 4o - 4.1) were used throughout this project as part of an integrated workflow — supporting code generation, documentation refinement, and idea testing. These tools accelerated development, but the logic, structure, and documentation reflect intentional, human-led design. This repository reflects a collaborative process: where automation supports clarity, and iteration deepens understanding.

---

## 📦 Licensing

This project is licensed under the [MIT License](LICENSE).</file>
