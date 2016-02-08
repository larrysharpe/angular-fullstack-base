package com {

  import flash.net.NetConnection;
	import flash.net.NetStream;
  import flash.events.NetStatusEvent;
  import com.Console;
  import flash.events.EventDispatcher;
  import flash.events.Event;

	/**
	 * ...
	 * @author Larry Sharpe
	 */
	public class Subscribe extends EventDispatcher {

    var ns:NetStream;
    var connection:NetConnection;
    var console:Console = new Console();
    var broadcaster:String;

		public function Subscribe (connection, broadcaster) {

      this.connection = connection;
      this.broadcaster = broadcaster;

      ns = new NetStream(this.connection);
      ns.addEventListener(NetStatusEvent.NET_STATUS, nsPlayOnStatus);
      ns.bufferTime = 0;
      console.log('///// Subscribe to ' + this.broadcaster + '/////')
      ns.play(this.broadcaster);
		}

    private function nsPlayOnStatus(infoObject:NetStatusEvent){
      var info = "nsPlay: " + infoObject.info.code + " (" + infoObject.info.description + ")";
      console.log(info);

      if (infoObject.info.code == 'NetStream.Play.PublishNotify') {
        console.log('Publish Notify.');
        dispatchEvent(new SubscribeEvent('onStreamPublishNotify'))
      }
      if (infoObject.info.code == 'NetStream.Play.Reset') {
        console.log('Stream Reset.');
        dispatchEvent(new SubscribeEvent('onStreamReset'))
      }
      if (infoObject.info.code == 'NetStream.Play.Start') {
        console.log('Broadcaster is Broadcasting.');
        dispatchEvent(new SubscribeEvent('onStreamPlaying'))

      }
      if (infoObject.info.code == 'NetStream.Play.UnpublishNotify') {
        console.log('Broadcaster Has Stopped Broadcasting.');
        dispatchEvent(new SubscribeEvent('onStreamStopped'))
      }
      if (infoObject.info.code == "NetStream.Play.StreamNotFound") {
        console.log('Broadcaster Is Not Found.');
        dispatchEvent(new SubscribeEvent('onStreamNotFound'))
      }
      if (infoObject.info.code == "NetStream.Play.Failed") {
        console.log('Broadcaster Status is unknown please check again.');
        dispatchEvent(new SubscribeEvent('onStreamUnknown'))
      }
    }


	}
}
