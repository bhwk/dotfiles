-- ~/.dotfiles/nvim/lua/plugins/mini.lua
return {
  {
    "echasnovski/mini.nvim",
    version = false, -- Use git commit for latest features
    opts = {},
    config = function()
      require("mini.base16")
    end,
  },
  -- ... other plugins ...
}
