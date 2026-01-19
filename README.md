# E2E Encrypt Realtime Chat App

sequenceDiagram
participant U as User
participant A as App
participant S as Supabase Auth
participant R as Supabase Realtime
participant LS as Local Storage

    %% Signup flow
    U->>A: Enter email/password (signup)
    A->>S: Create account
    S-->>A: Auth success
    A->>A: Generate key pair
    A->>LS: Store private key
    A->>S: Upload public key

    %% Signin flow
    U->>A: Enter email/password (signin)
    A->>S: Login
    S-->>A: Auth success
    A->>LS: Check local private key
    alt Private key exists
        LS-->>A: Use private key
    else Private key missing
        A->>A: Generate new key pair
        A->>LS: Store private key
        A->>S: Update public key
    end

    %% Contacts flow
    A->>LS: Load local chats
    U->>A: Add contact
    A->>S: Fetch contact public key

    %% Chat / messaging flow
    U->>A: Send message
    A->>A: Encrypt with recipient public key
    A->>R: Send via Realtime broadcast
    R-->>RecipientA: Deliver encrypted message
    RecipientA->>RecipientLS: Store locally
    RecipientA->>RecipientA: Decrypt and display

## TODO

- make redirect to the home page if already login in both the /signin & /signup
- create a loading component
