# Contributing to OperaAI Claims Intelligence

Thank you for your interest in contributing to OperaAI Claims Intelligence! This project is an open-source reference implementation of an agentic workflow system for regulated insurance operations.

## Our Philosophy

This project is designed to demonstrate **architectural patterns** rather than serve as a drop-in production system. We prioritize:
1. **Clarity over cleverness**: The code should be easy to read and understand.
2. **Deterministic boundaries**: Clear separation between probabilistic AI and deterministic rules.
3. **Demo reliability**: The system must be able to reset instantly and run flawlessly in presentation environments.

## How to Contribute

### 1. Reporting Issues
If you find a bug or have a feature request, please open an issue on GitHub. Include as much detail as possible, including steps to reproduce the issue.

### 2. Submitting Pull Requests
1. Fork the repository.
2. Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Ensure the application still builds and runs correctly (`pnpm run dev`).
5. Commit your changes with clear, descriptive commit messages.
6. Push your branch to your fork (`git push origin feature/your-feature-name`).
7. Open a Pull Request against the `main` branch of this repository.

### 3. Areas for Contribution
We are particularly interested in contributions in the following areas:
- **Live LLM Integration**: Replacing the mock AI Copilot with live integrations to OpenAI, Anthropic, or open-source models (e.g., LLaMA, DeepSeek).
- **Additional Regulatory Contexts**: Adapting the workflow for other jurisdictions (e.g., US HIPAA, EU GDPR, UK FCA).
- **Enhanced UI/UX**: Improvements to the Toscana dark sidebar layout or data visualization components.
- **Testing**: Adding comprehensive unit and integration tests.

## Development Setup

1. Clone the repository.
2. Run `pnpm install` to install dependencies.
3. Run `pnpm run dev` to start the development server.
4. The application uses an in-memory SQLite database (`sql.js`), so no external database setup is required.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. We are committed to providing a welcoming and inclusive environment for all contributors.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
