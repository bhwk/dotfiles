import { Variable } from "astal";

enum WindowEventType {
  WindowsChanged = "WindowsChanged",
  WindowClosed = "WindowClosed",
  WindowOpenedOrChanged = "WindowOpenedOrChanged",
  WindowFocusChanged = "WindowFocusChanged"
}

interface WindowInfo {
  id: number;
  title: string;
  app_id: string;
  is_focused: boolean;
}

interface WindowsById {
  [id: number]: WindowInfo;
}

type WindowEvent =
  | { type: WindowEventType.WindowsChanged; windows: WindowInfo[] }
  | { type: WindowEventType.WindowClosed; id: number }
  | { type: WindowEventType.WindowOpenedOrChanged; window: WindowInfo }
  | { type: WindowEventType.WindowFocusChanged; id: number };

export default function NiriWindowTitle() {

  const windows = Variable<WindowsById>({});

  const handleEvent = (event: WindowEvent) => {
    let _windows = { ...windows.get() };

    switch (event.type) {
      case WindowEventType.WindowsChanged: {
        _windows = Object.fromEntries(event.windows.map(win => [win.id, win]))
        break
      }
      case WindowEventType.WindowClosed: {
        delete _windows[event.id]
        break
      }
      case WindowEventType.WindowFocusChanged: {
        let prevWindow = Object.values(_windows).find(win => win.is_focused);
        if (prevWindow) {
          prevWindow.is_focused = false
          _windows[prevWindow.id] = prevWindow
        }

        let newFocusedWindow = _windows[event.id]
        if (newFocusedWindow) {

          newFocusedWindow.is_focused = true
          _windows[newFocusedWindow.id] = newFocusedWindow
        }
        break
      }
      case WindowEventType.WindowOpenedOrChanged: {
        let prevWindow = Object.values(_windows).find(win => win.is_focused)
        if (prevWindow) {
          prevWindow.is_focused = false
          _windows[prevWindow.id] = prevWindow
        }
        _windows[event.window.id] = event.window
        break
      }
    }
    windows.set(_windows)
  }

  const title = Variable("").watch(["niri", "msg", "--json", "event-stream"], (out) => {
    const rawEvent = JSON.parse(out);

    const eventType = Object.keys(rawEvent)[0] as WindowEventType
    const eventPayload = rawEvent[eventType]

    if (eventType in WindowEventType) {
      handleEvent({ type: eventType, ...eventPayload })
    }

    const focusedWindow = Object.values(windows.get()).find(win => win.is_focused)
    return focusedWindow ? (focusedWindow.app_id.length > 40 ? focusedWindow.app_id.substring(0, 40).concat("...") : focusedWindow.app_id) : ""
  });

  return (
    <label
      className={"WindowTitle"}
      onDestroy={() => title.drop()}
      label={title()}
    />
  );
}
