## Inspiration

### Api

- Original [article](https://agmprojects.com/blog/building-a-rest-and-web-socket-api-with-actix.html) with an example how to build a web service with actix-web
- [JWT Auth](https://gill.net.in/posts/auth-microservice-rust-actix-web1.0-diesel-complete-tutorial/#lets-do-auth)
- [Session Based Auth](https://www.lpalmieri.com/posts/session-based-authentication-in-rust/)

### React

- React and TypeScript power the frontend in `web/`.
- Vite builds the frontend into `dist/`, which the Rust server serves as the SPA shell.

### Styling (CSS)

- [Tailwind](https://github.com/matiu2/tailwind-yew-builder) in rust

### iOS

- How to [make web app look like a native iOS app](https://medium.com/appscope/designing-native-like-progressive-web-apps-for-ios-1b3cdda1d0e8)
- https://samselikoff.com/blog/8-tips-to-make-your-website-feel-like-an-ios-app#tip-5:-make-the-status-bar-transparent

## Learning Rust

- [Niko Matsakis: What's unique about Rust?](https://www.youtube.com/watch?v=jQOZX0xkrWA)
- [Rust Book](https://doc.rust-lang.org/book/ch00-00-introduction.html)
- [Visualizing memory layout of Rust's data types](https://www.youtube.com/watch?v=rDoqT-a6UFg)
- [Learning rust with too many lists](https://rust-unofficial.github.io/too-many-lists/)

### References

- [Cheat Sheet](https://cheats.rs/#data-structures)
- [Tour of Rust's Standard Library Traits](https://github.com/pretzelhammer/rust-blog/blob/master/posts/tour-of-rusts-standard-library-traits.md)

## Requirements

- https://docs.google.com/spreadsheets/d/1I9TTV_3fZ3saqSjlhVjJG6DWpjnX9H3JqbVDqRuRQGs/edit?usp=sharing
- https://docs.google.com/document/d/1HePTbaFPy5C3XXL8NS0slXRFSQFEKpDrCHvi0Sja4Zk/edit?usp=sharing

## Dev

### Running the code

1. Install Node.js and Rust.
2. Install frontend dependencies: `npm --prefix web install`
3. Install diesel_cli:

```
brew install libpq
brew link --force libpq
echo 'export PATH="/usr/local/opt/libpq/bin:$PATH"' >> ~/.zshrc
cargo install diesel_cli --no-default-features --features postgres
```

4. Run the full app: `make run`
5. For frontend-only development, run: `npm --prefix web run dev`
6. Open in Chrome: `http://localhost:8080` for the Rust-served app, or `http://localhost:5173` for Vite.

### Verification

- `npm --prefix web run test`
- `npm --prefix web run build`
- `npm --prefix web run e2e`
- `cargo build --bin server`
- `cargo test`
- `docker build -t sadhana-pro-react .`

### Docker

To build a container run:
`docker build -t sadhanapro .`

To run the container use the following command as an example:
`docker run -p4242:80 -d --name sadhanapro -t -e 'SERVER_ADDRESS=0.0.0.0:80' -e 'JWT_KEY=xyz' -v "$(pwd)"/env.template:/usr/local/bin/.env sadhanapro`

The required environment variables can be either passed down with `-e` flag or in a mapped `.env` file.

### Splash screen generation for iOS

1. `npm install pwa-asset-generator`
2. Run

```
npx pwa-asset-generator images/logo.png images -m site.webmanifest --padding "calc(50vh - 25%) calc(50vw - 25%)" -b "linear-gradient(135deg, #7c6d63, #2f293b)" -q 100 -i asset-generator-changes.html --favicon
```

### Icons

[Free svg icons](https://heroicons.com/)
[Fix strokes to fills](https://github.com/oslllo/svg-fixer)
[Svg to ttl](https://icomoon.io/app/#/select/font)
Note, you actually need to merge changes to style.css as it includes some important margins.

### iOS PWA Compatibility
https://firt.dev/notes/pwa-ios/

### VSCode navigation

* Go to Definition F12 - Go to the source code of the type definition.
* Peek Definition ⌥F12 - Bring up a Peek window with the type definition.
* Go to References ⇧F12 - Show all references for the type.
* **Show Call Hierarchy** ⇧⌥H - Show all calls from or to a function.

You can navigate via symbol search using the Go to Symbol commands from the Command Palette (⇧⌘P).
* Go to Symbol in File - ⇧⌘O
* Go to Symbol in Workspace - ⌘T
