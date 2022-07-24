# Valist GitHub Action

GitHub Action for publishing releases on Valist.

## Usage

### Inputs

- `account` Valist account name.
- `project` Valist project name.
- `release` Valist release name. Must be unique within a project.
- `path` Path to artifact file or folder.
- `private-key` Project private key. Recommended to generate a fresh key and add it to a Project.

#### Metadata (Optional)

- `image` Path to release image.
- `description` Release description.

#### Valist Client (Optional)

- `rpc-url` Ethereum RPC URL (defaults to Polygon Mainnet).
- `meta-tx` Enable gasless meta transactions (defaults to true).

#### Multi Platform Install (Optional)

Use these inputs to configure multi platform binaries.

- `install-name` Binary name when installing.
- `install-darwin-amd64` Path to darwin/amd64 binary in release.
- `install-darwin-arm64` Path to darwin/arm64 binary in release.
- `install-linux-386` Path to linux/386 binary in release.
- `install-linux-amd64` Path to linux/amd64 binary in release.
- `install-linux-arm` Path to linux/arm binary in release.
- `install-linux-arm64` Path to linux/arm64 binary in release.
- `install-windows-386` Path to windows/386 binary in release.
- `install-windows-amd64` Path to windows/amd64 binary in release.

### Example

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: valist-io/valist-github-action@v2.2.0
        with:
          private-key: ${{ secrets.PRIVATE_KEY }}
          account: acme-co
          project: example
          release: github-action-${{ env.GITHUB_RUN_ID }}
          path: './build'
```

## Contributing

We welcome pull requests and would love to support our early contributors with some awesome perks!

Found a bug or have an idea for a feature? [Create an issue](https://github.com/valist-io/valist-github-action/issues/new).

## Maintainers

[@awantoch](https://github.com/awantoch)

[@jiyuu-jin](https://github.com/jiyuu-jin)

[@nasdf](https://github.com/nasdf)

## License

Valist-Github-Action is licensed under the [Mozilla Public License Version 2.0](https://www.mozilla.org/en-US/MPL/2.0/).
