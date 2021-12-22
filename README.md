# Valist Github Action

A github action for publishing releases on Valist.

## Examples

There are several examples in the CI/CD section of the [Valist example projects](https://github.com/valist-io/example-projects). Here is the basic workflow to get you started:

```yaml
name: Valist publish
on:
  push:
    branches: ['main'] # Event triggers on pushes to main

jobs:
  Valist: # Define deploy job
    runs-on: ubuntu-latest # OS used for virtual machine

    steps:
      - uses: actions/checkout@v2 # Make source code of repo available
      
      - name: Valist publish
        uses: valist-io/valist-github-action@main # Execute valist build & publish
        env:
          VALIST_SIGNER: ${{ secrets.VALIST_SIGNER }}
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
