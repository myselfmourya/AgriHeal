# Content & Translation Governance

To maintain a production-grade multi-language application, all agricultural content and translations must follow these strict governance rules:

## 1. Approved Crop Terminology
- Crop names must be standardized according to the Indian Council of Agricultural Research (ICAR) guidelines.
- **English**: Use standard international names (e.g., "Paddy" instead of "Rice" for the field crop, "Cotton", "Sugarcane").
- **Hindi/Telugu/Tamil**: Use the most widely understood regional term among farmers, not direct literal translations. (e.g., Hindi: 'धान' for Paddy, 'कपास' for Cotton).

## 2. Region-Specific Terms
- Certain pests, diseases, and fertilizers have colloquial names that vary by district.
- **Rule**: Provide the scientific/standard name first, followed by the colloquial name in parentheses if necessary.
- **Example**: "Fall Armyworm (फॉल आर्मीवर्म)"

## 3. Translation Review Workflow
1. **Initial Translation**: Conducted by the internal localization team or automated translation service (with agricultural context).
2. **Agronomist Review**: All translations related to crop diseases, pesticide applications, and fertilizer dosages MUST be reviewed and approved by a certified agronomist for that specific language.
3. **Field Validation**: During pilots, local extension workers will review the app interface to ensure UI labels (e.g., "Sowing", "Harvesting", "Market Price") make sense to local farmers.

## 4. Ownership of Content Updates
- **UI/UX Team**: Owns structural translations (Navigation, Buttons, Empty States).
- **Agricultural Science Team**: Owns the accuracy of Farm Care advice, recommendations, and crop definitions.
- **Data Engineering**: Owns the ingestion and mapping of regional market prices and schemes into the standard taxonomy.

## 5. Fallback Mechanisms
- If a translation is missing for a specific regional dialect, the app will gracefully fall back to the state's primary language (e.g., falling back to standard Telugu if a specific dialect term is missing).
- English is the ultimate fallback language for all technical system errors.
