# penguin_synthetic_generator_v0.4.0.py

# Version: v0.4.0

import numpy as np
import pandas as pd
import random
from datetime import datetime, timedelta
import argparse

# === Configuration ===
N_PENGUINS = 4500
TAGGED_PERCENTAGE = 0.65
COLONIES = {
    'Biscoe West': 'Biscoe',
    'Dream South': 'Dream',
    'Torgersen North': 'Torgersen',
    'Cormorant East': 'Cormorant',
    'Shortcut Point': 'Shortcut'
}
SPECIES_INFO = {
    'Adelie': {'bill_mean': 38.8, 'bill_sd': 2.7, 'bill_depth_mean': 18.4, 'bill_depth_sd': 1.5, 'flipper_mean': 190, 'flipper_sd': 6.5, 'mass_mean': 3700, 'mass_sd': 300},
    'Chinstrap': {'bill_mean': 48.8, 'bill_sd': 3.3, 'bill_depth_mean': 18.5, 'bill_depth_sd': 1.6, 'flipper_mean': 196, 'flipper_sd': 7, 'mass_mean': 3700, 'mass_sd': 320},
    'Gentoo': {'bill_mean': 47.5, 'bill_sd': 3.0, 'bill_depth_mean': 14.8, 'bill_depth_sd': 1.2, 'flipper_mean': 217, 'flipper_sd': 6, 'mass_mean': 5000, 'mass_sd': 400}
}
AGE_GROUPS = ['Chick', 'Juvenile', 'Adult']
SEXES = ['Male', 'Female']

# === Helper Functions ===
def generate_tag(species, tag_counters):
    """Generates a unique tag ID for a penguin and increments the species counter."""
    species_prefix = {'Adelie': 'ADE', 'Chinstrap': 'CHN', 'Gentoo': 'GEN'}[species]
    number = tag_counters[species]
    tag_counters[species] += 1
    return f"{species_prefix}-{number:04d}"

def random_capture_date():
    # Set seeds here if needed for this specific function, but global is fine for now.
    """
    Generates a biologically plausible capture date between October 2019 and December 2024,
    respecting austral summer field season boundaries.
    """
    season_start = datetime(2019, 10, 1)
    season_end = datetime(2024, 12, 31)
    delta_days = (season_end - season_start).days
    random_offset = random.randint(0, delta_days)
    return season_start + timedelta(days=random_offset)

