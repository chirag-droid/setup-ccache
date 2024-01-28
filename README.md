<p align="center">
  <a href="https://github.com/chirag-droid/setup-ccache/actions"><img alt="setup-ccache status" src="https://github.com/chirag-droid/setup-ccache/workflows/build-test/badge.svg"></a>
</p>

# Cache your compile builds using ccache

Use this action to make your cmake builds faster. The caching is done using `ccache - a compiler cache.`

> ccache doesn't currenly support MSVC. ccache is working on support for MSVC

## Example workflow using ccache

```yaml
jobs:
  build:
    steps:
    - name: Setup ccache
      uses: chirag-droid/setup-ccache@latest
      with:
        # default - ccache-key
        key: 'ccache-example-key'

    - name: Build with cmake
      uses: lukka/run-cmake@v1
      with:
        cmakeListsTxtPath: '${{ github.workspace }}/CMakeLists.txt'
        cmakeAppendedArgs: '-D CMAKE_C_COMPILER_LAUNCHER=ccache -D CMAKE_CXX_COMPILER_LAUNCHER=ccache'
        buildWithCMake: true
        buildDirectory: '${{ github.workspace }}/build'
```
