import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk, App } from "astal/gtk3"
import Mpris from "gi://AstalMpris"
import Battery from "gi://AstalBattery"
import Wp from "gi://AstalWp"
import Network from "gi://AstalNetwork"
import Tray from "gi://AstalTray"
import NiriWindowTitle from "./NiriWindowTitle"

function SysTray() {
  const tray = Tray.get_default()

  return <box className="SysTray">
    {bind(tray, "items").as(items => items.map(item => (
      <menubutton
        tooltipMarkup={bind(item, "tooltipMarkup")}
        usePopover={false}
        actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={bind(item, "menuModel")}>
        <icon gicon={bind(item, "gicon")} />
      </menubutton>
    )))}
  </box>
}

function Wifi() {
  const network = Network.get_default()
  const wifi = bind(network, "wifi")

  return <box visible={wifi.as(Boolean)}>
    {wifi.as(wifi => wifi && (
      <label
        label={bind(wifi, "ssid").as(String)}
      />
    ))}
    {wifi.as(wifi => wifi && (
      <icon
        className="Wifi"
        icon={bind(wifi, "iconName")}
      />
    ))}
  </box>

}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!

  return <box className="AudioSlider" css="min-width: 140px">
    <icon icon={bind(speaker, "volumeIcon")} />
    <slider
      hexpand
      onDragged={({ value }) => speaker.volume = value}
      value={bind(speaker, "volume")}
    />
  </box>
}

function BatteryLevel() {
  const bat = Battery.get_default()

  const time = Variable<String>("").poll(1000, () => {
    let target
    if (!bat.charging) {
      target = bat.time_to_empty
    } else {
      target = bat.time_to_full
    }
    return new Date(target * 1000).toISOString().substring(11, 16)
  })


  return <box className="Battery"
    tooltipText={time().as(String)}
    onDestroy={() => time.drop()}
    visible={bind(bat, "isPresent")} >
    <icon
      icon={bind(bat, "batteryIconName")}
    />
    <label label={bind(bat, "percentage").as(p =>
      `${Math.floor(p * 100)} %`
    )} />
  </box >
}

function Media() {
  const mpris = Mpris.get_default()

  return <box className="Media">
    {bind(mpris, "players").as(ps => ps[0] ? (
      <box>
        <box
          className="Cover"
          valign={Gtk.Align.CENTER}
          css={bind(ps[0], "coverArt").as(cover =>
            `background-image: url('${cover}');`
          )}
        />
        <label
          label={bind(ps[0], "metadata").as(() =>
            `${ps[0].title} - ${ps[0].artist}`
          )}
        />
      </box>
    ) : (
      <label label="Nothing Playing" />
    ))}
  </box>
}


function Time({ format = "%H:%M - %A %e." }) {
  const time = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format(format)!)

  return <label
    className="Time"
    onDestroy={() => time.drop()}
    label={time()}
  />
}



export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return <window
    className="Bar"
    gdkmonitor={monitor}
    name={"Bar"}
    setup={self => App.add_window(self)}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}>
    <centerbox>
      <box>
        <NiriWindowTitle />
      </box>
      <box halign={Gtk.Align.CENTER}>
        <Media />
      </box>
      <box hexpand halign={Gtk.Align.END} >
        <Wifi />
        <AudioSlider />
        <BatteryLevel />
        <Time />
        <SysTray />
      </box>
    </centerbox>
  </window>
}