def inject_mess(df, mess_level='moderate'):
    """
    Injects controlled 'messiness' into the dataset to simulate real-world field data issues.
    This function is refactored to be more organized and efficient.
    """
    if mess_level == 'none':
        return df

    n = len(df)
    error_rates = {'light': 0.03, 'moderate': 0.08, 'heavy': 0.15}
    error_rate = error_rates.get(mess_level)
    if error_rate is None:
        raise ValueError("Invalid mess_level. Choose from 'none', 'light', 'moderate', 'heavy'.")

    print(f"Injecting {mess_level} level of mess into the dataset... (error rate: {error_rate})")
    df_messy = df.copy()

    # 1. Inject Missing Values (NaNs)
    cols_for_nans = [
        'bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g',
        'study_name', 'clutch_completion', 'health_status', 'capture_date',
        'colony_id', 'island'
    ]
    for col in cols_for_nans:
        mask = np.random.rand(n) < error_rate
        df_messy.loc[mask, col] = np.nan

    # 2. Corrupt Categorical and String Data
    # Sex
    mask = np.random.rand(n) < error_rate
    df_messy.loc[mask, 'sex'] = np.random.choice(['M', 'F', '', None, 'Unknown', '?', 'N/A'], size=mask.sum())
    # Species
    species_typos = {'Adelie': 'adeleie', 'Chisntrap': 'chisntrap', 'Gentoo': 'Gentto'}
    mask = np.random.rand(n) < error_rate
    df_messy.loc[mask, 'species'] = df_messy.loc[mask, 'species'].apply(lambda x: species_typos.get(x, x))
    # Colony ID
    mask = np.random.rand(n) < error_rate
    fake_colonies = ['Torgersen', 'Dream Island', 'Biscoe', 'Cormorant', 'Unknown', 'dream', 'biscoe 2', 'torgersen SE', 'cormorant NW', '/Shortcut', 'invalid_colony', 'TORGERSEN 4', ' short point', 'dream island']
    df_messy.loc[mask, 'colony_id'] = np.random.choice(fake_colonies, size=mask.sum())
    # Island
    mask = np.random.rand(n) < error_rate
    fake_islands = ['bisco', 'dreamland', 'torg', 'cormor', 'short cut', 'unknown', '', None]
    df_messy.loc[mask, 'island'] = np.random.choice(fake_islands, size=mask.sum())
    # Health Status
    mask = np.random.rand(n) < error_rate
    health_typos = ['Healthy', 'Unwell', 'Critically Ill', 'critcal ill', 'under weight', 'Overwight', 'ok', 'N/A', '', None]
    df_messy.loc[mask, 'health_status'] = np.random.choice(health_typos, size=mask.sum())
    # Age Group
    mask = np.random.rand(n) < error_rate
    age_typos = ['Chick', 'Juvenile', 'Adult', 'chik', 'juvenille', 'ADLT', 'unk', '', None]
    df_messy.loc[mask, 'age_group'] = np.random.choice(age_typos, size=mask.sum())
    # Study Name
    mask = np.random.rand(n) < error_rate
    fake_studies = ['PAPRI20X9', 'PAPR12021', 'PAPR2023', 'papri2024', '', None, 'N/A', 'STUDY_2022', 'PP2020']
    df_messy.loc[mask, 'study_name'] = np.random.choice(fake_studies, size=mask.sum())
    # Tag ID
    mask = np.random.rand(n) < error_rate
    df_messy.loc[mask, 'tag_id'] = df_messy.loc[mask, 'tag_id'].apply(lambda x: np.nan if pd.notnull(x) and random.random() < 0.5 else x)

    # 3. Corrupt Date Formats
    def generate_bad_date():
        error_type = random.choice(['typo', 'swap', 'missing_digit', 'nonsense'])
        if error_type == 'swap':
            return f"{random.randint(1, 28):02d}-{random.randint(1, 12):02d}-{random.choice(range(2019, 2025))}"
        elif error_type == 'missing_digit':
            return f"{random.choice([202, 2024])}-{random.randint(1, 12):02d}-{random.randint(1, 28):02d}"
        elif error_type == 'typo':
            return f"2024-{random.choice(['00', '13', '99'])}-{random.randint(1, 28):02d}"
        else:
            return random.choice(['not-a-date', '9999-99-99', 'error'])
    mask = np.random.rand(n) < error_rate
    df_messy.loc[mask, 'capture_date'] = [generate_bad_date() for _ in range(mask.sum())]

    # 4. Inject Numeric Outliers
    outlier_config = {
        'bill_length_mm':    {'spread': 0.12, 'clip': (32, 60)},
        'bill_depth_mm':     {'spread': 0.10, 'clip': (13, 21)},
        'flipper_length_mm': {'spread': 0.08, 'clip': (170, 230)},
        'body_mass_g':       {'spread': 0.12, 'clip': (2500, 6500)},
    }
    for col, config in outlier_config.items():
        mask = np.random.rand(n) < (error_rate * 0.75)  # Apply to a fraction of the error rate
        original_values = df_messy.loc[mask, col].dropna()
        if not original_values.empty:
            random_factors = np.random.normal(1, config['spread'], size=len(original_values))
            outlier_values = (original_values * random_factors).clip(lower=config['clip'][0], upper=config['clip'][1])
            df_messy.loc[original_values.index, col] = outlier_values

    return df_messy


