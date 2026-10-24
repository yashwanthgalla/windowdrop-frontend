# DropCode — Frontend

A peer-to-peer style file and folder sharing web application engineered with Apple-inspired visual aesthetics, spring animations, and a client-side mock API layer.

A **Sender** uploads files and folders, the system generates a secure one-time 8-character code, and a **Receiver** enters that code to preview and download them individually or as a `.zip` archive.

---

## Tech Stack

- **React 18 / 19** + **Vite** + **TypeScript**
- **Tailwind CSS**: Apple-inspired design tokens configured in `tailwind.config.js`
- **Framer Motion**: Apple spring transitions (`stiffness: 300, damping: 30`), button press scale `0.97`, shared layout animated pill, horizontal error shake
- **lucide-react**: Comprehensive vector iconography (no emojis or placeholder boxes)
- **react-dropzone**: Drag & drop zone with native folder directory picker support (`<input webkitdirectory>`)
- **qrcode.react**: High-contrast QR code generation for one-click mobile sharing
- **Zustand**: Reactive state management for Send and Receive flows, theme, and toast notifications
- **React Router**: Client-side routing with 404 fallback
- **JSZip**: Client-side ZIP generation preserving folder hierarchies in mock mode

---

## Design System & Apple Aesthetics

- **Typography**: Apple system font stack (`"SF Pro Display"`, `"SF Pro Text"`, `-apple-system`, fallback to Google Font `"Inter"`, monospaced `"JetBrains Mono"` / `"SF Mono"` for codes).
- **Colors**:
  - Light mode: Background `#F5F5F7`, Surface `#FFFFFF`, Accent `#0071E3`, Success `#34C759`, Error `#FF3B30`, Hairline `rgba(0,0,0,0.08)`.
  - Dark mode: Background `#000000`, Surface `#1C1C1E`, Elevated `#2C2C2E`, Accent `#0A84FF`, Hairline `rgba(255,255,255,0.12)`.
- **Surfaces & Glassmorphism**: `backdrop-filter: blur(24px) saturate(180%)`, soft layered shadows.
- **Corners**: `24px` for cards, `14px` for inputs and buttons, `full` for segmented pills.
- **Accessibility**: Full keyboard navigation, visible focus rings (`2px accent, 2px offset`), `aria-live` for status updates, WCAG AA contrast.

---

## Project Structure

```text
frontend/
├── src/
│   ├── api/
│   │   └── client.ts            # Typed API client with in-memory mock store
│   ├── components/
│   │   ├── HowItWorks.tsx       # 3-step feature overview
│   │   └── ui/
│   │       ├── Button.tsx           # Apple button with spring tap feedback
│   │       ├── Card.tsx             # 24px radius glass/surface card
│   │       ├── FileRow.tsx          # File item with category icon & actions
│   │       ├── FolderTree.tsx       # Collapsible directory tree with counts
│   │       ├── Navbar.tsx           # Apple glass navbar & theme toggle
│   │       ├── OtpInput.tsx         # 8 OTP tiles with shake animation
│   │       ├── ProgressRing.tsx     # Circular progress indicator
│   │       ├── SegmentedControl.tsx # Apple sliding pill tab selector
│   │       ├── Skeleton.tsx         # Shimmer loading skeleton
│   │       └── Toast.tsx            # Top-center glass notification system
│   ├── features/
│   │   ├── send/
│   │   │   ├── SendFlow.tsx         # Send flow state controller
│   │   │   ├── DropzoneStep.tsx     # Drag & drop and folder picker
│   │   │   ├── ReviewStep.tsx       # File/folder review, tree view, size limit
│   │   │   ├── UploadingStep.tsx    # Upload progress ring & cancel action
│   │   │   └── CodeReadyStep.tsx    # 8-char code tiles, copy toast, QR, timer
│   │   └── receive/
│   │       ├── ReceiveFlow.tsx      # Receive flow state controller
│   │       ├── EnterCodeStep.tsx    # 8-digit OTP entry, 3 attempts & lock timer
│   │       ├── PreviewStep.tsx      # Verified package preview & ZIP/file download
│   │       └── DownloadingStep.tsx  # Download progress & success checkmark
│   ├── pages/
│   │   ├── HomePage.tsx         # Hero & main flow view
│   │   └── NotFoundPage.tsx     # Apple-styled 404 page
│   ├── store/
│   │   ├── useThemeStore.ts     # Dark/light theme store with system auto-detect
│   │   ├── useToastStore.ts     # Glass toast state
│   │   └── useTransferStore.ts  # Send/Receive workflow store
│   ├── styles/
│   │   └── index.css            # Tailwind directives & glassmorphic utilities
│   ├── types/
│   │   └── index.ts             # Transfer models & API contracts
│   ├── utils/
│   │   └── fileHelpers.ts       # Size formatting, icons, and tree parser
│   ├── App.tsx
│   └── main.tsx
├── .env                         # Default environment configuration
├── .env.example
├── tailwind.config.js           # Design tokens
├── tsconfig.json
└── vite.config.ts
```

---

## Running the Application

### 1. Install dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production build & type check

```bash
npm run build
```

---

## Mock API & Real Backend Integration

The app comes with an in-memory client-side mock enabled by default.

### Features in Mock Mode (`VITE_USE_MOCK=true`):
- Generates 8-character codes from `"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"`.
- Realistic simulated network latency (200–350ms) and upload/download progress ticks.
- Retains uploaded files in memory during the session: if you create a transfer on the **Send** tab and copy the code, switching to the **Receive** tab and entering that code will retrieve and download your exact files!
- Includes a pre-seeded demo transfer with code **`K7M4PX9A`** (`K7M-4PX9`) containing sample files and folders for instant testing.
- Enforces the 3-attempt limit on wrong codes, with automatic 30-second security lockout and cooldown timer.
- Real ZIP downloads: Uses `JSZip` to generate valid, extractable ZIP files retaining folder paths.
- Real-time status polling: When the receiver downloads files, the sender's status pill updates from *"Waiting for receiver"* to *"Delivered"* with a green checkmark.

### Switching to the Real Backend:

When the backend server is ready, update `.env`:

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000
```

The typed `DropCodeApiClient` in `src/api/client.ts` implements the exact endpoints:
- `POST /api/transfers`
- `POST /api/transfers/:transferId/files` (multipart with `file` and `path`)
- `GET /api/transfers/:transferId/status`
- `POST /api/transfers/verify`
- `GET /api/transfers/:transferId/files/:fileId`
- `GET /api/transfers/:transferId/zip`
