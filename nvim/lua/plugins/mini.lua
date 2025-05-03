-- ~/.dotfiles/nvim/lua/plugins/mini.lua
return {
  {
    "echasnovski/mini.nvim",
    version = false, -- Use git commit for latest features
    opts = {},
    config = function()
      -- Require the generated Lua file to get the Stylix palette table
      local stylix_palette = require("user.stylix_palette_table")

      -- Setup mini.base16 with the obtained palette
      require("mini.base16").setup({
        palette = stylix_palette,
        -- Add other mini.base16 options here if needed, e.g., use_cterm, plugins
        use_cterm = true,
        -- plugins = { default = false, ['echasnovski/mini.nvim'] = true },
        plugins = { default = true },
      })
    end,
  },
  -- ... other plugins ...
}