# === Resight duplication block ===
def duplicate_penguin_rows_for_resight(df, duplicate_rate=0.45):
    """
    Simulates longitudinal resighting of tagged penguins.

    This function is designed to be more realistic by:
    1. Only selecting from penguins that have a valid `tag_id`.
    2. Making the `duplicate_rate` relative to the tagged population.
    3. Allowing multiple resights of the same individual (`replace=True`).
    4. Robustly handling resight dates to prevent dropping data.
    """
    # 1. Only consider penguins that have a tag_id for resighting.
    tagged_penguins = df[df['tag_id'].notna()].copy()
    if tagged_penguins.empty:
        print("No tagged penguins found to resight.")
        return df

    # 2. Calculate the number of resight *events* to generate.
    # `duplicate_rate` is the ratio of resight events to the number of tagged penguins.
    n_resights = int(len(tagged_penguins) * duplicate_rate)
    resight_samples = tagged_penguins.sample(n_resights, replace=True, random_state=42)

    resighted_rows = []
    for idx, row in resight_samples.iterrows():
        # 3. Simulate survival/resight chance.
        if random.random() < 0.05:  # 5% chance penguin did not survive or was not found.
            continue

        resight = row.copy()

        # 4. Robustly advance capture_date, preventing out-of-bounds dates.
        try:
            original_date = pd.to_datetime(resight['capture_date'], errors='coerce', dayfirst=True)
            if pd.notna(original_date):
                # Resight happens 1-3 years later.
                time_shift = timedelta(days=random.randint(365, 365 * 3))
                shifted_date = original_date + time_shift

                # If date exceeds study end, cap it instead of dropping the record.
                study_end_date = datetime(2024, 12, 31)
                if shifted_date > study_end_date:
                    shifted_date = study_end_date - timedelta(days=random.randint(1, 60))
                resight['capture_date'] = shifted_date.strftime('%Y-%m-%d')
        except Exception: # If original date was invalid, leave it for the resight record.
            pass

        # 5. Drift biometrics slightly for the resight record.
        for col in ['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g']:
            if pd.notnull(resight[col]):
                drift_factor = random.uniform(0.98, 1.05) # More subtle drift
                resight[col] = round(resight[col] * drift_factor, 2)

        # 6. Adjust age_group and mutate health status for the new record.
        if resight['age_group'] == 'Chick':
            resight['age_group'] = 'Juvenile'
        elif resight['age_group'] == 'Juvenile':
            resight['age_group'] = 'Adult'
        if pd.notnull(resight['health_status']):
            resight['health_status'] = random.choice(['Healthy', 'Unwell', 'Underweight', 'Overweight', 'Critically Ill'])

        resighted_rows.append(resight)

    df_augmented = pd.concat([df, pd.DataFrame(resighted_rows)], ignore_index=True)
    return df_augmented

def inject_mislabeled_duplicates(df, mislabel_rate=0.01):
    """
    Intentionally creates mislabeled duplicates to simulate data entry errors.

    This function selects a portion of records, creates a copy with the same
    tag_id and capture_date, but with slightly drifted biometric data.
    This is a controlled way to re-introduce the "same tag, same date, different data" anomaly.
    """
    if mislabel_rate == 0:
        return df

    # Only create mislabels for records that have a valid tag and date.
    valid_records = df.dropna(subset=['tag_id', 'capture_date']).copy()
    if valid_records.empty:
        return df

    n_mislabels = int(len(valid_records) * mislabel_rate)
    if n_mislabels == 0:
        return df

    print(f"Injecting {n_mislabels} mislabeled duplicate records...")
    mislabel_samples = valid_records.sample(n_mislabels, replace=True, random_state=42)

    mislabeled_rows = []
    for idx, row in mislabel_samples.iterrows():
        mislabel = row.copy()
        # Drift biometrics to create the data conflict, keeping tag_id and capture_date the same.
        for col in ['bill_length_mm', 'bill_depth_mm', 'flipper_length_mm', 'body_mass_g']:
            if pd.notnull(mislabel[col]):
                drift_factor = random.uniform(0.90, 1.10) # Wider drift to simulate entry error
                mislabel[col] = round(mislabel[col] * drift_factor, 2)
        mislabeled_rows.append(mislabel)

    return pd.concat([df, pd.DataFrame(mislabeled_rows)], ignore_index=True)

