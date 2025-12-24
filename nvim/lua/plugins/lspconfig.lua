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
          -- This section disables the completion capability
          capabilities = {
            textDocument = {
              completion = {
                completionItem = {
                  snippetSupport = false,
                },
              },
            },
          },
          on_init = function(client)
            client.server_capabilities.completionProvider = false
          end,
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
            home_manager = {
              expr = "(import <home-manager/modules> { configuration = ~/nixos-config/home/common/default.nix; pkgs = import <nixpkgs> {}; }).options",
            },
          },
        },
        nil_ls = {
          mason = false,
        },
        pyright = {
          mason = false,
        },
        ruff = {
          mason = false,
        },
        -- enable java lsp
        jdtls = {
          mason = false,
        },
      },
    },
  },
}
