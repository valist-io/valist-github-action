# Valist GitHub Action

GitHub Action for publishing releases on Valist.

## Usage

### Inputs

- `private-key` (required) Account private key.
- `account` (required) Valist account name.
- `project` (required) Valist project name.
- `release` (required) Valist release name.
- `files` (required) Files to publish. [Supports glob patterns](https://github.com/actions/toolkit/tree/main/packages/glob#patterns).
- `follow-symbolic-links` Follow symbolic links. Default true.
- `image` Optional release image URL.
- `description` Optional release description.
- `rpc-url` Ethereum RPC URL. Default Polygon Mainnet.
- `meta-tx` Enable gasless meta transactions. Default true.

### Example

```yaml
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - run: echo "TIMESTAMP=$(date +%Y%m%d%H%M)" >> $GITHUB_ENV
      - uses: valist-io/valist-github-action@v2.1.0
        with:
          private-key: ${{ secrets.PRIVATE_KEY }}
          account: nasdf
          project: ipfs
          release: ${{ env.TIMESTAMP }}
          files: '**'
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
