package com {

  import flash.net.NetConnection;
	import flash.net.NetStream;
  import flash.events.NetStatusEvent;
  import com.Console;

	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class Subscribe {

    var ns:NetStream;
    var connection:NetConnection;
    var console:Console = new Console();
    var broadcaster:String;

		public function Subscribe(connection, broadcaster) {

      this.connection = connection;
      this.broadcaster = broadcaster;

      ns = new NetStream(this.connection);
      ns.addEventListener(NetStatusEvent.NET_STATUS, nsPlayOnStatus);
      ns.bufferTime = 0;
      ns.play(this.broadcaster);
		}

    private function nsPlayOnStatus(infoObject:NetStatusEvent){
      var info = "nsPlay: " + infoObject.info.code + " (" + infoObject.info.description + ")";
      console.log(info);

      if (infoObject.info.code == 'NetStream.Play.PublishNotify') {}
      if (infoObject.info.code == 'NetStream.Play.Reset') {}
      if (infoObject.info.code == 'NetStream.Play.Start') {
        console.log('Broadcaster is Broadcasting.');
      }
      if (infoObject.info.code == 'NetStream.Play.UnpublishNotify') {
        console.log('Broadcaster Has Stopped Broadcasting.');
      }
      if (infoObject.info.code == "NetStream.Play.StreamNotFound") {
        console.log('Broadcaster Is Not Found.');
      }
      if (infoObject.info.code == "NetStream.Play.Failed") {
        console.log('Broadcaster Status is unknown please check again.');
      }
    }


	}
}
