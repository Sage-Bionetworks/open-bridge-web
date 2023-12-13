# Open Bridge
The Open Bridge website.

## Adding an app-id for a new website

### Step 1: Open Web client in Visual Studios Code
1. Read the “constants.ts” file and find the next available localhost (3000, 3001, 3002, 3003, etc.)

### Step 2: Set up OAuth client for each URL added with a new app-id
1. Sign into Synapse using “BridgeStudyCreator”
2. Go to  (OAuth Client Manager)
3. Create a new OAuth Client for each URL (local, prod, staging)
4. Request verification of the URLs from Synapse service desk

### Step 3: Paste Secret Key from OAuth Manager to Bridge (Jack does magic)
1. Use Postman to copy secret key to Bridge app id for each url ((local, prod, staging)
2. The “vendor” in “constants.ts” matches the dictionary key in the bridge call

### Step 4: Add Synapse client ids to “constants.ts”
1. Go back to the “constants.ts” file
2. Create a bridge app id const and a synapse oauth app id const
3. Add an entry to the "oauth" dictionary for each URL (local, prod, staging)

### Step 5: Open “package.json”
1. Add start:something to the scripts to start the app id on the given local port

### Step 6: Set up mapping for tags to what’s shown
1. Use Bridge Study Manager to tag all the shared assessments and surveys that are available to the given app (mobile)
2. Add a mapping to “assessments.service.ts” for the surveys and assessments buckets
