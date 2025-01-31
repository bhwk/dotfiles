return {
  {
    "neovim/nvim-lspconfig",
    opts = {
      servers = {
        lua_ls = {
          mason = false,
        },
        nixd = {
          mason = false,
          nixpkgs = {
            expr = "import <nixpkgs> { }",
          },
          formatting = {
            command = { "nixfmt" },
          },
          options = {
            nixos = {
              expr = '(builtins.getFlake("git+file://"+ toString ./.)).nixosConfigurations.${config.networking.hostName}.options',
            },
          },
        },
      },
    },
  },
}
