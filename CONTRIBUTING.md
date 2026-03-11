# Contributing to NestJS Exception Handler

Thank you for your interest in contributing to NestJS Exception Handler! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the [Issues](https://github.com/nurulislamrimon/nestjs-exception-handler/issues) section
2. If not, open a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node version, NestJS version, etc.)

### Suggesting Enhancements

1. Check existing issues to see if the feature has been requested
2. Open a new issue describing:
   - The problem you're trying to solve
   - Proposed solution
   - Alternatives considered

### Pull Request Process

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/nestjs-exception-handler.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Ensure all tests pass: `npm test`
6. Run linting: `npm run lint`
7. Update documentation if needed
8. Commit your changes: `git commit -m 'Add amazing feature'`
9. Push to your fork: `git push origin feature/amazing-feature`
10. Open a Pull Request against the `main` branch

### Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Run tests:

   ```bash
   npm test
   ```

4. Run linting:
   ```bash
   npm run lint
   ```

### Code Style

- Follow the existing code style
- Use TypeScript with strict mode
- Write unit tests for new features
- Ensure all linting rules pass
- Keep functions small and focused

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

Example:

```
feat: add support for custom Prisma error codes
```

### Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.

### Questions?

Feel free to open an issue with the question label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
