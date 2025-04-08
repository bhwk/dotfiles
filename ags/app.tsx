import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import Popover from "./widget/Popover"
import { Variable } from "astal"
const { TOP, RIGHT, LEFT } = Astal.WindowAnchor

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean quis semper risus."

App.start({
  css: style,
  main() {
    App.get_monitors().map(Bar)
  },
})

