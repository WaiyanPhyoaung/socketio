import Namespace from "./classes/Namespace";
import Room from "./classes/Room";

const wikiNs = new Namespace(
  "0",
  "Wikipedia",
  "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png",
  "/wiki"
);
const mozNs = new Namespace(
  "1",
  "Mozilla",
  "https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png",
  "/mozilla"
);
const linuxNs = new Namespace(
  "2",
  "Linux",
  "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png",
  "/linux"
);

wikiNs.addRoom(new Room(0, "New Articles", true));
wikiNs.addRoom(new Room(1, "Editors"));
wikiNs.addRoom(new Room(2, "Other"));

mozNs.addRoom(new Room(0, "Firefox"));
mozNs.addRoom(new Room(1, "SeaMonkey"));
mozNs.addRoom(new Room(2, "SpiderMonkey"));
mozNs.addRoom(new Room(3, "Rust"));

linuxNs.addRoom(new Room(0, "Debian"));
linuxNs.addRoom(new Room(1, "Red Hat"));
linuxNs.addRoom(new Room(2, "Ubuntu"));
linuxNs.addRoom(new Room(3, "Mac OS"));

export const namespaces = [wikiNs, mozNs, linuxNs];