# === Helper: Inject missingness into species column ===
def inject_species_missingness(df, missing_rate=0.03):
    """
    Randomly inject missing values into the 'species' column to simulate field error.
    """
    n_rows = df.shape[0]
    n_missing = int(missing_rate * n_rows)
    missing_indices = np.random.choice(df.index, size=n_missing, replace=False)
    df.loc[missing_indices, 'species'] = np.nan
    return df

# === Data Generation ===
def main(args):
    """Main function to generate and save penguin data."""
    # Seed for reproducibility
    np.random.seed(42)
    random.seed(42)

    # Initialize state within main() to prevent issues with multiple runs in one session
    penguins = []
    tag_counters = {'Adelie': 1, 'Chinstrap': 1, 'Gentoo': 1}

    for _ in range(args.num_penguins):
        species = random.choice(list(SPECIES_INFO.keys()))
        # Use weighted random sampling across colonies to reflect ecological weights
        colony_weights = {
            'Torgersen North': 30,
            'Dream South': 25,
            'Biscoe West': 20,
            'Cormorant East': 15,
            'Shortcut Point': 10
        }
        colonies, weights = zip(*colony_weights.items())
        colony = random.choices(colonies, weights=weights, k=1)[0]
        island = COLONIES[colony]
        age_group = random.choices(AGE_GROUPS, weights=[0.1, 0.2, 0.7])[0]
        sex = random.choice(SEXES) if random.random() < 0.5 else None
        capture_date = random_capture_date()

        bill_length = np.clip(np.random.normal(SPECIES_INFO[species]['bill_mean'], SPECIES_INFO[species]['bill_sd']), 32, 60)
        bill_depth = np.clip(np.random.normal(SPECIES_INFO[species]['bill_depth_mean'], SPECIES_INFO[species]['bill_depth_sd']), 13, 21)
        flipper_length = np.clip(np.random.normal(SPECIES_INFO[species]['flipper_mean'], SPECIES_INFO[species]['flipper_sd']), 170, 230)

        # Adjust body mass by age
        age_mass_factor = {'Chick': 0.6, 'Juvenile': 0.8, 'Adult': 1.0}[age_group]

        # Adjust body mass by sex
        sex_mass_factor = {"Male": 1.05, "Female": 0.95, None: 1.0}[sex]

        # Generate mass with age and sex adjustments
        base_mass = np.random.normal(SPECIES_INFO[species]['mass_mean'], SPECIES_INFO[species]['mass_sd'])
        body_mass = base_mass * age_mass_factor * sex_mass_factor
        body_mass = np.clip(body_mass, 2500, 6500)

        # Field stress adjustments by colony
        colony_stress_map = {
            'Torgersen North': 0.0,
            'Dream South': 0.05,
            'Biscoe West': 0.1,
            'Cormorant East': 0.15,
            'Shortcut Point': 0.2
        }
        stress_factor = colony_stress_map.get(colony, 0.0)

        # Species fragility modifiers
        species_band = {
            'Adelie': 0.20,
            'Chinstrap': 0.15,
            'Gentoo': 0.25
        }

        # Health classification with adjusted bounds and stress impact
        if pd.isnull(body_mass):
            health_status = 'UNKNOWN'
        else:
            mean_mass = SPECIES_INFO[species]['mass_mean']
            band = species_band.get(species, 0.20)
            low_thresh = mean_mass * (1 - band) * (1 + stress_factor)
            high_thresh = mean_mass * (1 + band) * (1 - stress_factor)

            if body_mass < low_thresh:
                health_status = 'Underweight'
            elif body_mass > high_thresh:
                health_status = 'Overweight'
            else:
                health_status = 'Healthy'

            # Add random error (simulate field mislabeling)
            if random.random() < 0.07:
                health_noise = ['Unwell', 'Critically Ill', 'Healthy', 'Underweight', 'Overweight']
                health_noise.remove(health_status)
                health_status = random.choice(health_noise)

        if random.random() < TAGGED_PERCENTAGE:
            tag_id = generate_tag(species, tag_counters)
        else:
            tag_id = None

        # Determine clutch completion
        clutch_probs = {"Adelie": 0.9, "Chinstrap": 0.85, "Gentoo": 0.8}
        clutch_completion = np.random.choice(
            ["Yes", "No"],
            p=[clutch_probs.get(species, 0.8), 1 - clutch_probs.get(species, 0.8)]
        )

        # Generate egg date only if clutch was completed
        egg_date = capture_date - timedelta(days=random.randint(0, 14))
        if egg_date < datetime(2019, 10, 1):
            egg_date = capture_date
        date_egg = egg_date.strftime('%Y-%m-%d') if clutch_completion == "Yes" else np.nan

        # Add study_name based on year and study convention
        study_year = capture_date.year
        study_name = f"PAPRI{study_year}"

        penguins.append({
            'tag_id': tag_id,
            'species': species,
            'bill_length_mm': round(bill_length, 2),
            'bill_depth_mm': round(bill_depth, 2),
            'flipper_length_mm': round(flipper_length, 1),
            'body_mass_g': round(body_mass),
            'age_group': age_group,
            'sex': sex,
            'colony_id': colony,
            'island': island,
            'capture_date': capture_date.strftime('%Y-%m-%d'),
            'health_status': health_status,
            'study_name': study_name,
            'clutch_completion': clutch_completion,
            'date_egg': date_egg
        })

    # === Convert to DataFrame ===
    df_penguins_clean = pd.DataFrame(penguins)

    # === Save Clean CSV ===
    print(f"Saving {len(df_penguins_clean)} clean records to {args.clean_output}...")
    df_penguins_clean.to_csv(args.clean_output, index=False)

    # === Add Realistic Messiness and Augmentation ===
    df_penguins_messy = df_penguins_clean.copy()
    df_penguins_messy = inject_mess(df_penguins_messy, mess_level=args.mess_level)
    df_penguins_messy = duplicate_penguin_rows_for_resight(df_penguins_messy, duplicate_rate=args.duplicate_rate)
    df_penguins_messy = inject_species_missingness(df_penguins_messy, missing_rate=args.species_missing_rate)
    df_penguins_messy = inject_mislabeled_duplicates(df_penguins_messy, mislabel_rate=args.mislabel_rate)

    # === Save Messy Field CSV ===
    print(f"Saving {len(df_penguins_messy)} messy records (including resights) to {args.messy_output}...")
    df_penguins_messy.to_csv(args.messy_output, index=False)

    print(f"✅ Generation complete!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Dirty Birds: Synthetic Penguin Data Generator.")
    parser.add_argument(
        '--mess-level',
        type=str,
        default='moderate',
        choices=['none', 'light', 'moderate', 'heavy'],
        help="The level of messiness to inject into the data. Default: 'moderate'."
    )
    parser.add_argument(
        '--num-penguins',
        type=int,
        default=N_PENGUINS,
        help=f"The base number of penguins to generate. Default: {N_PENGUINS}."
    )
    parser.add_argument(
        '--clean-output',
        type=str,
        default='synthetic_penguins_v0.4.0_clean.csv',
        help="Filename for the clean output CSV."
    )
    parser.add_argument(
        '--messy-output',
        type=str,
        default='synthetic_penguins_v0.4.0.csv',
        help="Filename for the messy output CSV."
    )
    parser.add_argument(
        '--duplicate-rate',
        type=float,
        default=0.45,
        help="Proportion of tagged penguins to resight, relative to the tagged population. Default: 0.45"
    )
    parser.add_argument(
        '--species-missing-rate',
        type=float,
        default=0.03,
        help="Proportion of records to have their species value removed. Default: 0.03"
    )
    parser.add_argument(
        '--mislabel-rate',
        type=float,
        default=0.0,
        help="Proportion of records to create as mislabeled duplicates (same tag/date, different data). Default: 0.0"
    )

    args = parser.parse_args()
    main(args)