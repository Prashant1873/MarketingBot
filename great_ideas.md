# Great Ideas

Valuable concepts, design directions, and feature ideas for Marcutie.

## Core Concepts
- **Brag-Grade Launch Videos Without Codebases**: Generating viral, high-converting product launch videos from just a long marketing prompt and/or uploaded product screenshots, mockups, or photos—eliminating the GitHub repo / source code requirement of Hyperframes.
- **Local-First Zero Server Cost Rendering**: Using local Node.js and browser-based Remotion / WebCodecs / Canvas rendering on the user's machine so rendering is 100% free of cloud GPU bills, making the software infinitely scalable and easily hostable.
- **BYOK (Bring Your Own Key) Multimodal Architecture**: Users supply their own Gemini, Claude, or OpenAI API key. This unlocks frontier vision and reasoning without requiring the user to run heavy local vision models or the host to pay subscription API bills.

## Design & Marketing Principles
- **2–3s Hook Law**: The first 2–3 seconds determine whether the viewer stays. The prompt analyzer prioritizes identifying or generating the punchiest visual and textual opening hook.
- **Reading-Time Floor**: High pace is achieved through motion and tight transitions, never by flashing unreadable text. Enforce a minimum hold time (>=0.8s for short text, >=0.3s/word for headlines).
- **Frame-0 Poster Baking**: Social platforms (X, Discord, Slack) generate video preview thumbnails from frame 0. Baking the best settled frame into frame 0 using FFmpeg (`eq(n,0)`) ensures thumbnail previews look intentional and gorgeous.
- **Automatic Multi-Platform Share Copy**: Generating one-click postable captions tailored to the video's tone for Twitter/X, LinkedIn, and Discord alongside the video render.
- **Synthetic Dynamic App Screen Generation (Prompt-Only Mode)**: Programmatically rendering a realistic simulated SaaS/App window (macOS title bar, sidebar navigation, metric widgets, and sparkline graphs) customized to the product domain when no image is uploaded.
- **Image-to-Theme Style Transfer**: Extracting brand color palettes, fonts, and aesthetic styling from uploaded images to theme prompt-generated feature screens so they look like authentic parts of the product.
